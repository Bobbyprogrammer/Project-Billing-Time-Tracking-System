import axios from "axios";
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://project-billing-time-tracking-syste.vercel.app";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosInstance;
