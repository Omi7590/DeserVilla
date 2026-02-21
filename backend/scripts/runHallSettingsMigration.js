import pool from '../config/database.js';

async function runMigration() {
  console.log('========================================');
  console.log('  Hall Settings Database Migration');
  console.log('========================================\n');

  const client = await pool.connect();

  try {
    console.log('Creating hall_settings table...\n');

    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS hall_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        setting_key VARCHAR(50) UNIQUE NOT NULL,
        setting_value VARCHAR(255) NOT NULL,
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✓ Table created\n');
    console.log('Inserting default settings...\n');

    // Insert default settings
    await client.query(`
      INSERT INTO hall_settings (setting_key, setting_value, description) 
      VALUES ('hourly_rate', '500', 'Price per hour for hall booking in INR')
      ON DUPLICATE KEY UPDATE setting_value = setting_value
    `);

    await client.query(`
      INSERT INTO hall_settings (setting_key, setting_value, description) 
      VALUES ('start_hour', '10', 'Hall booking start hour (24-hour format)')
      ON DUPLICATE KEY UPDATE setting_value = setting_value
    `);

    await client.query(`
      INSERT INTO hall_settings (setting_key, setting_value, description) 
      VALUES ('end_hour', '20', 'Hall booking end hour (24-hour format)')
      ON DUPLICATE KEY UPDATE setting_value = setting_value
    `);

    console.log('✓ Migration completed successfully!\n');
    console.log('Hall settings table created with default values:');
    console.log('  - Hourly Rate: ₹500');
    console.log('  - Start Hour: 10:00 AM');
    console.log('  - End Hour: 8:00 PM (20:00)\n');
    console.log('You can now edit these settings from the Admin Panel > Hall Settings\n');

    // Verify the data
    const result = await client.query('SELECT * FROM hall_settings ORDER BY setting_key');
    console.log('Current settings in database:');
    result.rows.forEach(row => {
      console.log(`  ${row.setting_key}: ${row.setting_value}`);
    });

    client.release();
    process.exit(0);
  } catch (error) {
    client.release();
    console.error('\n✗ Migration failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'ER_TABLE_EXISTS_ALREADY') {
      console.log('\nTable already exists. Checking current settings...');
      try {
        const result = await pool.query('SELECT * FROM hall_settings ORDER BY setting_key');
        console.log('\nCurrent settings:');
        result.rows.forEach(row => {
          console.log(`  ${row.setting_key}: ${row.setting_value}`);
        });
      } catch (e) {
        console.error('Could not read settings:', e.message);
      }
    }
    
    process.exit(1);
  }
}

runMigration();
