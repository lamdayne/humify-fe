import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";

export const useDepartmentStore = defineStore(
    "department",
    () => {

        const getDepartmentsByBranch = async (
            branchId,
            page = 0,
            size = 10
        ) => {
            try {
                return await axiosInstance.get(
                    `/departments/branch/${branchId}`,
                    {
                        params: {
                            page,
                            size
                        }
                    }
                );
            } catch (error) {
                console.log("Get department error:", error);
                throw error;
            }
        };
        const createDepartment = async (departmentInfo) => {
            try {
                console.log("CREATE PAYLOAD:", departmentInfo);
                const res = await axiosInstance.post(
                    "/departments",
                     {
                    name: departmentInfo.name,
                        description: departmentInfo.description,
                        branchId: departmentInfo.branchId
                }
                );
                console.log("CREATE RESPONSE:", res.data);
                return res;
            } catch (error) {
                console.log("Create department error:");
                console.log("STATUS:", error?.response?.status);
                console.log("DATA:", error?.response?.data);



                throw error;
            }
        };

        const updateDepartment = async (id, departmentInfo) => {
            return await axiosInstance.put(
                `/departments/${id}`,
                {
                    branchId: departmentInfo.branchId,
                    name: departmentInfo.name,
                    description: departmentInfo.description
                }
            );
        };

        return {
            getDepartmentsByBranch,
            createDepartment,
            updateDepartment
        };
    }
);