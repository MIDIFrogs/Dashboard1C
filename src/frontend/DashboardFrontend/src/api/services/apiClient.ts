import axios from 'axios';

// Create axios instance with default config
export const apiClient = axios.create({
  // In development, use relative URLs to leverage Vite's proxy
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // 10 seconds
});

// Add request interceptor for authentication if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log('Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log('Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized access');
          // Redirect to login or show auth error
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
      }
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Handle network errors
      console.error('Network error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
); 