import axios from "axios";
import { getCookie } from "@/shared/utils/getCookie";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = getCookie("jwt");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
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