import bcrypt from 'bcryptjs';

const password = process.argv[2] || 'admin123';
bcrypt.hash(password, 10).then(hash => {
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});

