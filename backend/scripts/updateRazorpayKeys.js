import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '.env');

const correctKeyId = 'rzp_test_S8NeoHdaRK5wb0';
const correctKeySecret = 'FxDgWqopzQtGXud7Cz4hz5cm';

try {
  let envContent = '';
  
  if (!fs.existsSync(envPath)) {
    console.log('Creating .env file with Razorpay keys...');
    envContent = `# Razorpay Configuration\nRAZORPAY_KEY_ID=${correctKeyId}\nRAZORPAY_KEY_SECRET=${correctKeySecret}\n`;
  } else {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  let updated = false;
  
  // Update or add RAZORPAY_KEY_ID
  if (envContent.includes('RAZORPAY_KEY_ID=')) {
    const oldValue = envContent.match(/RAZORPAY_KEY_ID=(.*)/)?.[1];
    if (oldValue !== correctKeyId) {
      envContent = envContent.replace(
        /RAZORPAY_KEY_ID=.*/,
        `RAZORPAY_KEY_ID=${correctKeyId}`
      );
      updated = true;
    }
  } else {
    envContent += `\nRAZORPAY_KEY_ID=${correctKeyId}`;
    updated = true;
  }
  
  // Update or add RAZORPAY_KEY_SECRET
  if (envContent.includes('RAZORPAY_KEY_SECRET=')) {
    const oldValue = envContent.match(/RAZORPAY_KEY_SECRET=(.*)/)?.[1];
    if (oldValue !== correctKeySecret) {
      envContent = envContent.replace(
        /RAZORPAY_KEY_SECRET=.*/,
        `RAZORPAY_KEY_SECRET=${correctKeySecret}`
      );
      updated = true;
    }
  } else {
    envContent += `\nRAZORPAY_KEY_SECRET=${correctKeySecret}`;
    updated = true;
  }
  
  fs.writeFileSync(envPath, envContent, 'utf8');
  
  if (updated) {
    console.log('✅ Razorpay keys updated in .env file');
    console.log('');
    console.log('Updated keys:');
    console.log(`   RAZORPAY_KEY_ID=${correctKeyId}`);
    console.log(`   RAZORPAY_KEY_SECRET=${correctKeySecret}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Restart your backend server for changes to take effect!');
  } else {
    console.log('✅ Razorpay keys are already correct');
    console.log(`   RAZORPAY_KEY_ID=${correctKeyId}`);
    console.log(`   RAZORPAY_KEY_SECRET=${correctKeySecret}`);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('');
  console.log('Please manually update backend/.env with:');
  console.log(`   RAZORPAY_KEY_ID=${correctKeyId}`);
  console.log(`   RAZORPAY_KEY_SECRET=${correctKeySecret}`);
}

