// Keep backend alive by pinging every 10 minutes
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://deservilla.onrender.com/api';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

let pingInterval = null;

export const startKeepAlive = () => {
  // Don't ping in development
  if (import.meta.env.DEV) return;

  // Clear existing interval
  if (pingInterval) {
    clearInterval(pingInterval);
  }

  // Ping immediately
  pingBackend();

  // Then ping every 10 minutes
  pingInterval = setInterval(pingBackend, PING_INTERVAL);
  
  console.log('🔄 Backend keep-alive started');
};

export const stopKeepAlive = () => {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
    console.log('⏸️ Backend keep-alive stopped');
  }
};

const pingBackend = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/menu`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      console.log('✅ Backend ping successful');
    }
  } catch (error) {
    console.log('⚠️ Backend ping failed:', error.message);
  }
};
