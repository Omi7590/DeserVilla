export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = (options) => {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Razorpay SDK not loaded'));
      return;
    }

    // Detect if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const razorpayOptions = {
      key: options.key,
      amount: options.amount,
      currency: options.currency,
      name: 'Desert Villa',
      description: `Order #${options.orderId}`,
      order_id: options.razorpayOrderId,
      handler: function (response) {
        resolve(response);
      },
      prefill: {
        name: options.customerName || 'Customer',
        email: options.customerEmail || 'customer@example.com',
        contact: options.customerPhone || '9999999999'
      },
      theme: {
        color: '#f1784a',
        backdrop_color: 'rgba(0, 0, 0, 0.5)'
      },
      // Enable all payment methods with UPI prioritized
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
        emi: false
      },
      config: {
        display: {
          blocks: {
            recommended: {
              name: 'Recommended',
              instruments: [
                {
                  method: 'upi',
                  flows: ['intent', 'collect', 'qr']  // Enable all UPI flows
                }
              ]
            },
            other: {
              name: 'Other Payment Methods',
              instruments: [
                { method: 'card' },
                { method: 'netbanking' },
                { method: 'wallet' }
              ]
            }
          },
          sequence: ['block.recommended', 'block.other'],
          preferences: {
            show_default_blocks: false
          }
        }
      },
      // UPI specific options for mobile
      upi: {
        flow: isMobile ? 'intent' : 'collect',  // Use intent on mobile for direct app opening
        apps: [
          'google_pay',
          'phonepe',
          'paytm',
          'bhim',
          'amazon_pay',
          'whatsapp'
        ]
      },
      modal: {
        confirm_close: true,
        ondismiss: function() {
          reject(new Error('Payment cancelled'));
        },
        escape: true,
        backdropclose: false
      },
      retry: {
        enabled: true,
        max_count: 3
      },
      timeout: 900  // 15 minutes timeout
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  });
};

