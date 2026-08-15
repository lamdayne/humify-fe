import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

let isRefreshing = false
let failedQueue = []

axiosInstance.interceptors.response.use(
    (config) => {
        return config
    },
    async (error) => {
        console.log([error])

        const originalRequest = error.config;
        const errorResponse = error.response;

        if (
            errorResponse?.status === 401 &&
            errorResponse?.data?.code === 'USER_NOT_ACTIVATED'
        ) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login?error=account_deactivated'
            return Promise.reject(error)
        }

        if (
            errorResponse?.status === 401 &&
            errorResponse?.data?.code === 'JWT_EXPIRED' &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return axiosInstance(originalRequest)
                    })
                    .catch((err) => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            const refreshToken = localStorage.getItem('refreshToken')
            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    undefined,
                    {
                        headers: {
                            'x-refresh-token': refreshToken
                        }
                    }
                )

                const newAccessToken = data?.data?.accessToken;
                localStorage.setItem('accessToken', newAccessToken)
                if (data?.data?.refreshToken) {
                    localStorage.setItem('refreshToken', data?.data?.refreshToken)
                }

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

                processQueue(null, newAccessToken)
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)

                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

const processQueue = (error, token = null) => {
    failedQueue.forEach((value) => {
        if (error) {
            value.reject(error)
        } else {
            value.resolve(token)
        }
    })
    failedQueue = []
}

export default axiosInstance