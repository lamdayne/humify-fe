import { defineStore } from "pinia";
import { ref } from "vue";
import axiosInstance from "../axios/axios";


export const useColumnStore = defineStore('column', () => {
    const columns = ref([])

    const fetchColumnsByProjectId = async (projectId) => {
        try {
            const res = await axiosInstance.get(`/projects/${projectId}/columns`)
            return res
        } catch (e) {
            throw e
        }
    }

    return {
        columns,
        fetchColumnsByProjectId
    }
})