import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkSchema() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cafe_ordering'
    });

    const [columns] = await connection.query("SHOW COLUMNS FROM hall_bookings");
    console.log("Columns in hall_bookings:");
    columns.forEach(col => console.log(`- ${col.Field} (${col.Type})`));

  } catch (error) {
    console.error('Error checking schema:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkSchema();
