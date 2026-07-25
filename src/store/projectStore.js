import { defineStore } from "pinia";
import { ref } from "vue";
import axiosInstance from '../axios/axios';

export const useProject = defineStore('project', () => {
    const projects = ref([])
    const projectRoles = ref([])

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

    const getProjectById = async (projectId) => {
        try {
            const res = await axiosInstance.get(`/projects/${projectId}`)
            return res.data?.data
        } catch (e) {
            throw e
        }
    }

    const getAllProjectRoles = async () => {
        try {
            const res = await axiosInstance.get('/projects/roles')
            projectRoles.value = res.data?.data
            return res.data
        } catch (e) {
            throw e
        }
    }

    const getAllMemberByProjectId = async (projectId, page = 0, size = 10, sorts = 'id:asc') => {
        try {
            const res = await axiosInstance.get(`/projects/${projectId}/members?page=${page}&size=${size}&sorts=${sorts}`)
            return res.data
        } catch (e) {
            throw e
        }
    }

    const updateProjectMemberRole = async (projectId, userId, roleCode) => {
        try {
            const res = await axiosInstance.put(`/projects/${projectId}/members/${userId}/role`, roleCode)
            return res
        } catch (e) {
            throw e
        }
    }

    const approveRequest = async (projectId, userId) => {
        try {
            const res = await axiosInstance.post(`/projects/${projectId}/members/${userId}/approve`)
            return res
        } catch (e) {
            throw e
        }
    }

    const createInviteMember = async (projectId, payload) => {
        try {
            const res = await axiosInstance.post(`/projects/${projectId}/invitations`, payload)
            return res
        } catch (e) {
            throw e
        }
    }

    const updateProject = async (projectId, payload) => {
        try {
            const res = await axiosInstance.put(`/projects/${projectId}`, payload)
            return res.data
        } catch (e) {
            throw e
        }
    }

    const deleteProject = async (projectId) => {
        try {
            const res = await axiosInstance.delete(`/projects/${projectId}`)
            return res.data
        } catch (e) {
            throw e
        }
    }

    const getProjectSummary = async (projectId) => {
        try {
            const res = await axiosInstance.get(`/projects/${projectId}/summary`)
            return res.data?.data
        } catch (e) {
            throw e
        }
    }

    return {
        projects,
        fetchProjects,
        createProject,
        getProjectById,
        projectRoles,
        getAllProjectRoles,
        getAllMemberByProjectId,
        updateProjectMemberRole,
        approveRequest,
        createInviteMember,
        updateProject,
        deleteProject,
        getProjectSummary
    }
})