import { defineStore } from 'pinia';
import axiosInstance from '../axios/axios';
import { ref } from 'vue';

export const useBranchStore = defineStore('branch', () => {
  const branches = ref([]);
  const totalBranches = ref(0);
  const totalPages = ref(1);

  const fetchBranches = async (page = 0, size = 10, sorts = 'id:desc') => {
    try {
      const res = await axiosInstance.get(`/branches?page=${page}&size=${size}&sorts=${sorts}`);
      branches.value = res.data.data.items;
      totalBranches.value = res.data.data.totalElements;
      totalPages.value = res.data.data.totalPages;
      return res.data;
    } catch (error) {
      console.error("Error fetching branches:", error);
      throw error;
    }
  };

  const createBranch = async (branchData) => {
    try {
      const res = await axiosInstance.post('/branches', {
        name: branchData.name,
        field: branchData.field,
        website: branchData.website,
        address: branchData.address,
        standardHoursPerDay: branchData.standardHoursPerDay
      });
      return { success: true, data: res.data.data };
    } catch (error) {
      console.error("Error creating branch:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const updateBranch = async (id, branchData) => {
    try {
      const res = await axiosInstance.put(`/branches/${id}`, {
        name: branchData.name,
        field: branchData.field,
        website: branchData.website,
        address: branchData.address,
        standardHoursPerDay: branchData.standardHoursPerDay,
        status: branchData.status
      });
      return { success: true, data: res.data.data };
    } catch (error) {
      console.error("Error updating branch:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const deleteBranch = async (id) => {
    try {
      await axiosInstance.delete(`/branches/${id}`);
      return { success: true };
    } catch (error) {
      console.error("Error deleting branch:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  return {
    branches,
    totalBranches,
    totalPages,
    fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch
  };
});
