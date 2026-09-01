import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";


export const useTaskStore = defineStore('tasks', () => {

    const fetchTaskByProjectId = async (projectId, page = 0, size = 100, sorts = 'position:asc') => {
        try {
            const res = await axiosInstance.get(`/projects/${projectId}/tasks?page=${page}&size=${size}&sorts=${sorts}`)
            return res
        } catch (e) {
            throw e
        }
    }

    const createTask = async (projectId, taskInfo) => {
        try {
            const res = await axiosInstance.post(`/projects/${projectId}/tasks`, taskInfo)
            return res
        } catch (e) {
            throw e
        }
    }

    const moveTask = async (taskId, moveTaskInfo) => {
        try {
            const res = await axiosInstance.put(`/tasks/${taskId}/move`, moveTaskInfo)
            return res
        } catch (e) {
            throw e
        }
    }

    const getTaskDetail = async (taskId) => {
        try {
            const res = await axiosInstance.get(`/tasks/${taskId}`)
            return res
        } catch (e) {
            throw e
        }
    }

    const assignTask = async (taskId, assigneeId) => {
        try {
            const res = await axiosInstance.put(`/tasks/${taskId}/assign`, { assigneeId })
            return res
        } catch (e) {
            throw e
        }
    }

    const updateTask = async (taskId, payload) => {
        try {
            const res = await axiosInstance.put(`/tasks/${taskId}`, payload)
            return res
        } catch (e) {
            throw e
        }
    }

    const addAttachment = async (taskId, payload) => {
        try {
            const res = await axiosInstance.post(`/tasks/${taskId}/attachment`, payload)
            return res
        } catch (e) {
            throw e
        }
    }

    const getAttachment = async (taskId) => {
        try {
            const res = await axiosInstance.get(`/tasks/${taskId}/attachments`)
            return res
        } catch (e) {
            throw e
        }
    }

    const deleteAttachment = async (taskAttachmentId) => {
        try {
            const res = await axiosInstance.delete(`/attachments/${taskAttachmentId}`)
            return res
        } catch (e) {
            throw e
        }
    }

    const getComments = async (taskId) => {
        try {
            const res = await axiosInstance.get(`/tasks/${taskId}/comments`)
            return res
        } catch (e) {
            throw e
        }
    }

    const createComment = async (taskId, payload) => {
        try {
            const res = await axiosInstance.post(`/tasks/${taskId}/comments`, payload)
            return res
        } catch (e) {
            throw e
        }
    }

    const getActivities = async (taskId) => {
        try {
            const res = await axiosInstance.get(`/tasks/${taskId}/activities`)
            return res
        } catch (e) {
            throw e
        }
    }

    const deleteTask = async (taskId) => {
        try {
            const res = await axiosInstance.delete(`/tasks/${taskId}`)
            return res
        } catch (e) {
            throw e
        }
    }

    const getWorklogs = async (taskId) => {
        try {
            const res = await axiosInstance.get(`/tasks/${taskId}/worklogs`)
            return res
        } catch (e) {
            throw e
        }
    }

    const createWorklog = async (taskId, payload) => {
        try {
            const res = await axiosInstance.post(`/tasks/${taskId}/worklogs`, payload)
            return res
        } catch (e) {
            throw e
        }
    }

    const updateWorklog = async (worklogId, payload) => {
        try {
            const res = await axiosInstance.put(`/worklogs/${worklogId}`, payload)
            return res
        } catch (e) {
            throw e
        }
    }

    const deleteWorklog = async (worklogId) => {
        try {
            const res = await axiosInstance.delete(`/worklogs/${worklogId}`)
            return res
        } catch (e) {
            throw e
        }
    }

    const filterTasksByProjectId = async (projectId, params = []) => {
        try {
            const queryString = params.map(p => `params=${encodeURIComponent(p)}`).join('&')
            const url = `/projects/${projectId}/tasks/filter${queryString ? '?' + queryString : ''}`
            const res = await axiosInstance.get(url)
            return res
        } catch (e) {
            throw e
        }
    }

    return {
        fetchTaskByProjectId,
        createTask,
        moveTask,
        getTaskDetail,
        assignTask,
        updateTask,
        addAttachment,
        getAttachment,
        deleteAttachment,
        deleteTask,
        getComments,
        createComment,
        getActivities,
        getWorklogs,
        createWorklog,
        updateWorklog,
        deleteWorklog,
        filterTasksByProjectId
    }
})