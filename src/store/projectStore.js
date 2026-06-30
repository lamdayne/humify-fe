import { defineStore } from "pinia";
import { ref } from "vue";
import axiosInstance from '../axios/axios';

export const useProject = defineStore('project', () => {
    const projects = ref([])

    const fetchProjects = async () => {
        try {
            const res = await axiosInstance.get('/projects');
            projects.value = res.data?.data?.items
            return res;
        } catch (e) {
            throw e;
        }
    }

    const createProject = async (projectValue) => {
        try {
            const res = await axiosInstance.post('/projects', projectValue)
            return res.data
        } catch (e) {
            throw e
        }
    }

    return {
        projects,
        fetchProjects,
        createProject
    }
})