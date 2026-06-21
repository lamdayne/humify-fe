import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";
import { ref } from "vue";

export const useBranchStore = defineStore('branch', () => {
    const branches = ref([])

    const fetchBranches = async (page = 0, size = 10, sorts = 'id:asc') => {
        try {
            const res = await axiosInstance.get(`/branches?page=${page}&size=${size}&sorts=${sorts}`)
            branches.value = res.data.data.items
            return res.data
        } catch (error) {
            throw error;
        }
    }

    const createBranch = async (branchData) => {
        try {
            const res = await axiosInstance.post('/branches', branchData)
            return res.data
        } catch (error) {
            throw error;
        }
    }

    const updateBranch = async (id, branchData) => {
        try {
            const res = await axiosInstance.put(`/branches/${id}`, branchData)
            return res.data
        } catch (error) {
            throw error;
        }
    }


    const deleteBranchLocal = async (id) => {
        try {

            branches.value = branches.value.filter(b => b.id !== id)
        } catch (error) {
            throw error;
        }
    }

    return {
        branches,
        fetchBranches,
        createBranch,
        updateBranch,
        deleteBranchLocal
    }
})

