import { defineStore } from "pinia";
import { ref } from "vue";
import axiosInstance from "../axios/axios";

export const useUserStore = defineStore("user", () => {
    const users = ref([]);

    const fetchUsers = async (page = 0, size = 10, sorts = "id:asc") => {
        try {
            const res = await axiosInstance.get(`/users?page=${page}&size=${size}&sorts=${sorts}`);
            users.value = res.data?.data?.items || [];
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const createUser = async (payload) => {
        try {
            const res = await axiosInstance.post("/users", payload);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const changeRole = async (userId, roleIds) => {
        try {
            const res = await axiosInstance.put(`/users/${userId}/roles`, { roleIds });
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const changePassword = async (userId, payload) => {
        try {
            const res = await axiosInstance.put(`/users/${userId}/password`, payload);
            return res.data;
        } catch (error) {
            throw error;
        }
    };


    return {
        users,
        fetchUsers,
        createUser,
        changeRole,
        changePassword
    };
});