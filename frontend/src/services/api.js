import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  "https://future-fs-01-backend-7jvt.onrender.com/api";

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
