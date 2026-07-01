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

    const createColumn = async (projectId, columnInfo) => {
        try {
            const res = await axiosInstance.post(`/projects/${projectId}/columns`, columnInfo)
            return res
        } catch (e) {
            throw e
        }
    }

    const reorderColumn = async (projectId, columnIds) => {
        try {
            const res = await axiosInstance.put(`/projects/${projectId}/columns/reorder`, columnIds)
            return res
        } catch (e) {
            throw e
        }
    }

    return {
        columns,
        fetchColumnsByProjectId,
        createColumn,
        reorderColumn
    }
})