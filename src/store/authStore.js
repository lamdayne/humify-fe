import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";
import { computed, ref } from "vue";
import { decodeJWT } from "../utils/jwt";

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref(localStorage.getItem('accessToken') || null)
    const refreshToken = ref(localStorage.getItem('refreshToken') || null)

    const isAuthenticated = computed(() => !!accessToken.value)

    const isSystemAdmin = computed(() => {
        if (!accessToken.value) return false

        try {
            const payload = decodeJWT(accessToken.value)
            return payload?.isSystemAdmin === true
        } catch (e) {
            return false
        }
    })

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

            return res
        } catch (error) {
            throw error
        }
    }

    const logout = async () => {
        try {
            accessToken.value = null
            refreshToken.value = null
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        } catch (error) {
            throw error
        }
    }

    return {
        login,
        isAuthenticated,
        logout
    }
})