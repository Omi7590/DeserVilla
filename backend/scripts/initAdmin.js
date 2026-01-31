// Quick initialization script - sets default admin password to 'admin123'
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function initAdmin() {
  try {
    const password = 'admin123';
    const username = 'admin';
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM admin_users WHERE username = $1',
      [username]
    );
    
    if (existingUser.rows.length > 0) {
      // Update existing user
      await pool.query(
        'UPDATE admin_users SET password_hash = $1 WHERE username = $2',
        [passwordHash, username]
      );
      console.log(`✅ Admin user "${username}" password set to "${password}"`);
    } else {
      // Create new user
      await pool.query(
        'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
        [username, passwordHash]
      );
      console.log(`✅ Admin user "${username}" created with password "${password}"`);
    }
    
    console.log('\n⚠️  WARNING: This is the default password. Change it in production!');
    console.log('   Run: node scripts/setupAdmin.js\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing admin:', error);
    process.exit(1);
  }
}

initAdmin();

