import axios from 'axios';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5189';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error('Bad Request:', error.response.data);
          break;
        case 401:
          console.error('Unauthorized');
          break;
        case 404:
          console.error('Not Found');
          break;
        case 500:
          console.error('Server Error');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
); 