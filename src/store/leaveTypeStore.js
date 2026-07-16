import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";
import { ref } from "vue";

export const useLeaveTypeStore = defineStore('leaveType', () => {
    // Khởi tạo mảng chứa danh sách Leave Type
    const leaveTypes = ref([])

    // Lấy danh sách Leave Type (có hỗ trợ phân trang và sắp xếp)
    const fetchLeaveTypes = async (page = 0, size = 10, sorts = 'id:asc') => {
        try {
            const res = await axiosInstance.get(`/leave-types?page=${page}&size=${size}&sorts=${sorts}`)
            // Gán dữ liệu trả về vào state cục bộ (Hỗ trợ cả cấu trúc phân trang và list trực tiếp)
            if (res.data && res.data.data) {
                if (Array.isArray(res.data.data)) {
                    leaveTypes.value = res.data.data
                } else if (res.data.data.items && Array.isArray(res.data.data.items)) {
                    leaveTypes.value = res.data.data.items
                } else {
                    leaveTypes.value = []
                }
            } else if (res.data && Array.isArray(res.data)) {
                leaveTypes.value = res.data
            } else {
                leaveTypes.value = []
            }
            return res.data
        } catch (error) {
            throw error;
        }
    }

    // Tạo mới một Leave Type
    const createLeaveType = async (leaveTypeData) => {
        try {
            const res = await axiosInstance.post('/leave-types', leaveTypeData)
            const newItem = res.data?.data || res.data
            if (newItem && typeof newItem === 'object') {
                if (!Array.isArray(leaveTypes.value)) {
                    leaveTypes.value = []
                }
                leaveTypes.value.unshift(newItem)
            }
            return res.data
        } catch (error) {
            throw error;
        }
    }

    // Cập nhật một Leave Type
    const updateLeaveType = async (id, leaveTypeData) => {
        try {
            const res = await axiosInstance.put(`/leave-types/${id}`, leaveTypeData)
            const updatedItem = res.data?.data || res.data
            if (updatedItem && typeof updatedItem === 'object') {
                const index = leaveTypes.value.findIndex(lt => lt.id === id)
                if (index !== -1) {
                    leaveTypes.value[index] = { ...leaveTypes.value[index], ...updatedItem }
                }
            }
            return res.data
        } catch (error) {
            throw error;
        }
    }

    // Xoá Leave Type khỏi giao diện cục bộ (Local State)
    const deleteLeaveTypeLocal = async (id) => {
        try {
            leaveTypes.value = leaveTypes.value.filter(lt => lt.id !== id)
        } catch (error) {
            throw error;
        }
    }

    // (Tuỳ chọn) Mình bổ sung thêm hàm Xoá thật trên API để bạn xài khi cần
    const deleteLeaveTypeAPI = async (id) => {
        try {
            const res = await axiosInstance.delete(`/leave-types/${id}`)
            return res.data
        } catch (error) {
            throw error;
        }
    }

    return {
        leaveTypes,
        fetchLeaveTypes,
        createLeaveType,
        updateLeaveType,
        deleteLeaveTypeLocal,
        deleteLeaveTypeAPI // Nhớ export ra để dùng
    }
})