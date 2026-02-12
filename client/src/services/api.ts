import axios from 'axios';

// Create a configured instance of axios
export const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Your backend URL
});

// Helper to extract error messages cleanly
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data.message || "An unexpected error occurred";
  }
  return "Network error or server unreachable";
};