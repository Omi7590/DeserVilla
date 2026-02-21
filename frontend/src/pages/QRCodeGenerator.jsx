import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer } from 'lucide-react';

const QRCodeGenerator = () => {
  const [baseUrl, setBaseUrl] = useState('https://desertvilla.in');
  const totalTables = 6;

  const downloadQR = (tableNumber) => {
    const svg = document.getElementById(`qr-table-${tableNumber}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = 1000;
    canvas.height = 1200;
    
    img.onload = () => {
      // White background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR code
      ctx.drawImage(img, 100, 200, 800, 800);
      
      // Add text
      ctx.fillStyle = '#000';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Desert Villa', 500, 100);
      
      ctx.font = 'bold 80px Arial';
      ctx.fillText(`Table ${tableNumber}`, 500, 1100);
      
      // Download
      const link = document.createElement('a');
      link.download = `table-${tableNumber}-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const printQR = (tableNumber) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    const qrElement = document.getElementById(`qr-container-${tableNumber}`);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Table ${tableNumber} QR Code</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .qr-container {
              text-align: center;
              padding: 40px;
            }
            h1 {
              font-size: 48px;
              margin-bottom: 20px;
              color: #333;
            }
            h2 {
              font-size: 64px;
              margin-top: 20px;
              color: #f97316;
            }
            @media print {
              body {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          ${qrElement.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const downloadAllQRs = () => {
    for (let i = 1; i <= totalTables; i++) {
      setTimeout(() => downloadQR(i), i * 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Table QR Codes Generator
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Generate QR codes for your restaurant tables
          </p>
          
          {/* Base URL Input */}
          <div className="max-w-2xl mx-auto mb-6">
            <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
              Website URL:
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://desertvilla.in"
            />
            <p className="text-sm text-gray-500 mt-2">
              Each QR code will link to: {baseUrl}/menu?table=[number]
            </p>
          </div>

          <button
            onClick={downloadAllQRs}
            className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <Download className="w-5 h-5" />
            Download All QR Codes
          </button>
        </div>

        {/* QR Codes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: totalTables }, (_, i) => i + 1).map((tableNumber) => (
            <div
              key={tableNumber}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all"
            >
              <div id={`qr-container-${tableNumber}`} className="qr-container text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Desert Villa
                </h2>
                
                <div className="flex justify-center mb-4">
                  <QRCodeSVG
                    id={`qr-table-${tableNumber}`}
                    value={`${baseUrl}/menu?table=${tableNumber}`}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                
                <h3 className="text-4xl font-bold text-primary-600 mb-2">
                  Table {tableNumber}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Scan to order
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => downloadQR(tableNumber)}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => printQR(tableNumber)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📋 How to Use
          </h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-primary-600">1.</span>
              <span>Update the website URL above to match your domain</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary-600">2.</span>
              <span>Click "Download" or "Download All" to save QR codes as PNG images</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary-600">3.</span>
              <span>Print the QR codes on high-quality paper or stickers</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary-600">4.</span>
              <span>Place each QR code on the corresponding table</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary-600">5.</span>
              <span>Customers scan the QR code and the table number is automatically selected!</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
