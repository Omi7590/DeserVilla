# 📱 QR Code Setup Guide for Tables

## Installation

First, install the QR code library:

```bash
cd frontend
npm install qrcode.react
```

## Access the QR Code Generator

Once installed, visit:
```
http://localhost:5173/qr-codes
```

Or in production:
```
https://desertvilla.in/qr-codes
```

## How It Works

### 1. QR Code URLs

Each table gets a unique QR code that links to:
- **Table 1**: `https://desertvilla.in/menu?table=1`
- **Table 2**: `https://desertvilla.in/menu?table=2`
- **Table 3**: `https://desertvilla.in/menu?table=3`
- **Table 4**: `https://desertvilla.in/menu?table=4`
- **Table 5**: `https://desertvilla.in/menu?table=5`
- **Table 6**: `https://desertvilla.in/menu?table=6`

### 2. Customer Experience

When a customer scans the QR code:
1. 📱 Opens the menu page automatically
2. ✅ Table number is pre-selected
3. 🛒 Customer can immediately start ordering
4. 💳 Checkout with table already set

## Generate QR Codes

### Step 1: Update Website URL

1. Go to `/qr-codes` page
2. Update the "Website URL" field to your production domain
3. Default: `https://desertvilla.in`

### Step 2: Download QR Codes

**Option A: Download All at Once**
- Click "Download All QR Codes" button
- All 6 QR codes will download automatically
- Files named: `table-1-qr.png`, `table-2-qr.png`, etc.

**Option B: Download Individual QR Codes**
- Click "Download" button on each table card
- Downloads that specific table's QR code

**Option C: Print Directly**
- Click "Print" button on each table card
- Opens print dialog for that QR code
- Print on high-quality paper

### Step 3: Print QR Codes

**Recommended Printing:**
- **Paper**: High-quality glossy or matte cardstock
- **Size**: A5 or A6 (fits nicely on tables)
- **Quality**: 300 DPI or higher
- **Lamination**: Recommended for durability

**Print Shops:**
- Local print shop
- Online services (Vistaprint, Printful, etc.)
- Office supply stores (Staples, FedEx Office)

### Step 4: Physical Placement

**Option A: Table Tents**
- Fold cardstock into triangle shape
- Place QR code on both sides
- Stands upright on table

**Option B: Laminated Cards**
- Laminate the QR code
- Place in acrylic holder
- Put on each table

**Option C: Stickers**
- Print as stickers
- Stick directly on table surface
- Waterproof and durable

**Option D: Frames**
- Print and frame
- Small photo frames work great
- Easy to replace if needed

## QR Code Features

### What's Included in Each QR Code:

```
┌─────────────────────┐
│   Desert Villa      │  ← Restaurant name
│                     │
│   [QR CODE IMAGE]   │  ← Scannable QR code
│                     │
│     Table 1         │  ← Table number
│   Scan to order     │  ← Call to action
└─────────────────────┘
```

### QR Code Specifications:

- **Format**: PNG image
- **Size**: 1000x1200 pixels
- **QR Code Size**: 800x800 pixels
- **Error Correction**: High (Level H)
- **Margin**: Included for easy scanning
- **Background**: White
- **Foreground**: Black

## Testing QR Codes

### Before Printing:

1. **Test on Your Phone**
   - Open camera app
   - Point at QR code on screen
   - Verify it opens correct URL
   - Check table number is pre-selected

2. **Test Different Phones**
   - iPhone camera
   - Android camera
   - QR scanner apps

3. **Test from Different Distances**
   - Should scan from 6-12 inches away
   - Should work in various lighting

### After Printing:

1. **Scan each printed QR code**
2. **Verify table number is correct**
3. **Test from customer's perspective**
4. **Check in different lighting conditions**

## Troubleshooting

### QR Code Not Scanning

**Problem**: Camera doesn't recognize QR code

**Solutions**:
- Ensure good lighting
- Hold phone steady
- Try different angle
- Clean camera lens
- Print at higher quality
- Increase QR code size

### Wrong Table Number

**Problem**: QR code opens wrong table

**Solutions**:
- Regenerate QR codes
- Verify URL in generator
- Check table number on printout
- Ensure correct placement

### URL Not Working

**Problem**: QR code opens but page doesn't load

**Solutions**:
- Verify website is live
- Check domain spelling
- Test URL in browser first
- Ensure SSL certificate is valid

## Customization

### Change Number of Tables

Edit `frontend/src/pages/QRCodeGenerator.jsx`:

```javascript
const totalTables = 6; // Change this number
```

### Change Design

Modify the QR code appearance:

```javascript
<QRCodeSVG
  value={`${baseUrl}/menu?table=${tableNumber}`}
  size={256}           // Change size
  level="H"            // Error correction level
  bgColor="#ffffff"    // Background color
  fgColor="#000000"    // Foreground color
  includeMargin={true} // Add margin
/>
```

### Add Logo to QR Code

Install additional package:
```bash
npm install qrcode.react
```

Then modify QRCodeSVG:
```javascript
<QRCodeSVG
  value={url}
  size={256}
  imageSettings={{
    src: '/logo.png',
    height: 50,
    width: 50,
    excavate: true,
  }}
/>
```

## Production Deployment

### Before Going Live:

1. ✅ Update base URL to production domain
2. ✅ Test all QR codes on production site
3. ✅ Print high-quality versions
4. ✅ Laminate for durability
5. ✅ Place on correct tables
6. ✅ Train staff on QR code system

### Maintenance:

- **Replace damaged QR codes** immediately
- **Keep backup copies** of all QR codes
- **Update if domain changes**
- **Clean QR codes** regularly

## Marketing Ideas

### Promote QR Code Ordering:

1. **Table Signs**: "Scan to Order - No Waiting!"
2. **Menu Cards**: Include QR code on physical menus
3. **Social Media**: Post about contactless ordering
4. **Staff Training**: Encourage customers to scan
5. **Incentives**: "Scan & Save 5%" promotions

## Benefits

### For Customers:
- ✅ No waiting for waiter
- ✅ Browse menu at own pace
- ✅ Order anytime
- ✅ Contactless ordering
- ✅ See real-time menu updates

### For Restaurant:
- ✅ Reduce staff workload
- ✅ Faster table turnover
- ✅ Fewer order mistakes
- ✅ Digital payment tracking
- ✅ Better customer data

## Support

If you need help:
1. Check this guide first
2. Test QR codes thoroughly
3. Verify website is accessible
4. Contact technical support if needed

---

**Ready to print your QR codes!** 🎉

Visit: `http://localhost:5173/qr-codes` to get started!
