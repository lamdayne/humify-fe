import { defineStore } from "pinia";
import axiosInstance from "../axios/axios"
import { ref } from "vue";

export const useEmployeeStore = defineStore('employee', () => {
    const employees = ref([])

    const fetchEmployees = async (page = 0, size = 10, sorts = 'id:asc') => {
        try {
            const res = await axiosInstance.get(`/employees?page=${page}&size=${size}&sorts=${sorts}`)
            employees.value = res.data.data.items
            return res.data
        } catch (error) {
            return error
        }
    }

    const createEmployee = async (employeeData) => {
        try {
            const res = await axiosInstance.post('/employees', employeeData)
            return res.data
        } catch (error) {
            throw error
        }
    }

    return {
        employees,
        fetchEmployees,
        createEmployee
    }
})