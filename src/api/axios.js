import axios from "axios";

// Get API URL from environment variable
const getApiUrl = () => {
  // Vite automatically loads environment variables prefixed with VITE_
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    console.warn("⚠️ VITE_API_URL not set, using fallback");
    return "http://localhost:8080"; // fallback
  }

  return apiUrl;
};

const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: 30000, // Optional: 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
    // 'Authorization': `Bearer ${token}` // optional: for auth
  },
});

// Add request interceptor if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // Example: Attach token dynamically
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor if needed
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors (e.g., 401, 500)
    if (error.response?.status === 401) {
      // Optional: redirect to login or logout user
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
