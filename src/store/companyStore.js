import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";

export const useCompanyStore = defineStore('company', () => {


    const register = async (companyInfo) => {
        try {
            const res = await axiosInstance.post('/companies', companyInfo)
            return res
        } catch (error) {
            console.log('Register error: ', error);
            return error
        }
    }

    return {
        register
    }
})