import pool from '../config/database.js';

const requiredTables = [
  'tables',
  'menu_items',
  'orders',
  'order_items',
  'payments',
  'admin_users',
  'hall_bookings',
  'hall_booking_slots',
  'blocked_slots'
];

export const checkTables = async () => {
  try {
    const [tables] = await pool.execute(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = DATABASE() 
       AND table_type = 'BASE TABLE'`
    );

    // Handle different field name formats (TABLE_NAME vs table_name)
    const existingTables = tables.map(row => {
      const tableName = row.table_name || row.TABLE_NAME || Object.values(row)[0];
      return tableName ? tableName.toLowerCase() : '';
    }).filter(name => name);
    
    const missingTables = requiredTables.filter(
      table => !existingTables.includes(table.toLowerCase())
    );

    if (missingTables.length > 0) {
      console.warn('\n⚠️  WARNING: Missing database tables detected!');
      console.warn('   Missing tables:', missingTables.join(', '));
      console.warn('\n📋 To fix this:');
      console.warn('   1. Import your database schema');
      console.warn('   2. Check database connection settings\n');
      return false;
    }

    console.log('✅ All required database tables exist');
    return true;
  } catch (error) {
    console.error('❌ Error checking database tables:', error.message);
    console.warn('\n⚠️  Could not verify database tables. Please check your database connection.\n');
    return false;
  }
};

// Run check if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkTables()
    .then((allExist) => {
      process.exit(allExist ? 0 : 1);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

