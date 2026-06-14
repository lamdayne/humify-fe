import axios from "axios";

let refreshTokenRequest = null
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        if (config.url === '/auth/refresh') {
            return config
        }
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        console.log([error])
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (config) => {
        return config
    },
    async (error) => {
        console.log([error])
        const originalRequest = error.config

        console.log(error.response);

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true // tránh loop

            try {
                if (!refreshTokenRequest) {
                    refreshTokenRequest = refreshToken()
                }

                const res = await refreshTokenRequest
                const { accessToken, refreshToken: newRefreshToken } = res.data.data

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
                console.log(refreshError);

            } finally {
                refreshTokenRequest = null
            }
        }
        return Promise.reject(error)
    }
)

const refreshToken = async () => {
    const token = localStorage.getItem('refreshToken')
    const res = await axiosInstance.post("/auth/refresh", {}, {
        headers: {
            'x-refresh-token': token
        }
    })
    return res
}

export default axiosInstance