import { defineStore } from "pinia";
import { ref } from "vue";
import axiosInstance from "../axios/axios";

export const useAttendanceStore = defineStore("attendance", () => {

    // ==========================================
    // --- 1. ATTENDANCE & SUMMARY MANAGEMENT ---
    // ==========================================

    const fetchHRAttendances = async (page = 0, size = 10, searchParams = []) => {
        let url = `/attendances?page=${page}&size=${size}`;
        if (searchParams && searchParams.length > 0) {
            searchParams.forEach(p => url += `&attendance=${encodeURIComponent(p)}`);
        }
        const res = await axiosInstance.get(url);
        return res.data;
    };

    const fetchMyAttendances = async () => {
        const res = await axiosInstance.get(`/attendances/me`);
        return res.data?.data || [];
    };

    const fetchSummaryReport = async (startDate, endDate) => {
        const res = await axiosInstance.get(`/attendances/summary`, {
            params: { startDate, endDate }
        });
        return res.data?.data || [];
    };

    const updateManualAttendance = async (id, payload) => {
        const res = await axiosInstance.put(`/attendances/${id}`, payload);
        return res.data;
    };

    // ==========================================
    // --- 2. WEB SWIPE (CHECK IN / CHECK OUT) ---
    // ==========================================

    const webSwipe = async (logType) => {
        const res = await axiosInstance.post('/attendance-logs/web-swipe', { logType });
        return res.data;
    };

    // ==========================================
    // --- 3. ATTENDANCE CORRECTIONS (GIẢI TRÌNH) ---
    // ==========================================

    const createCorrection = async (payload) => {
        const res = await axiosInstance.post('/attendance-corrections', payload);
        return res.data;
    };

    const fetchMyCorrections = async (status = '', page = 0, size = 10) => {
        const params = { page, size };
        if (status) params.status = status;

        const res = await axiosInstance.get('/attendance-corrections/me', { params });
        return res.data?.data || res.data;
    };

    // 🌟 KHỞI TẠO ĐÚNG TÊN HÀM fetchHRCorrections KẾT NỐI VỚI ATTENDANCE PAGE
    const fetchHRCorrections = async (page = 0, size = 10, status = '', employeeId = null) => {
        const params = { page, size };
        if (status) params.status = status;
        if (employeeId) params.employeeId = employeeId;

        const res = await axiosInstance.get('/attendance-corrections', { params });
        return res.data?.data || res.data;
    };

    // Alias hỗ trợ hàm cũ
    const fetchAllCorrectionsHR = fetchHRCorrections;

    const approveCorrection = async (id, payload) => {
        const note = typeof payload === 'object' ? (payload.approverNote || 'Approved via HR') : payload;
        const status = typeof payload === 'object' ? payload.status : 'APPROVED';

        if (status === 'REJECTED') {
            const res = await axiosInstance.put(`/attendance-corrections/${id}/reject`, { approverNote: note });
            return res.data;
        } else {
            const res = await axiosInstance.put(`/attendance-corrections/${id}/approve`, { approverNote: note });
            return res.data;
        }
    };

    const rejectCorrection = async (id, approverNote = 'Rejected via HR') => {
        const res = await axiosInstance.put(`/attendance-corrections/${id}/reject`, { approverNote });
        return res.data;
    };

    // ==========================================
    // --- 4. LEAVE REQUESTS (NGHỈ PHÉP) ---
    // ==========================================

    const createLeaveRequest = async (payload) => {
        const res = await axiosInstance.post('/leave-requests', payload);
        return res.data;
    };

    // Lấy danh sách đơn nghỉ phép (Chung cho HR hoặc Lọc)
    // Lấy danh sách đơn xin nghỉ phép (An toàn 100% với Backend)
    const fetchLeaveRequests = async (page = 0, size = 10, searchParams = []) => {
        let url = `/leave-requests?page=${page}&size=${size}`;

        // Chỉ đính kèm param leaveRequest khi thực sự có dữ liệu
        if (searchParams && Array.isArray(searchParams) && searchParams.length > 0) {
            searchParams.forEach(p => {
                if (p) url += `&leaveRequest=${encodeURIComponent(p)}`;
            });
        }

        const res = await axiosInstance.get(url);
        return res.data?.data || res.data;
    };

    // Hủy đơn nghỉ phép (GỌI ĐÚNG DELETE /leave-requests/{id})
    const cancelLeaveRequest = async (id) => {
        const res = await axiosInstance.delete(`/leave-requests/${id}`);
        return res.data;
    };

    // HR Duyệt đơn nghỉ phép (PUT /leave-requests/{id}/approve)
    const approveLeaveRequest = async (id, approverNote = 'Approved by HR') => {
        const res = await axiosInstance.put(`/leave-requests/${id}/approve`, { approverNote });
        return res.data;
    };

    // HR Từ chối đơn nghỉ phép (PUT /leave-requests/{id}/reject)
    const rejectLeaveRequest = async (id, approverNote = 'Rejected by HR') => {
        const res = await axiosInstance.put(`/leave-requests/${id}/reject`, { approverNote });
        return res.data;
    };

    const fetchLeaveTypes = async () => {
        const res = await axiosInstance.get('/leave-types');
        return res.data?.data || [];
    };

    return {
        fetchHRAttendances,
        fetchMyAttendances,
        fetchSummaryReport,
        updateManualAttendance,
        webSwipe,
        createCorrection,
        fetchMyCorrections,
        fetchHRCorrections,
        fetchAllCorrectionsHR,
        approveCorrection,
        rejectCorrection,
        cancelLeaveRequest,
        createLeaveRequest,
        fetchLeaveRequests,
        approveLeaveRequest,
        rejectLeaveRequest,
        fetchLeaveTypes
    };
});