import { defineStore } from "pinia";
import { ref } from "vue";
import axiosInstance from "../axios/axios";

export const useSprintStore = defineStore('sprint', () => {
    const sprints = ref([])

    const fetchSprints = async (projectId, status = null) => {
        try {
            const params = status ? { status } : {}
            const res = await axiosInstance.get(`/projects/${projectId}/sprints`, { params })
            sprints.value = res.data?.data || []
            return res
        } catch (e) {
            throw e
        }
    }

    const createSprint = async (projectId, sprintInfo) => {
        try {
            const res = await axiosInstance.post(`/projects/${projectId}/sprints`, sprintInfo)
            const created = res.data?.data
            if (created) {
                sprints.value.push(created)
            }
            return res
        } catch (e) {
            throw e
        }
    }

    const updateSprintStatus = async (sprintId, status) => {
        try {
            const res = await axiosInstance.put(`/sprints/${sprintId}/status`, { status })
            const updated = res.data?.data
            if (updated) {
                const idx = sprints.value.findIndex(s => s.id === sprintId)
                if (idx !== -1) sprints.value[idx] = updated
            }
            return res
        } catch (e) {
            throw e
        }
    }

    const updateSprint = async (sprintId, sprintInfo) => {
        try {
            const res = await axiosInstance.put(`/sprints/${sprintId}`, sprintInfo)
            const updated = res.data?.data
            if (updated) {
                const idx = sprints.value.findIndex(s => s.id === sprintId)
                if (idx !== -1) sprints.value[idx] = updated
            }
            return res
        } catch (e) {
            throw e
        }
    }

    const deleteSprint = async (sprintId) => {
        try {
            const res = await axiosInstance.delete(`/sprints/${sprintId}`)
            sprints.value = sprints.value.filter(s => s.id !== sprintId)
            return res
        } catch (e) {
            throw e
        }
    }

    return {
        sprints,
        fetchSprints,
        createSprint,
        updateSprintStatus,
        updateSprint,
        deleteSprint
    }
})
