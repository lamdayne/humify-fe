import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";
import { ref } from "vue";

export const usePermissionStore = defineStore('permission', () => {
    const permissions = ref([]);

    const fetchPermissions = async (page = 0, size = 100, sorts = 'id:asc') => {
        try {
            const res = await axiosInstance.get(`/permissions?page=${page}&size=${size}&sorts=${sorts}`);
            permissions.value = res.data.data.items;
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    return {
        permissions,
        fetchPermissions
    };
});
