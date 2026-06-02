import axios from "axios"

class Http {
    constructor() {
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            timeout: 50000,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        this.refreshTokenRequest = null
        this.instance.interceptors.request.use(
            (config) => {
                const accessToken = localStorage.getItem("access_token");
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`
                }
                return config;
            },
            (error) => Promise.reject(error)
        )
        this.instance.interceptors.response.use(
            (config) => {
                return config.data;
            },
            (error) => {
                console.log([error])
                if (error.response.status === 401) {
                    this.refreshTokenRequest = this.refreshTokenRequest
                        ? this.refreshTokenRequest
                        : refreshToken().finally(() => this.refreshTokenRequest = null)
                    return this.refreshTokenRequest.then(accessToken => {
                        error.response.config.Authorization = `Bearer ${accessToken}`
                        return this.instance(error.response.config) // gọi lại api với config cần xử lý lại
                    }).catch(refreshTokenError => {
                        throw refreshTokenError
                    })
                }
                return Promise.reject(error)
            }
        )
    }
    get(url, config = {}) {
        return this.instance.get(url, config);
    }

    post(url, body, config = {}) {
        return this.instance.post(url, body, config);
    }

    put(url, body, config = {}) {
        return this.instance.put(url, body, config);
    }

    patch(url, body, config = {}) {
        return this.instance.patch(url, body, config);
    }

    delete(url, config = {}) {
        return this.instance.delete(url, config);
    }
}

const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    try {
        const res = await http.post("/auth/refresh", { refreshToken })
        localStorage.setItem("access_token", res.accessToken)
        return res.accessToken;
    } catch (error) {
        localStorage.clear();
        throw error.response
    }
}

export default new Http()