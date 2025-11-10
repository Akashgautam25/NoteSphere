// Universal API configuration that works on any device/network
export const getApiUrl = () => {
  // Always use localhost for now - will work with offline mode
  return 'http://localhost:5001';
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