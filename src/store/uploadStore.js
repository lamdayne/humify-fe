import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";
import axios from "axios";

export const useUploadStore = defineStore('upload', () => {

    const getPresignedUrl = async (subfolder = 'general') => {
        try {
            const res = await axiosInstance.get(`/media/presign?subfolder=${subfolder}`)
            return res
        } catch (e) {
            throw e
        }
    }

    const uploadToCloudinary = async (file, presignData) => {
        try {
            const { apiKey, cloudName, folder, signature, timestamp, uploadUrl } = presignData

            const formData = new FormData()
            formData.append('file', file)
            formData.append('api_key', apiKey)
            formData.append('timestamp', timestamp)
            formData.append('signature', signature)
            formData.append('folder', folder)

            const res = await axios.post(uploadUrl, formData)
            return res.data
        } catch (e) {
            throw e
        }
    }

    return {
        getPresignedUrl,
        uploadToCloudinary
    }

})