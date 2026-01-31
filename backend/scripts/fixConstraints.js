import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixConstraints() {
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

    // First, let's get the exact constraint name if possible (MySQL often generates random names for CHECK constraints)
    // But since we can't easily find it without querying information_schema, we might try dropping the CHECK constraint by name if it was named.
    // However, the CREATE TABLE output didn't show a name, so it's likely an inline CHECK constraint.
    // In MariaDB/MySQL, dropping a CHECK constraint usually requires knowing its name.
    
    // Let's try to query the constraint name from information_schema
    const [constraints] = await connection.query(`
        SELECT CONSTRAINT_NAME 
        FROM information_schema.TABLE_CONSTRAINTS 
        WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'cafe_ordering'}' 
        AND TABLE_NAME = 'hall_bookings' 
        AND CONSTRAINT_TYPE = 'CHECK'
    `);
    
    console.log('Found CHECK constraints:', constraints);

    for (const constraint of constraints) {
        // We need to check if this constraint is the one on time_slot.
        // Unfortunately, information_schema.CHECK_CONSTRAINTS doesn't always make it easy to link back to the column in a simple query across versions.
        // But we can try to drop them if we are sure.
        
        // Strategy: Drop the column and recreate it without the check, OR alter the table to drop the constraint if we can identify it.
        // Safer strategy for preserving data: 
        // 1. MODIFY the column to remove the CHECK constraint (doesn't always work in all MySQL versions directly).
        // 2. DROP the constraint by name.
        
        try {
             // Try to see the check clause to confirm
             const [checkClause] = await connection.query(`
                SELECT CHECK_CLAUSE 
                FROM information_schema.CHECK_CONSTRAINTS 
                WHERE CONSTRAINT_SCHEMA = '${process.env.DB_NAME || 'cafe_ordering'}' 
                AND CONSTRAINT_NAME = '${constraint.CONSTRAINT_NAME}'
             `);
             
             if (checkClause.length > 0) {
                 const clause = checkClause[0].CHECK_CLAUSE.toString();
                 if (clause.includes('time_slot')) {
                     console.log(`Dropping constraint ${constraint.CONSTRAINT_NAME} on time_slot...`);
                     await connection.query(`ALTER TABLE hall_bookings DROP CONSTRAINT ${constraint.CONSTRAINT_NAME}`);
                     console.log('✅ Constraint dropped.');
                 }
             }
        } catch (err) {
            console.warn(`Could not inspect/drop constraint ${constraint.CONSTRAINT_NAME}: ${err.message}`);
        }
    }
    
    // Fallback if the above didn't work (e.g. older MySQL/MariaDB versions):
    // Modify the column definition directly to just VARCHAR(50) without the check.
    // Note: MODIFY COLUMN usually keeps constraints unless explicitly dropped in some versions, 
    // but re-defining it might help.
    
    console.log("Ensuring time_slot column accepts any value...");
    try {
        await connection.query("ALTER TABLE hall_bookings MODIFY COLUMN time_slot VARCHAR(50) NOT NULL");
        console.log("✅ Column modified.");
    } catch (err) {
        console.error("Error modifying column:", err.message);
    }
    
    // Verify
    const [rows] = await connection.query("SHOW CREATE TABLE hall_bookings");
    console.log("New Table Definition:");
    console.log(rows[0]['Create Table']);

  } catch (error) {
    console.error('❌ Error fixing constraints:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixConstraints();
