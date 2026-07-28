import { defineStore } from "pinia";
import { ref } from "vue";
import axiosInstance from "../axios/axios";

export const useProfileStore = defineStore("profile", () => {
    const currentEmployee = ref(null);
    const educations = ref([]);
    const certificates = ref([]);
    const experiences = ref([]);

    // --- Employee Detail ---
    const fetchEmployeeDetail = async (employeeId) => {
        try {
            const res = await axiosInstance.get(`/employees/${employeeId}`);
            currentEmployee.value = res.data?.data || res.data;
            return currentEmployee.value;
        } catch (error) {
            throw error;
        }
    };

    const fetchMyProfile = async () => {
        try {
            const res = await axiosInstance.get(`/employees/me`);
            currentEmployee.value = res.data?.data || res.data;
            return currentEmployee.value;
        } catch (error) {
            throw error;
        }
    };

    const updateEmployeeInfo = async (employeeId, payload) => {
        try {
            const res = await axiosInstance.put(`/employees/${employeeId}`, payload);
            const updatedData = res.data?.data || res.data;
            if (currentEmployee.value) {
                Object.assign(currentEmployee.value, updatedData);
            }
            return updatedData;
        } catch (error) {
            throw error;
        }
    };

    // --- Educations ---
    const fetchEducations = async (employeeId) => {
        try {
            const res = await axiosInstance.get(`/employees/${employeeId}/educations`);
            educations.value = res.data?.data || [];
            return educations.value;
        } catch (error) {
            throw error;
        }
    };

    const createEducation = async (employeeId, payload) => {
        try {
            const res = await axiosInstance.post(`/employees/${employeeId}/educations`, payload);
            await fetchEducations(employeeId);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const deleteEducation = async (employeeId, id) => {
        try {
            const res = await axiosInstance.delete(`/employees/${employeeId}/educations/${id}`);
            await fetchEducations(employeeId);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // --- Certificates ---
    const fetchCertificates = async (employeeId) => {
        try {
            const res = await axiosInstance.get(`/employees/${employeeId}/certifications`);
            certificates.value = res.data?.data?.items || res.data?.data || [];
            return certificates.value;
        } catch (error) {
            throw error;
        }
    };

    const createCertificate = async (employeeId, payload) => {
        try {
            const res = await axiosInstance.post(`/employees/${employeeId}/certifications`, payload);
            await fetchCertificates(employeeId);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const deleteCertificate = async (employeeId, id) => {
        try {
            const res = await axiosInstance.delete(`/employees/${employeeId}/certifications/${id}`);
            await fetchCertificates(employeeId);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // --- Work Experience ---
    const fetchExperiences = async (employeeId) => {
        try {
            const res = await axiosInstance.get(`/employees/${employeeId}/work-experiences`);
            experiences.value = res.data?.data || [];
            return experiences.value;
        } catch (error) {
            throw error;
        }
    };

    const createExperience = async (employeeId, payload) => {
        try {
            const res = await axiosInstance.post(`/employees/${employeeId}/work-experiences`, payload);
            await fetchExperiences(employeeId);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const deleteExperience = async (employeeId, id) => {
        try {
            const res = await axiosInstance.delete(`/employees/${employeeId}/work-experiences/${id}`);
            await fetchExperiences(employeeId);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Add into profileStore.js

    const updateCertificate = async (employeeId, id, payload) => {
        try {
            const res = await axiosInstance.put(`/employees/${employeeId}/certifications/${id}`, payload);
            await fetchCertificates(employeeId);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const updateEducation = async (employeeId, id, payload) => {
        try {
            const res = await axiosInstance.put(`/employees/${employeeId}/educations/${id}`, payload);
            await fetchEducations(employeeId);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const updateExperience = async (employeeId, id, payload) => {
        try {
            const res = await axiosInstance.put(`/employees/${employeeId}/work-experiences/${id}`, payload);
            await fetchExperiences(employeeId);
            return res.data;
        } catch (error) {
            throw error;
        }
    };


    return {
        currentEmployee,
        educations,
        certificates,
        experiences,
        fetchEmployeeDetail,
        updateCertificate,
        updateExperience,
        updateEducation,
        fetchMyProfile,
        updateEmployeeInfo,
        fetchEducations,
        createEducation,
        deleteEducation,
        fetchCertificates,
        createCertificate,
        deleteCertificate,
        fetchExperiences,
        createExperience,
        deleteExperience
    };
});