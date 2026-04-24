import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.PROD
        ? "https://seemedia.onrender.com/api"
        : "http://localhost:8000/api");

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})