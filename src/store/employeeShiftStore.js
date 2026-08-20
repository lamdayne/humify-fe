import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";
import { ref } from "vue";

export const useEmployeeShiftStore = defineStore('employeeShift', () => {
    const employeeShifts = ref([])

    const fetchEmployeeShifts = async (page = 0, size = 10, sorts = 'id:asc') => {
        try {
            const res = await axiosInstance.get(`/employee-shifts?page=${page}&size=${size}&sorts=${sorts}`)
            if (res.data && res.data.data) {
                employeeShifts.value = res.data.data.items || []
            }
            return res.data
        } catch (error) {
            throw error;
        }
    }

    const assignShift = async (payload) => {
        try {
            const res = await axiosInstance.post('/employee-shifts', payload)
            return res.data
        } catch (error) {
            throw error;
        }
    }

    const updateEmployeeShift = async (id, payload) => {
        try {
            const res = await axiosInstance.put(`/employee-shifts/${id}`, payload)
            return res.data
        } catch (error) {
            throw error;
        }
    }

    const deleteEmployeeShift = async (id) => {
        try {
            const res = await axiosInstance.delete(`/employee-shifts/${id}`)
            return res.data
        } catch (error) {
            throw error;
        }
    }

    return {
        employeeShifts,
        fetchEmployeeShifts,
        assignShift,
        updateEmployeeShift,
        deleteEmployeeShift
    }
})
