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

    return {
        fetchTaskByProjectId,
        createTask,
        moveTask,
        getTaskDetail
    }
})