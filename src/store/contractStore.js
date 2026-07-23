import { defineStore } from "pinia";
import { ref } from "vue";
import axiosInstance from "../axios/axios";

export const useContractStore = defineStore("contract", () => {
    const contracts = ref([]);

    const fetchContracts = async (employeeId = null, status = null, page = 0, size = 10, sorts = "id:desc") => {
        try {
            let url = `/employee-contracts?page=${page}&size=${size}`;
            if (sorts) url += `&sorts=${encodeURIComponent(sorts)}`;
            if (employeeId) url += `&employeeId=${employeeId}`;
            if (status && status !== "ALL") url += `&status=${status}`;

            const res = await axiosInstance.get(url);
            contracts.value = res.data?.data?.items || [];
            return res.data;
        } catch (error) {
            console.error("Fetch contracts error:", error);
            throw error;
        }
    };

    const fetchContractById = async (id) => {
        try {
            const res = await axiosInstance.get(`/employee-contracts/${id}`);
            return res.data?.data || res.data;
        } catch (error) {
            console.error("Fetch contract detail error:", error);
            throw error;
        }
    };

    const createContract = async (payload) => {
        try {
            const res = await axiosInstance.post("/employee-contracts", payload);
            return res.data;
        } catch (error) {
            console.error("Create contract error:", error);
            throw error;
        }
    };

    const updateContract = async (id, payload) => {
        try {
            const res = await axiosInstance.put(`/employee-contracts/${id}`, payload);
            return res.data;
        } catch (error) {
            console.error("Update contract error:", error);
            throw error;
        }
    };

    const deleteContract = async (id) => {
        try {
            const res = await axiosInstance.delete(`/employee-contracts/${id}`);
            return res.data;
        } catch (error) {
            console.error("Delete contract error:", error);
            throw error;
        }
    };

    return {
        contracts,
        fetchContracts,
        fetchContractById,
        createContract,
        updateContract,
        deleteContract
    };
});