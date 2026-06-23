<template>
    <MainContent>
        <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans antialiased text-slate-900 relative">


            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-start gap-4 mb-8">
                <div>
                    <h1 class="text-3xl font-semibold text-slate-900 tracking-tight mb-1">Employee</h1>
                    <nav class="flex items-center gap-1.5 text-xs text-slate-400 font-light">
                        <span class="hover:text-slate-600 cursor-pointer transition-colors">Organization</span>
                        <span>&gt;</span>
                        <span class="text-slate-600 font-normal">Employee</span>
                    </nav>
                </div>

                <div class="w-auto min-w-30">
                    <PrimaryButton :content="'Add Employee'" @click="addEmployee">
                        <template #icon>
                            <Plus class="w-5"></Plus>
                        </template>
                    </PrimaryButton>
                </div>
            </div>
            <TableEmployeeSkeleton v-if="isFirstLoading"></TableEmployeeSkeleton>
            <div v-if="!isFirstLoading" class="relative">
                <div v-if="isPageLoading"
                    class="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl">
                    <LoaderCircle class="animate-spin w-16 h-16"></LoaderCircle>
                </div>
                <div
                    class="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-200/80">
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[15%]">
                                        Employee Code
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[25%]">
                                        Full name
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[25%]">
                                        Email
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[15%]">
                                        Start Date
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[10%]">
                                        Gender
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[10%]">
                                        Status
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[10%] text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-if="employees.length > 0" v-for="employee in employees" :key="employee.email"
                                    class="hover:bg-slate-50/40 transition-colors group">
                                    <td class="py-5 px-6">
                                        <span
                                            class="font-bold text-slate-900 text-[15px] tracking-tight group-hover:text-black transition-colors">
                                            {{ employee.employeeCode }}
                                        </span>
                                    </td>

                                    <td class="py-5 px-6 text-sm text-slate-600 font-normal">
                                        {{ employee.fullName }}
                                    </td>

                                    <td
                                        class="py-5 px-6 text-sm text-slate-400 font-light max-w-xs truncate animate-fade">
                                        {{ employee.email }}
                                    </td>

                                    <td
                                        class="py-5 px-6 text-sm text-slate-400 font-light max-w-xs truncate animate-fade">
                                        {{ employee.startDate }}
                                    </td>

                                    <td
                                        class="py-5 px-6 text-sm text-slate-400 font-light max-w-xs truncate animate-fade">
                                        {{ employee.gender }}
                                    </td>

                                    <td
                                        class="py-5 px-6 text-xs md:text-sm text-slate-500 font-light whitespace-nowrap">
                                        <StatusBadge :content="employee.status"></StatusBadge>
                                    </td>

                                    <td class="py-5 px-6 text-right">
                                        <div class="flex gap-1 justify-end w-full">
                                            <SecondaryButton :content="'View'" @click="openDetailModal(employee)" />
                                            <PrimaryButton :content="'Edit'" />
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else>
                                    <td colspan="7" class="text-center py-6 text-slate-400">
                                        No data of employee
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <PaginationSection v-if="employees.length > 0" :page-size="pagination.pageSize"
                :current-page="pagination.pageNo" :item-label="'Employees'" :total-items="pagination.totalItems"
                :total-page="pagination.totalPages" @changePage="handlePageChange">
            </PaginationSection>
        </div>

        <!-- Modal chi tiết nhân viên (Employee Detail Modal) -->
        <ModalGeneric v-model="showDetailModal" :title="'Employee Details'" width="640px">
            <div v-if="selectedEmployee" class="space-y-6">
                
                <!-- Block Avatar & Tên -->
                <div class="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-slate-100">
                    <div class="w-16 h-16 rounded-full overflow-hidden bg-slate-900 text-white flex items-center justify-center text-xl font-semibold border border-slate-200 shadow-md">
                        <img v-if="selectedEmployee.avatarUrl" :src="selectedEmployee.avatarUrl" class="w-full h-full object-cover" alt="Avatar" />
                        <span v-else>{{ getInitials(selectedEmployee.fullName) }}</span>
                    </div>
                    <div class="text-center sm:text-left space-y-1.5">
                        <div class="flex flex-col sm:flex-row sm:items-center items-center gap-2">
                            <h4 class="text-lg font-semibold text-slate-950">{{ selectedEmployee.fullName }}</h4>
                            <StatusBadge :content="selectedEmployee.status"></StatusBadge>
                        </div>
                        <p class="text-xs text-slate-400 font-light">Code: <span class="font-medium text-slate-600">{{ selectedEmployee.employeeCode }}</span></p>
                    </div>
                </div>

                <!-- Grid thông tin chi tiết -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    
                    <!-- Cột trái: Thông tin cá nhân -->
                    <div class="space-y-4">
                        <h5 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Personal Information</h5>
                        
                        <div class="space-y-3">
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Email Address</span>
                                <span class="text-xs font-medium text-slate-800 break-all">{{ selectedEmployee.email || 'N/A' }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Phone Number</span>
                                <span class="text-xs font-medium text-slate-800">{{ selectedEmployee.phone || 'N/A' }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Date of Birth</span>
                                <span class="text-xs font-medium text-slate-800">{{ selectedEmployee.dateOfBirth || 'N/A' }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Gender</span>
                                <span class="text-xs font-medium text-slate-800">{{ selectedEmployee.gender || 'N/A' }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Address</span>
                                <span class="text-xs font-medium text-slate-800">{{ selectedEmployee.address || 'N/A' }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Cột phải: Thông tin công việc -->
                    <div class="space-y-4">
                        <h5 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Employment Details</h5>

                        <div class="space-y-3">
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Start Date</span>
                                <span class="text-xs font-medium text-slate-800">{{ selectedEmployee.startDate || 'N/A' }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Branch</span>
                                <span class="text-xs font-medium text-slate-800">{{ selectedBranchName }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Department</span>
                                <span class="text-xs font-medium text-slate-800">{{ selectedDepartmentName }}</span>
                            </div>
                            <div>
                                <span class="block text-[10px] text-slate-400 font-light uppercase tracking-wider">Position</span>
                                <span class="text-xs font-medium text-slate-800">{{ selectedPositionName }}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <template #footer>
                <button @click="showDetailModal = false" class="bg-black hover:bg-slate-900 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer">
                    Close
                </button>
            </template>
        </ModalGeneric>
    </MainContent>
</template>

<script setup>
import { ChevronLeft, Circle, Eye, LoaderCircle, Plus, X } from "@lucide/vue";
import MainContent from "../components/MainContent.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import SecondaryButton from "../components/SecondaryButton.vue";
import StatusBadge from "../components/StatusBadge.vue";
import PaginationSection from "../components/PaginationSection.vue";
import { useRouter } from "vue-router";
import { computed, onMounted, reactive, ref } from "vue";
import { useEmployeeStore } from "../store/employeeStore.js";
import { useBranchStore } from "../store/branchStore.js";
import { useDepartmentStore } from "../store/departmentStore.js";
import { usePositionStore } from "../store/positionStore.js";
import TableEmployeeSkeleton from "../components/TableEmployeeSkeleton.vue";
import ModalGeneric from "../components/ModalGeneric.vue";


const router = useRouter()

const employeeStore = useEmployeeStore()
const branchStore = useBranchStore()
const departmentStore = useDepartmentStore()
const positionStore = usePositionStore()

const employees = computed(() => employeeStore.employees)

const isFirstLoading = ref(false)
const isPageLoading = ref(false)

// State cho modal xem chi tiết
const showDetailModal = ref(false)
const selectedEmployee = ref(null)
const selectedBranchName = ref('')
const selectedDepartmentName = ref('')
const selectedPositionName = ref('')

const pagination = reactive({
    pageNo: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    itemLabel: ''
})

const addEmployee = () => {
    router.push({ name: 'EmployeeForm' })
}

// Hàm lấy chữ cái đầu của tên (initials) cho avatar placeholder
const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const openDetailModal = async (employee) => {
    selectedEmployee.value = employee
    selectedBranchName.value = 'Loading...'
    selectedDepartmentName.value = 'Loading...'
    selectedPositionName.value = 'Loading...'
    showDetailModal.value = true

    try {
        // Lấy tên Chi nhánh (Branch)
        if (employee.branchId) {
            if (branchStore.branches.length === 0) {
                await branchStore.fetchBranches(0, 100)
            }
            const branch = branchStore.branches.find(b => b.id === employee.branchId)
            selectedBranchName.value = branch ? branch.name : `Branch #${employee.branchId}`
        } else {
            selectedBranchName.value = 'N/A'
        }

        // Lấy tên Chức vụ (Position)
        if (employee.positionId) {
            if (positionStore.positions.length === 0) {
                await positionStore.fetchPositions(0, 100)
            }
            const position = positionStore.positions.find(p => p.id === employee.positionId)
            selectedPositionName.value = position ? position.name : `Position #${employee.positionId}`
        } else {
            selectedPositionName.value = 'N/A'
        }

        // Lấy tên Phòng ban (Department)
        if (employee.branchId && employee.departmentId) {
            const depRes = await departmentStore.getDepartmentsByBranch(employee.branchId, 0, 100)
            const departmentsList = depRes?.data?.data?.items || []
            const department = departmentsList.find(d => d.id === employee.departmentId)
            selectedDepartmentName.value = department ? department.name : `Department #${employee.departmentId}`
        } else {
            selectedDepartmentName.value = 'N/A'
        }
    } catch (e) {
        console.error("Lỗi khi tải metadata chi tiết nhân viên:", e)
        selectedBranchName.value = employee.branchId ? `Branch #${employee.branchId}` : 'N/A'
        selectedDepartmentName.value = employee.departmentId ? `Department #${employee.departmentId}` : 'N/A'
        selectedPositionName.value = employee.positionId ? `Position #${employee.positionId}` : 'N/A'
    }
}

onMounted(async () => {
    isFirstLoading.value = true
    try {
        const res = await employeeStore.fetchEmployees(0, pagination.pageSize)
        pagination.pageNo = res.data.pageNo + 1
        pagination.pageSize = res.data.pageSize
        pagination.totalItems = res.data.totalElements
        pagination.totalPages = res.data.totalPages
    } finally {
        isFirstLoading.value = false
    }
})

const handlePageChange = async (page) => {
    isPageLoading.value = true
    pagination.pageNo = page
    try {
        const res = await employeeStore.fetchEmployees(page - 1, pagination.pageSize)
        pagination.pageNo = res.data.pageNo + 1
        pagination.pageSize = res.data.pageSize
        pagination.totalItems = res.data.totalElements
        pagination.totalPages = res.data.totalPages
    } finally {
        isPageLoading.value = false
    }
}
</script>

<style scoped>
/* Hiệu ứng mờ và trượt lên cho Modal */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes slideUp {
    from {
        transform: translateY(16px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.animate-slide-up {
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>