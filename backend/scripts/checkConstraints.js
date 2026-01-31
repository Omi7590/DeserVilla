import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkConstraints() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cafe_ordering'
    });

    console.log("Checking table creation SQL for hall_bookings...");
    const [rows] = await connection.query("SHOW CREATE TABLE hall_bookings");
    console.log(rows[0]['Create Table']);

  } catch (error) {
    console.error('Error checking constraints:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkConstraints();
