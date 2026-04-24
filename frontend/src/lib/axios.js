import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.PROD
        ? "https://seemedia.onrender.com/api"
        : "http://localhost:8000/api");

const AUTH_TOKEN_KEY = "seeMediaAuthToken";
const MAX_GET_RETRY_ATTEMPTS = 2;
const RETRYABLE_STATUS = [408, 425, 429, 500, 502, 503, 504];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
};

export const clearAuthToken = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getAuthToken = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const warmupBackend = async () => {
    const backendBaseUrl = API_BASE_URL.replace(/\/api\/?$/, "");

    try {
        await axios.get(`${backendBaseUrl}/`, { timeout: 10000 });
        return true;
    } catch {
        return false;
    }
};

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config;

        if (!config) {
            return Promise.reject(error);
        }

        const method = (config.method || "get").toLowerCase();
        const status = error?.response?.status;
        const isNetworkError = !error?.response;
        const isRetryable = isNetworkError || RETRYABLE_STATUS.includes(status);

        if (method !== "get" || !isRetryable) {
            return Promise.reject(error);
        }

        config.__retryCount = (config.__retryCount || 0) + 1;

        if (config.__retryCount > MAX_GET_RETRY_ATTEMPTS) {
            return Promise.reject(error);
        }

        await sleep(1200 * config.__retryCount);
        return axiosInstance(config);
    }
);