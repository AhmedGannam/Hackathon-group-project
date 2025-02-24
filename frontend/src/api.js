import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded');
    } else if (!error.response) {
      console.error('Network error: Unable to connect to the server. Please ensure the server is running.');
    }
    return Promise.reject(error);
  }
);

// Export the api instance
export default api;
