import axios from "axios";

/**
 * Axios client wrapper.
 * Sử dụng VITE_API_BASE nếu đã cấu hình environment.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Default export added for modules that import the client as default
export default apiClient;

// Optional: attach interceptors here (auth, error handling) nếu cần sau này