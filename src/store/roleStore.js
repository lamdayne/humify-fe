import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";
import { ref } from "vue";

export const useRoleStore = defineStore('role', () => {
    const roles = ref([]);

    const fetchRoles = async (page = 0, size = 10, sorts = 'id:asc') => {
        try {
            const res = await axiosInstance.get(`/roles?page=${page}&size=${size}&sorts=${sorts}`);
            roles.value = res.data.data.items;
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const fetchRoleById = async (id) => {
        try {
            const res = await axiosInstance.get(`/roles/${id}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const createRole = async (roleData) => {
        try {
            const res = await axiosInstance.post('/roles', roleData);
            return res;
        } catch (error) {
            throw error;
        }
    };

    const updateRole = async (id, roleData) => {
        try {
            const res = await axiosInstance.put(`/roles/${id}`, roleData);
            return res;
        } catch (error) {
            throw error;
        }
    };

    const deleteRole = async (id) => {
        try {
            const res = await axiosInstance.delete(`/roles/${id}`);
            return res;
        } catch (error) {
            throw error;
        }
    };

    return {
        roles,
        fetchRoles,
        fetchRoleById,
        createRole,
        updateRole,
        deleteRole
    };
});
