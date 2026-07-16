import { defineStore } from 'pinia';
import axiosInstance from '../axios/axios';
import { ref } from 'vue';

export const usePositionStore = defineStore('position', () => {
  const positions = ref([]);
  const totalPositions = ref(0);
  const openVacancies = ref(0);

  const fetchPositions = async (page = 0, size = 10, sorts = 'id:desc') => {
    try {
      const res = await axiosInstance.get(`/positions?page=${page}&size=${size}&sorts=${sorts}`);
      positions.value = res.data.data.items.map(item => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) : ''
      }));
      totalPositions.value = res.data.data.totalElements;
      return res.data;
    } catch (error) {
      console.error("Error fetching positions:", error);
      throw error;
    }
  };

  const createPosition = async (positionData) => {
    try {
      const res = await axiosInstance.post('/positions', {
        name: positionData.name,
        description: positionData.description
      });
      
      const newPos = res.data.data;
      positions.value.unshift({
        ...newPos,
        createdAt: newPos.createdAt ? new Date(newPos.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
      });
      totalPositions.value += 1;
      openVacancies.value += 1;
      
      return { success: true, data: newPos };
    } catch (error) {
      console.error("Lỗi Store createPosition:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const updatePosition = async (id, positionData) => {
    try {
      const res = await axiosInstance.put(`/positions/${id}`, {
        name: positionData.name,
        description: positionData.description
      });
      return { success: true, data: res.data.data };
    } catch (error) {
      console.error("Lỗi Store updatePosition:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const deletePosition = async (id) => {
    try {
      await axiosInstance.delete(`/positions/${id}`);
      return { success: true };
    } catch (error) {
      console.error("Lỗi Store deletePosition:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  return {
    positions,
    totalPositions,
    openVacancies,
    fetchPositions,
    createPosition,
    updatePosition,
    deletePosition
  };
});