import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '.env');

const razorpayKeys = `
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_S8NeoHdaRK5wb0
RAZORPAY_KEY_SECRET=FxDgWqopzQtGXud7Cz4hz5cm
`;

try {
  let envContent = '';
  
  // Read existing .env if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Check if keys already exist
  if (envContent.includes('RAZORPAY_KEY_ID') && envContent.includes('RAZORPAY_KEY_SECRET')) {
    console.log('✅ Razorpay keys already exist in .env file');
    
    // Show current keys
    const lines = envContent.split('\n');
    const keyIdLine = lines.find(line => line.includes('RAZORPAY_KEY_ID'));
    const keySecretLine = lines.find(line => line.includes('RAZORPAY_KEY_SECRET'));
    
    if (keyIdLine) console.log(`   ${keyIdLine.trim()}`);
    if (keySecretLine) console.log(`   ${keySecretLine.trim()}`);
  } else {
    // Add keys to .env
    if (envContent && !envContent.endsWith('\n')) {
      envContent += '\n';
    }
    envContent += razorpayKeys;
    
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ Razorpay keys added to .env file');
    console.log('');
    console.log('Added:');
    console.log('   RAZORPAY_KEY_ID=rzp_test_S8NeoHdaRK5wb0');
    console.log('   RAZORPAY_KEY_SECRET=FxDgWqopzQtGXud7Cz4hz5cm');
    console.log('');
    console.log('⚠️  IMPORTANT: Restart your backend server for changes to take effect!');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('');
  console.log('Please manually add these lines to backend/.env:');
  console.log('   RAZORPAY_KEY_ID=rzp_test_S8NeoHdaRK5wb0');
  console.log('   RAZORPAY_KEY_SECRET=FxDgWqopzQtGXud7Cz4hz5cm');
}

