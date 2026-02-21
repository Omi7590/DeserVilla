import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
      ssl: {
          rejectUnauthorized: false
      }
    });

    console.log('Connected!');

    const migrationPath = path.join(__dirname, '../../database/payment_system_migration.sql');
    console.log(`Reading migration file from: ${migrationPath}`);
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found at ${migrationPath}`);
    }

    const sqlFileContent = fs.readFileSync(migrationPath, 'utf8');
    
    // Split statements
    const statements = sqlFileContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Found ${statements.length} statements.`);

    for (const statement of statements) {
       console.log(`Executing: ${statement.substring(0, 50)}...`);
       try {
           await connection.query(statement);
       } catch (err) {
           if (err.code === 'ER_DUP_FIELDNAME') {
               console.log("⚠️  Column already exists, skipping.");
           } else {
               console.error(`❌ Error executing statement: ${statement}`);
               throw err;
           }
       }
    }

    console.log('✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error); // Log full error object
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
