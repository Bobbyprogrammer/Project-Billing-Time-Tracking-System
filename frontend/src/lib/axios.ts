import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosInstance;
