import axios from 'axios';
import { toast } from "sonner";

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://erp-attendance.vercel.app/api",
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Error handling utility
export const handleApiError = (error, defaultMessage = "An error occurred") => {
  console.error(error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    toast.error(error.response.data.message || defaultMessage);
  } else if (error.request) {
    // The request was made but no response was received
    toast.error("Network Error: No response received from server");
  } else {
    // Something happened in setting up the request that triggered an Error
    toast.error(defaultMessage);
  }
};

export default api;

