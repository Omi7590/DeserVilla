const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function importDatabase() {
  console.log('🔄 Connecting to Aiven MySQL...');
  
  const connection = await mysql.createConnection({
    host: 'mysql-32e81802-desertvilla.k.aivencloud.com',
    port: 19668,
    user: 'avnadmin',
    password: 'AVNS_Q0qTbhB28r--BKzi1vT',
    database: 'defaultdb',
    ssl: {
      rejectUnauthorized: false
    },
    multipleStatements: true
  });

  console.log('✅ Connected to database!');

  try {
    // Read SQL file
    const sqlFile = fs.readFileSync('cafe_ordering_clean.sql', 'utf8');

    console.log('📝 Executing SQL statements...');
    
    // Execute SQL
    await connection.query(sqlFile);
    
    console.log('✅ Database imported successfully!');
    console.log('');
    console.log('📊 Verifying tables...');
    
    // Verify tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });
    
  } catch (error) {
    console.error('❌ Error importing database:', error.message);
  } finally {
    await connection.end();
    console.log('\n🔒 Connection closed');
  }
}

importDatabase();
