import { defineStore } from 'pinia'
import axiosInstance from '../axios/axios'

export const useInvitationStore = defineStore('invitation', () => {

    const validateInvitation = async (token) => {
        const res = await axiosInstance.get('/invitations/validate', { params: { token } })
        return res.data?.data
    }

    const acceptInvitation = async (token) => {
        const res = await axiosInstance.post('/invitations/accept', { token })
        return res.data?.data
    }

    return { validateInvitation, acceptInvitation }
})
