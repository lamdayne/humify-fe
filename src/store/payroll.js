import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";

function cleanParams(params) {
    return Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) => value !== null && value !== undefined && value !== ""
        )
    );
}
export const usePayrollStore = defineStore(
    "payroll",
    () => {


        const getPayrollPeriods = async (page = 1, size = 10) => {
            try {
                return await axiosInstance.get(
                    "/payroll-periods",
                    {
                        params: cleanParams({ page, size })
                    }
                );
            } catch (error) {
                console.error("Get payroll periods error:", error);
                throw error;
            }
        };

        // GET /payroll-periods/{id}/payslips (page bắt đầu từ 0, khớp BE)
        const getPayslips = async (
            payrollPeriodId,
            {
                page = 0,
                size = 10,
                employeeId = null,
                status = null,
                sorts = null // vd: "grossSalary,desc" hoặc ["field1,asc", "field2,desc"]
            } = {}
        ) => {

            try {

                return await axiosInstance.get(
                    `/payroll-periods/${payrollPeriodId}/payslips`,
                    {
                        params: cleanParams({
                            employeeId,
                            status,
                            page,
                            size,
                            sorts
                        }),
                        // axios sẽ serialize mảng sorts thành sorts=a&sorts=b, khớp String... sorts của BE
                        paramsSerializer: { indexes: null }
                    }
                );

            } catch (error) {

                console.error("Get payslips error:", error);
                throw error;

            }

        };

        // GET /employees/my-payslips (dành cho nhân viên xem phiếu lương của chính mình)
        const getMyPayslips = async (
            {
                year = null,
                page = 0,
                size = 10,
                sorts = null
            } = {}
        ) => {

            try {

                return await axiosInstance.get(
                    "/employees/my-payslips",
                    {
                        params: cleanParams({ year, page, size, sorts }),
                        paramsSerializer: { indexes: null }
                    }
                );

            } catch (error) {

                console.error("Get my payslips error:", error);
                throw error;

            }

        };

        // POST /payroll-periods/{id}/calculates
        const calculatePayroll = async (payrollPeriodId) => {

            try {

                return await axiosInstance.post(
                    `/payroll-periods/${payrollPeriodId}/calculates`
                );

            } catch (error) {

                console.error("Calculate payroll error:", error);
                throw error;

            }

        };

        // PUT /payroll-periods/{id}/approve
        const approvePayroll = async (payrollPeriodId) => {

            try {

                return await axiosInstance.put(
                    `/payroll-periods/${payrollPeriodId}/approve`
                );

            } catch (error) {

                console.error("Approve payroll error:", error);
                throw error;

            }

        };

        // PUT /payroll-periods/{id}/pay
        const payPayroll = async (payrollPeriodId) => {

            try {

                return await axiosInstance.put(
                    `/payroll-periods/${payrollPeriodId}/pay`
                );

            } catch (error) {

                console.error("Pay payroll error:", error);
                throw error;

            }

        };

        // PUT /payslips/{id}
        const updatePayslip = async (id, payslipInfo) => {

            try {

                return await axiosInstance.put(
                    `/payslips/${id}`,
                    {
                        otherBonuses: payslipInfo.otherBonuses,
                        otherDeductions: payslipInfo.otherDeductions,
                        note: payslipInfo.note
                    }
                );

            } catch (error) {

                console.error("Update payslip error:", error);
                throw error;

            }

        };

        return {

            getPayrollPeriods,
            getPayslips,
            getMyPayslips,
            calculatePayroll,
            approvePayroll,
            payPayroll,
            updatePayslip

        };

    }
);