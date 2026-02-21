// Check admin user in database
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkAdmin() {
  try {
    console.log('Checking admin users in database...\n');

    // Get all admin users
    const result = await pool.query('SELECT id, username, password_hash, created_at FROM admin_users');

    if (result.rows.length === 0) {
      console.log('❌ No admin users found in database!');
      console.log('Run: node backend/scripts/initAdmin.js to create one\n');
      process.exit(1);
    }

    console.log(`Found ${result.rows.length} admin user(s):\n`);

    for (const user of result.rows) {
      console.log(`ID: ${user.id}`);
      console.log(`Username: ${user.username}`);
      console.log(`Password Hash: ${user.password_hash}`);
      console.log(`Created: ${user.created_at}`);

      // Test password
      const testPassword = 'admin123';
      const isValid = await bcrypt.compare(testPassword, user.password_hash);
      console.log(`Password "admin123" works: ${isValid ? '✅ YES' : '❌ NO'}`);
      console.log('---\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking admin:', error);
    process.exit(1);
  }
}

checkAdmin();
