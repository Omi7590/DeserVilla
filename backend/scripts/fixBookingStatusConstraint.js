import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixBookingStatusConstraint() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cafe_ordering',
      multipleStatements: true
    });

    console.log('Connected!');

    console.log("Checking current table definition...");
    const [rows] = await connection.query("SHOW CREATE TABLE hall_bookings");
    console.log(rows[0]['Create Table']);

    // Drop the constraint on booking_status if possible
    // We'll try to find it first, but fallback to modifying the column
    
    // Modify column to remove the inline check
    console.log("Removing CHECK constraint on booking_status...");
    try {
        await connection.query("ALTER TABLE hall_bookings MODIFY COLUMN booking_status VARCHAR(50) DEFAULT 'PENDING'");
        console.log("✅ Column booking_status modified.");
    } catch (err) {
        console.error("Error modifying booking_status:", err.message);
    }

    // Modify column to remove the inline check for payment_status as well, just in case
    console.log("Removing CHECK constraint on payment_status...");
    try {
        await connection.query("ALTER TABLE hall_bookings MODIFY COLUMN payment_status VARCHAR(50) DEFAULT 'PENDING'");
        console.log("✅ Column payment_status modified.");
    } catch (err) {
        console.error("Error modifying payment_status:", err.message);
    }
    
    // Verify
    const [newRows] = await connection.query("SHOW CREATE TABLE hall_bookings");
    console.log("New Table Definition:");
    console.log(newRows[0]['Create Table']);

  } catch (error) {
    console.error('❌ Error fixing constraints:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixBookingStatusConstraint();
