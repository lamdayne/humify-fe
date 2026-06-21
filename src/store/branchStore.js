import { defineStore } from "pinia";
import axiosInstance from "../axios/axios";

export const useBranchStore = defineStore(
    "branch",
    () => {

        const getAllBranches = async () => {
            const res = await axiosInstance.get(
                "/branches?page=0&size=100"
            );

            return res;
        };

        return {
            getAllBranches
        };
    }
);