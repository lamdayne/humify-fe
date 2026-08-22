import { defineStore } from "pinia";
import axiosInstance from "../axios/axios"
import { ref } from "vue";

export const useEmployeeStore = defineStore('employee', () => {
    const employees = ref([])

    const fetchEmployees = async (page = 0, size = 10, sorts = 'id:asc') => {
        try {
            const res = await axiosInstance.get(`/employees?page=${page}&size=${size}&sorts=${sorts}`)
            employees.value = res.data.data.items
            return res.data
        } catch (error) {
            return error
        }
    }

    const fetchEmployeesNoMutate = async (page = 0, size = 10, sorts = 'id:asc') => {
        try {
            const res = await axiosInstance.get(`/employees?page=${page}&size=${size}&sorts=${sorts}`)
            return res.data
        } catch (error) {
            throw error
        }
    }

    const searchEmployees = async (keyword = '', page = 0, size = 20) => {
        try {
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('size', size);

            const kw = keyword.trim();
            if (kw) {
                params.append('params', `fullName:*${kw}*`);
                params.append('params', `employeeCode:*${kw}*'`);
            }

            const res = await axiosInstance.get(`/employees/filter?${params.toString()}`)
            return res.data
        } catch (error) {
            throw error
        }
    }

    const createEmployee = async (employeeData) => {
        try {
            const res = await axiosInstance.post('/employees', employeeData)
            return res.data
        } catch (error) {
            throw error
        }
    }

    const importEmployees = async (file) => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await axiosInstance.post('/employees/import/xlsx', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return res.data.data
        } catch (error) {
            throw error
        }
    }

    const updateEmployee = async (id, employeeData) => {
        try {
            const res = await axiosInstance.put(`/employees/${id}`, employeeData)
            return res.data
        } catch (error) {
            throw error
        }
    }

    const deleteEmployee = async (id) => {
        try {
            const res = await axiosInstance.delete(`/employees/${id}`)
            return res.data
        } catch (error) {
            throw error
        }
    }

    const transferEmployee = async (id, transferData) => {
        try {
            const res = await axiosInstance.put(`/employees/${id}/transfer`, transferData)
            return res.data
        } catch (error) {
            throw error
        }
    }

    const updateEmployeeStatus = async (id, status) => {
        try {
            const res = await axiosInstance.put(`/employees/${id}/status`, { status })
            return res.data
        } catch (error) {
            throw error
        }
    }

    const fetchEmployeesFiltered = async (page = 0, size = 10, filters = {}) => {
        try {
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('size', size);
            params.append('sorts', 'id:asc');

            if (filters.branchId !== null && filters.branchId !== undefined && filters.branchId !== '') {
                params.append('params', `branch.id:${filters.branchId}`);
            }
            if (filters.departmentId !== null && filters.departmentId !== undefined && filters.departmentId !== '') {
                params.append('params', `department.id:${filters.departmentId}`);
            }

            const res = await axiosInstance.get(`/employees/filter?${params.toString()}`);
            employees.value = res.data?.data?.items || [];
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    return {
        employees,
        fetchEmployees,
        searchEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        importEmployees,
        transferEmployee,
        updateEmployeeStatus,
        fetchEmployeesFiltered,
        fetchEmployeesNoMutate
    }
})