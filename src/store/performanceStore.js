import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";
import { cleanParams } from "../utils/requestUtils.js";

export const usePerformanceStore = defineStore(
    "performance",
    () => {

        // =====================================================
        // PERFORMANCE REVIEW
        // =====================================================

        // POST /performance-reviews
        const createReview = async (payload) => {
            try {
                return await axiosInstance.post(
                    "/performance-reviews",
                    payload
                );
            } catch (error) {
                console.error(
                    "Create performance review error:",
                    error
                );
                throw error;
            }
        };


        // GET /performance-reviews
        const getReviews = async ({
                                      employeeId = null,
                                      status = null,
                                      periodStart = null,
                                      periodEnd = null,
                                      page = 0,
                                      size = 10,
                                      sorts = null
                                  } = {}) => {
            try {
                return await axiosInstance.get(
                    "/performance-reviews",
                    {
                        params: cleanParams({
                            employeeId,
                            status,
                            periodStart,
                            periodEnd,
                            page,
                            size,
                            sorts
                        })
                    }
                );
            } catch (error) {
                console.error(
                    "Get performance reviews error:",
                    error
                );
                throw error;
            }
        };


        // GET /performance-reviews/me
        const getMyReviews = async ({
                                        status = null,
                                        periodStart = null,
                                        periodEnd = null,
                                        page = 0,
                                        size = 10,
                                        sorts = null
                                    } = {}) => {
            try {
                return await axiosInstance.get(
                    "/performance-reviews/me",
                    {
                        params: cleanParams({
                            status,
                            periodStart,
                            periodEnd,
                            page,
                            size,
                            sorts
                        })
                    }
                );
            } catch (error) {
                console.error(
                    "Get my performance reviews error:",
                    error
                );
                throw error;
            }
        };


        // GET /performance-reviews/reviewer/me
        const getMyAssignedReviews = async ({
                                                employeeId = null,
                                                status = null,
                                                periodStart = null,
                                                periodEnd = null,
                                                page = 0,
                                                size = 10,
                                                sorts = null
                                            } = {}) => {
            try {
                return await axiosInstance.get(
                    "/performance-reviews/reviewer/me",
                    {
                        params: cleanParams({
                            employeeId,
                            status,
                            periodStart,
                            periodEnd,
                            page,
                            size,
                            sorts
                        })
                    }
                );
            } catch (error) {
                console.error(
                    "Get assigned reviews error:",
                    error
                );
                throw error;
            }
        };


        // GET /performance-reviews/{id}
        const getReviewById = async (id) => {
            try {
                return await axiosInstance.get(
                    `/performance-reviews/${id}`
                );
            } catch (error) {
                console.error(
                    "Get performance review detail error:",
                    error
                );
                throw error;
            }
        };


        // POST /performance-reviews/{id}/refresh-kpis
        const refreshReviewKpis = async (id) => {
            try {
                return await axiosInstance.post(
                    `/performance-reviews/${id}/refresh-kpis`
                );
            } catch (error) {
                console.error(
                    "Refresh KPIs error:",
                    error
                );
                throw error;
            }
        };


        // PUT /performance-reviews/{id}/self-review
        const selfReview = async (
            id,
            selfScore
        ) => {
            try {
                return await axiosInstance.put(
                    `/performance-reviews/${id}/self-review`,
                    {
                        selfScore
                    }
                );
            } catch (error) {
                console.error(
                    "Self review error:",
                    error
                );
                throw error;
            }
        };


        // PUT /performance-reviews/{id}/manager-review
        const managerReview = async (
            id,
            reviewerScore,
            feedback
        ) => {
            try {
                return await axiosInstance.put(
                    `/performance-reviews/${id}/manager-review`,
                    {
                        reviewerScore,
                        feedback
                    }
                );
            } catch (error) {
                console.error(
                    "Manager review error:",
                    error
                );
                throw error;
            }
        };


        // PUT /performance-reviews/{id}/complete
        const completeReview = async (id) => {
            try {
                return await axiosInstance.put(
                    `/performance-reviews/${id}/complete`
                );
            } catch (error) {
                console.error(
                    "Complete performance review error:",
                    error
                );
                throw error;
            }
        };


        const getMyAssignedReviewSummary = async () => {
            try {
                return await axiosInstance.get(
                    "/performance-reviews/reviewer/me/summary"
                );
            } catch (error) {
                console.error(
                    "Get assigned review summary error:",
                    error
                );

                throw error;
            }
        };

// GET /kpi-templates
        const getKpiTemplates = async () => {
            try {
                return await axiosInstance.get(
                    "/kpi-templates"
                );
            } catch (error) {
                console.error(
                    "Get KPI templates error:",
                    error
                );

                throw error;
            }
        };


// POST /kpi-templates
        const createKpiTemplate = async (
            payload
        ) => {
            try {
                return await axiosInstance.post(
                    "/kpi-templates",
                    payload
                );
            } catch (error) {
                console.error(
                    "Create KPI template error:",
                    error
                );

                throw error;
            }
        };


// PUT /kpi-templates/{id}
        const updateKpiTemplate = async (
            id,
            payload
        ) => {
            try {
                return await axiosInstance.put(
                    `/kpi-templates/${id}`,
                    payload
                );
            } catch (error) {
                console.error(
                    "Update KPI template error:",
                    error
                );

                throw error;
            }
        };


// DELETE /kpi-templates/{id}
        const deleteKpiTemplate = async (
            id
        ) => {
            try {
                return await axiosInstance.delete(
                    `/kpi-templates/${id}`
                );
            } catch (error) {
                console.error(
                    "Delete KPI template error:",
                    error
                );

                throw error;
            }
        };
        return {
            createReview,
            getReviews,
            getMyReviews,
            getMyAssignedReviews,
            getMyAssignedReviewSummary,
            getReviewById,
            refreshReviewKpis,
            selfReview,
            managerReview,
            completeReview,
            getKpiTemplates,
            createKpiTemplate,
            updateKpiTemplate,
            deleteKpiTemplate
        };
    }
);