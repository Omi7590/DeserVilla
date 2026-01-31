import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

// Validate Razorpay keys
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('⚠️  WARNING: Razorpay keys not found in .env file!');
  console.error('   Add these to backend/.env:');
  console.error('   RAZORPAY_KEY_ID=rzp_test_S8NeoHdaRK5wb0');
  console.error('   RAZORPAY_KEY_SECRET=FxDgWqopzQtGXud7Cz4hz5cm');
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

export const verifyWebhookSignature = (webhookBody, signature, secret) => {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(webhookBody));
  const generatedSignature = hmac.digest('hex');
  return generatedSignature === signature;
};

