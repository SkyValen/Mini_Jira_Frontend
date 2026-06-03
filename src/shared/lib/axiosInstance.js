import axios from "axios";
import { getCookie } from "./cookieUtils";

const axiosInstance = axios.create({
    baseUrl: process.env.BACKEND_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = getCookie("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
    }
)

axiosInstance.interceptors.response.use(
    (response) => {return response},
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access, e.g., redirect to login page
            console.error("Unauthorized access - redirecting to login");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;