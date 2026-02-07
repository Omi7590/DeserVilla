// QR Code Generation Script
// Install: npm install qrcode
// Usage: node scripts/generateQR.js

import QRCode from 'qrcode';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const OUTPUT_DIR = join(__dirname, '../qr-codes');
const NUM_TABLES = 6;

// Create output directory if it doesn't exist
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateQRCodes() {
  console.log('Generating QR codes...\n');
  console.log(`Frontend URL: ${FRONTEND_URL}\n`);

  for (let i = 1; i <= NUM_TABLES; i++) {
    const url = `${FRONTEND_URL}/menu?table=${i}`;
    const filePath = join(OUTPUT_DIR, `table-${i}.png`);

    try {
      await QRCode.toFile(filePath, url, {
        errorCorrectionLevel: 'M',
        type: 'png',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      console.log(`✅ Table ${i}: ${filePath}`);
      console.log(`   URL: ${url}\n`);
    } catch (error) {
      console.error(`❌ Error generating QR for Table ${i}:`, error.message);
    }
  }

  console.log('QR code generation complete!');
  console.log(`Files saved in: ${OUTPUT_DIR}`);
}

generateQRCodes().catch(console.error);

