// Test database connection script
import db from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    console.log('Config:', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'cafe_ordering',
      user: process.env.DB_USER || 'root'
    });

    // Test connection
    const result = await db.query('SELECT NOW() as now');
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].now);

    // Check if tables exist (MySQL syntax)
    const tablesCheck = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `, [process.env.DB_NAME || 'cafe_ordering']);

    console.log('\n📊 Existing tables:');
    if (tablesCheck.rows.length === 0) {
      console.log('⚠️  No tables found! Please import database/schema_mysql_complete.sql');
    } else {
      tablesCheck.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }

    // Check required tables
    const requiredTables = ['tables', 'menu_items', 'orders', 'order_items', 'payments', 'admin_users', 'hall_bookings', 'hall_booking_slots', 'blocked_slots'];
    const existingTables = tablesCheck.rows.map(r => r.table_name);
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));

    if (missingTables.length > 0) {
      console.log('\n❌ Missing required tables:');
      missingTables.forEach(t => console.log(`  - ${t}`));
      console.log('\n💡 Import database/schema_mysql_complete.sql using phpMyAdmin or MySQL command line');
      console.log('   Quick steps:');
      console.log('   1. Open http://localhost/phpmyadmin');
      console.log('   2. Select "cafe_ordering" database');
      console.log('   3. Click "Import" tab');
      console.log('   4. Choose file: database/schema_mysql_complete.sql');
      console.log('   5. Click "Go"');
    } else {
      console.log('\n✅ All required tables exist!');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.error('\n💡 Make sure MySQL/MariaDB is running in XAMPP');
      console.error('   Start Apache and MySQL from XAMPP Control Panel');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
      console.error('\n💡 Check your database credentials in backend/.env file');
      console.error('   Default XAMPP MySQL: user=root, password=(empty)');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Database does not exist. Create it using phpMyAdmin or:');
      console.error('   CREATE DATABASE cafe_ordering;');
    }
    
    process.exit(1);
  }
}

testDatabase();

