import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";

export const useOverviewStore = defineStore("overview", {
    state: () => ({
        todayAttendance: [],
        summary: [],
        attendanceLogs: [],
        loading: false,
        swipeLoading: false
    }),

    actions: {


        async fetchTodayAttendance() {
            const response = await axiosInstance.get("/attendances/me");
            this.todayAttendance = response.data.data;
        },

        async fetchSummary(startDate, endDate) {
            const response = await axiosInstance.get("/attendances/summary", {
                params: {
                    startDate,
                    endDate
                }
            });

            this.summary = response.data.data;
        },

        async fetchAttendanceLogs(startDate, endDate) {
            const response = await axiosInstance.get("/attendance-logs/me", {
                params: {
                    startDate,
                    endDate
                }
            });

            this.attendanceLogs = response.data.data;
        },

        async fetchOverview(startDate, endDate) {

            this.loading = true;

            try {

                await Promise.all([
                    this.fetchTodayAttendance(),
                    this.fetchSummary(startDate, endDate),
                    this.fetchAttendanceLogs(startDate, endDate)
                ]);

            } finally {

                this.loading = false;

            }

        },

        async swipe(logType) {
            this.swipeLoading = true;

            try {

                await axiosInstance.post("/attendance-logs/web-swipe", {
                    logType
                });

                const today = new Date();

                const startDate = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                ).toISOString().split("T")[0];

                const endDate = today.toISOString().split("T")[0];

                await this.fetchOverview(startDate, endDate);

                return true;

            } catch (error) {

                console.error(error);

                return false;

            } finally {

                this.swipeLoading = false;

            }
        }
    }
});