import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateDatabase() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('Connected!');

    // Read schema file
    const schemaPath = path.join(__dirname, '../../database/schema_mysql_complete.sql');
    console.log(`Reading schema from: ${schemaPath}`);
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error('Schema file not found!');
    }

    const sqlFileContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon, but be careful about semicolons in strings (though unlikely in this schema)
    // A simple split by ";\n" or just ";" might work for this specific file
    const statements = sqlFileContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Found ${statements.length} statements to execute.`);

    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (err) {
        // Ignore "Table already exists" or "Duplicate entry" errors
        // But log others
        if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_ENTRY') {
            // ignore
        } else {
            console.warn(`⚠️  Warning executing statement: ${statement.substring(0, 50)}...`);
            console.warn(`   Error: ${err.message}`);
        }
      }
    }
    
    // Specific fix for 'tables' table missing 'capacity' column
    try {
        console.log("Checking 'tables' schema...");
        const [columns] = await connection.query("SHOW COLUMNS FROM tables LIKE 'capacity'");
        if (columns.length === 0) {
            console.log("Adding missing 'capacity' column to 'tables'...");
            await connection.query("ALTER TABLE tables ADD COLUMN capacity INT DEFAULT 4");
            console.log("✅ Added 'capacity' column.");
        }
    } catch (err) {
        console.error("Error checking/fixing tables schema:", err.message);
    }

    console.log('✅ Database update completed!');

  } catch (error) {
    console.error('❌ Error updating database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateDatabase();
