import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";


export const useTaskStore = defineStore('tasks', () => {

    const fetchTaskByProjectId = async (projectId) => {
        try {
            const res = await axiosInstance.get(`/projects/${projectId}/tasks`)
            return res
        } catch (e) {
            throw e
        }
    }

    return {
        fetchTaskByProjectId
    }
})