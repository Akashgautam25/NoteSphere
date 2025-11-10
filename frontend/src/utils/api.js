// Universal API configuration that works on any device/network
export const getApiUrl = () => {
  // Use production URL for deployed app, localhost for development
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_PRODUCTION_API_URL || 'https://notesphere-api.onrender.com';
  }
  return process.env.REACT_APP_API_URL || 'http://localhost:5001';
};

// Enhanced API call with debugging
export const apiCall = async (endpoint, options = {}) => {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint}`;
  
  console.log('🌐 API Call:', {
    url,
    method: options.method || 'GET',
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  });
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    console.log('📡 Response:', {
      status: response.status,
      ok: response.ok,
      url: response.url
    });
    
    const data = await response.json();
    console.log('📦 Data:', data);
    
    return { data, status: response.status, ok: response.ok };
  } catch (error) {
    console.error('❌ API Error:', {
      message: error.message,
      url,
      stack: error.stack
    });
    throw error;
  }
};

// Mock API for offline/demo mode
export const mockApiCall = (endpoint, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (endpoint.includes('login') || endpoint.includes('signup')) {
        resolve({
          data: {
            token: 'demo-token-' + Date.now(),
            user: {
              id: 'demo-user',
              fullName: data.fullName || 'Demo User',
              email: data.email,
              name: data.fullName || 'Demo User'
            }
          }
        });
      }
    }, 500);
  });
};