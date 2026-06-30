import axios from "axios";

const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    console.warn("⚠️ VITE_API_URL not set, using fallback");
    return "http://localhost:8080";
  }
  return apiUrl;
};

const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // no-op: portfolio API has no auth
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
