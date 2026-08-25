import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";
import { ref } from "vue";

export const useWorkShiftStore = defineStore('workShift', () => {
    const shifts = ref([])

    const fetchShifts = async (page = 0, size = 10, sorts = 'id:asc') => {
        try {
            const res = await axiosInstance.get(`/work-shifts?page=${page}&size=${size}&sorts=${sorts}`)
            shifts.value = res.data.data.items
            return res.data
        } catch (error) {
            throw error;
        }
    }

    const createShift = async (shiftData) => {
        try {
            const res = await axiosInstance.post('/work-shifts', shiftData)
            return res.data
        } catch (error) {
            throw error;
        }
    }

    const updateShift = async (id, shiftData) => {
        try {
            const res = await axiosInstance.put(`/work-shifts/${id}`, shiftData)
            return res.data
        } catch (error) {
            throw error;
        }
    }

    const deleteShift = async (id) => {
        try {
            const res = await axiosInstance.delete(`/work-shifts/${id}`)
            return res.data
        } catch (error) {
            throw error;
        }
    };
    const workShifts = ref([])

    const fetchWorkShifts = async (page = 0, size = 100) => {
        try {
            const res = await axiosInstance.get(`/work-shifts?page=${page}&size=${size}`)
            if (res.data && res.data.data) {
                workShifts.value = res.data.data.items || []
            }

            return res.data
        } catch (error) {   
            throw error;
        }
    }

    return {

        shifts,
        fetchShifts,
        createShift,
        updateShift,
        deleteShift,

        workShifts,
        fetchWorkShifts

    }
})
