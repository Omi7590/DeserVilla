import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupAdmin() {
  try {
    console.log('Admin User Setup\n');
    
    const username = await question('Enter username (default: admin): ') || 'admin';
    const password = await question('Enter password: ');
    
    if (!password) {
      console.error('Password is required!');
      process.exit(1);
    }
    
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
      console.log(`\n✅ Admin user "${username}" password updated successfully!`);
    } else {
      // Create new user
      await pool.query(
        'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
        [username, passwordHash]
      );
      console.log(`\n✅ Admin user "${username}" created successfully!`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupAdmin();

