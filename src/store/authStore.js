import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";
import { computed, ref } from "vue";
import { decodeJWT } from "../utils/jwt";

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const accessToken = ref(localStorage.getItem('accessToken') || null)
    const refreshToken = ref(localStorage.getItem('refreshToken') || null)

    const isAuthenticated = computed(() => !!accessToken.value)

    const permissions = ref([])

    const isSystemAdmin = computed(() => {
        if (!accessToken.value) return false

        try {
            const payload = decodeJWT(accessToken.value)
            return payload?.isSystemAdmin === true
        } catch (e) {
            return false
        }
    })

    const canView = (resources) => permissions.value.includes(`${resources}_READ`)
        || permissions.value.includes(`${resources}_FULL`)

    const login = async (user) => {
        try {
            const res = await axiosInstance.post('/auth/login', user, {
                headers: {
                    'x-company-code': user.companyCode
                }
            })

            const { accessToken: at, refreshToken: rt } = res.data.data
            accessToken.value = at
            refreshToken.value = rt
            localStorage.setItem('accessToken', at)
            localStorage.setItem('refreshToken', rt)

            await fetchMe()

            return res
        } catch (error) {
            throw error
        }
    }

    const logout = async () => {
        try {
            accessToken.value = null
            refreshToken.value = null
            permissions.value = []

            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        } catch (error) {
            throw error
        }
    }

    const fetchMe = async () => {
        try {
            const res = await axiosInstance.get("/auth/me")
            permissions.value = res.data?.data?.permissions;
            user.value = res.data.data
            return res
        } catch (error) {
            throw error
        }
    }

    const verifyCompany = async (token) => {
        try {
            const res = await axiosInstance.post('/auth/verify-company', null, {
                headers: {
                    'x-verify-token': token
                }
            })
            return res
        } catch (error) {
            throw error
        }
    }

    const resendVerifyCompany = async (token) => {
        try {
            const res = await axiosInstance.post('/auth/resend-verify', null, {
                headers: {
                    'x-verify-token': token
                }
            })
            return res
        } catch (error) {
            throw error
        }
    }

    const getSocialLoginUrl = async (type = 'google') => {
        try {
            const res = await axiosInstance.get('/auth/social-login', { params: { type } })
            return res.data?.data?.loginUrl
        } catch (error) {
            throw error
        }
    }

    const socialLoginCallback = async (code, type = 'google', companyCode = null) => {
        try {
            const payload = { code }
            if (companyCode) {
                payload.companyCode = companyCode
            }
            const res = await axiosInstance.post(`/auth/social/callback`, payload, {
                params: { type }
            })

            const { accessToken: at, refreshToken: rt } = res.data.data
            accessToken.value = at
            refreshToken.value = rt
            localStorage.setItem('accessToken', at)
            localStorage.setItem('refreshToken', rt)

            await fetchMe()

            return res
        } catch (error) {
            throw error
        }
    }

    return {
        login,
        isAuthenticated,
        logout,
        permissions,
        isSystemAdmin,
        accessToken,
        refreshToken,
        fetchMe,
        canView,
        user,
        verifyCompany,
        resendVerifyCompany,
        getSocialLoginUrl,
        socialLoginCallback
    }
}
)