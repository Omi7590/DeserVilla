import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function updateHallBookingSchema() {
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

    const columnsToAdd = [
      "ADD COLUMN remaining_amount DECIMAL(10, 2) DEFAULT 0 AFTER advance_amount",
      "ADD COLUMN total_hours INT DEFAULT 0 AFTER remaining_amount",
      "ADD COLUMN total_amount DECIMAL(10, 2) DEFAULT 0 AFTER total_hours",
      "ADD COLUMN payment_mode VARCHAR(50) DEFAULT 'ONLINE_ADVANCE' AFTER total_amount"
    ];

    for (const colDef of columnsToAdd) {
      try {
        const colName = colDef.split(' ')[2]; // Extract column name
        // Check if column exists
        const [existing] = await connection.query(`SHOW COLUMNS FROM hall_bookings LIKE '${colName}'`);
        
        if (existing.length === 0) {
            console.log(`Adding column ${colName}...`);
            await connection.query(`ALTER TABLE hall_bookings ${colDef}`);
            console.log(`✅ Added ${colName}`);
        } else {
            console.log(`Column ${colName} already exists.`);
        }
      } catch (err) {
        console.error(`Error adding column: ${err.message}`);
      }
    }

    console.log('✅ Hall Booking schema updated successfully!');

  } catch (error) {
    console.error('❌ Error updating database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateHallBookingSchema();
