import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create MySQL connection pool
const mysqlPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'cafe_ordering',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud') 
    ? { rejectUnauthorized: false } 
    : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false)
});

// Test connection
mysqlPool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
  });

// Convert PostgreSQL-style queries ($1, $2, ...) to MySQL (?)
function convertQuery(text) {
  if (!text) return { query: text, returningColumns: null };
  
  // Normalize whitespace - replace multiple spaces/newlines with single space
  let normalized = text.replace(/\s+/g, ' ').trim();
  
  // Convert $1, $2, etc. to ?
  let converted = normalized;
  const paramMatches = normalized.match(/\$\d+/g);
  if (paramMatches) {
    // Replace all $1, $2, etc. with ?
    converted = normalized.replace(/\$\d+/g, '?');
  }
  
  // Handle RETURNING clause - MySQL doesn't support it
  // Match RETURNING followed by column list (can be multi-word)
  const returningMatch = converted.match(/RETURNING\s+([^;]+?)(?:\s*;|\s*$)/i);
  let returningColumns = null;
  if (returningMatch) {
    returningColumns = returningMatch[1].trim();
    // Remove RETURNING clause completely
    converted = converted.replace(/RETURNING\s+[^;]+?(?:\s*;|\s*$)/i, '').trim();
    // Remove trailing semicolon if present
    converted = converted.replace(/;+\s*$/, '');
  }
  
  // Handle ON CONFLICT - convert to ON DUPLICATE KEY UPDATE
  if (converted.includes('ON CONFLICT')) {
    // Simple conversion - for unique constraints
    converted = converted.replace(/ON CONFLICT\s*\(([^)]+)\)\s*DO NOTHING/gi, 
      'ON DUPLICATE KEY UPDATE id=id');
    converted = converted.replace(/ON CONFLICT\s*\(([^)]+)\)\s*DO UPDATE\s+SET\s+(.+?)(?:\s*;|\s*$)/gi, 
      (match, conflictCols, updateSet) => {
        return `ON DUPLICATE KEY UPDATE ${updateSet.trim()}`;
      });
  }
  
  return { query: converted.trim(), returningColumns };
}

// Wrapper to make MySQL pool compatible with PostgreSQL-style queries
const query = async (text, params) => {
  try {
    const { query: convertedQuery, returningColumns } = convertQuery(text);
    const [rows, fields] = await mysqlPool.execute(convertedQuery, params || []);
    
    let result = { rows: Array.isArray(rows) ? rows : [], rowCount: Array.isArray(rows) ? rows.length : 0 };
    
    // If there was a RETURNING clause and it's an INSERT, get the last insert ID
    if (returningColumns && text.toUpperCase().includes('INSERT')) {
      const [insertResult] = await mysqlPool.execute('SELECT LAST_INSERT_ID() as id');
      const lastId = insertResult[0].id;
      
      // If returning specific columns, fetch the inserted row
      if (returningColumns !== '*') {
        const tableMatch = text.match(/INSERT\s+INTO\s+(\w+)/i);
        if (tableMatch) {
          const tableName = tableMatch[1];
          const [insertedRow] = await mysqlPool.execute(
            `SELECT ${returningColumns} FROM ${tableName} WHERE id = ?`,
            [lastId]
          );
          if (insertedRow.length > 0) {
            result.rows = insertedRow;
          }
        }
      }
    }
    
    return result;
  } catch (error) {
    throw error;
  }
};

// Create a connection wrapper that mimics PostgreSQL's pool.connect()
const connect = async () => {
  const connection = await mysqlPool.getConnection();
  
  // Wrap connection methods to support transactions
  return {
    query: async (text, params) => {
      const upperText = text.toUpperCase().trim();
      
      // Handle transaction commands
      if (upperText === 'BEGIN') {
        await connection.beginTransaction();
        return { rows: [], rowCount: 0 };
      }
      
      if (upperText === 'COMMIT') {
        await connection.commit();
        return { rows: [], rowCount: 0 };
      }
      
      if (upperText === 'ROLLBACK') {
        await connection.rollback();
        return { rows: [], rowCount: 0 };
      }
      
      // Handle regular queries
      const { query: convertedQuery, returningColumns } = convertQuery(text);
      const [rows, fields] = await connection.execute(convertedQuery, params || []);
      
      let result = { rows: Array.isArray(rows) ? rows : [], rowCount: Array.isArray(rows) ? rows.length : 0 };
      
      // Handle RETURNING clause for INSERT
      if (returningColumns && text.toUpperCase().includes('INSERT')) {
        const [insertResult] = await connection.execute('SELECT LAST_INSERT_ID() as id');
        const lastId = insertResult[0].id;
        
        if (returningColumns && returningColumns !== '*') {
          const tableMatch = text.match(/INSERT\s+INTO\s+(\w+)/i);
          if (tableMatch) {
            const tableName = tableMatch[1];
            // Sanitize column names - remove any SQL injection attempts
            const safeColumns = returningColumns.split(',').map(col => col.trim()).filter(col => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(col)).join(', ');
            if (safeColumns) {
              try {
                const [insertedRow] = await connection.execute(
                  `SELECT ${safeColumns} FROM ${tableName} WHERE id = ?`,
                  [lastId]
                );
                if (insertedRow.length > 0) {
                  result.rows = insertedRow;
                }
              } catch (err) {
                console.error('Error fetching inserted row:', err.message);
                // Fallback: just return the ID
                result.rows = [{ id: lastId }];
              }
            } else {
              result.rows = [{ id: lastId }];
            }
          } else {
            result.rows = [{ id: lastId }];
          }
        } else {
          result.rows = [{ id: lastId }];
        }
      }
      
      return result;
    },
    release: () => connection.release(),
    beginTransaction: () => connection.beginTransaction(),
    commit: () => connection.commit(),
    rollback: () => connection.rollback()
  };
};

// Export pool with PostgreSQL-compatible interface
const pool = {
  query,
  connect,
  pool: mysqlPool,
  getConnection: () => mysqlPool.getConnection(),
  execute: (text, params) => mysqlPool.execute(text, params || [])
};

export default pool;

