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

                                <td class="py-5 px-6 text-sm text-slate-400 font-light max-w-xs truncate animate-fade">
                                    {{ employee.email }}
                                </td>

                                <td class="py-5 px-6 text-sm text-slate-400 font-light max-w-xs truncate animate-fade">
                                    {{ employee.startDate }}
                                </td>

                                <td class="py-5 px-6 text-sm text-slate-400 font-light max-w-xs truncate animate-fade">
                                    {{ employee.gender }}
                                </td>

                                <td class="py-5 px-6 text-xs md:text-sm text-slate-500 font-light whitespace-nowrap">
                                    <StatusBadge :content="employee.status"></StatusBadge>
                                </td>

                                <td class="py-5 px-6 text-right">
                                    <div class="flex gap-1 w-full">
                                        <SecondaryButton :content="'View'" />
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
            <PaginationSection :page-size="pagination.pageNo" :current-page="pagination.pageNo"
                :item-label="'Employees'" :total-items="pagination.totalItems" :total-page="pagination.totalPages">
            </PaginationSection>
        </div>
    </MainContent>
</template>

<script setup>
import { ChevronLeft, Eye, Plus } from "@lucide/vue";
import MainContent from "../components/MainContent.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import SecondaryButton from "../components/SecondaryButton.vue";
import StatusBadge from "../components/StatusBadge.vue";
import PaginationSection from "../components/PaginationSection.vue";
import { useRouter } from "vue-router";
import { computed, onMounted, reactive } from "vue";
import { useEmployeeStore } from "../store/employeeStore.js";


const router = useRouter()

const employeeStore = useEmployeeStore()

const employees = computed(() => employeeStore.employees)

const pagination = reactive({
    pageNo: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
    itemLabel: ''
})

const addEmployee = () => {
    router.push({ name: 'EmployeeForm' })
}

onMounted(async () => {
    const res = await employeeStore.fetchEmployees()
    pagination.pageNo = res.data.pageNo
    pagination.pageSize = res.data.pageSize
    pagination.totalItems = res.data.totalElements
    pagination.totalPages = res.data.totalPages
})
</script>