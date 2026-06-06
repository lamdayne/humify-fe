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
                    <PrimaryButton :content="'Add Employee'">
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
                                    class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[30%]">
                                    Full name
                                </th>
                                <th
                                    class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[15%]">
                                    Branch
                                </th>
                                <th
                                    class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[15%]">
                                    Department
                                </th>
                                <th
                                    class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[15%]">
                                    Positions
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
                            <tr class="hover:bg-slate-50/40 transition-colors group">
                                <td class="py-5 px-6">
                                    <span
                                        class="font-bold text-slate-900 text-[15px] tracking-tight group-hover:text-black transition-colors">
                                        Test1
                                    </span>
                                </td>

                                <td class="py-5 px-6 text-sm text-slate-600 font-normal">
                                    test2
                                </td>

                                <td class="py-5 px-6 text-sm text-slate-400 font-light max-w-xs truncate animate-fade"
                                    :title="'position.description'">
                                    test3
                                </td>

                                <td class="py-5 px-6 text-sm text-slate-400 font-light max-w-xs truncate animate-fade"
                                    :title="'position.description'">
                                    test3
                                </td>

                                <td class="py-5 px-6 text-sm text-slate-400 font-light max-w-xs truncate animate-fade"
                                    :title="'position.description'">
                                    test3
                                </td>

                                <td class="py-5 px-6 text-xs md:text-sm text-slate-500 font-light whitespace-nowrap">
                                    <StatusBadge :content="'Check'"></StatusBadge>
                                </td>

                                <td class="py-5 px-6 text-right">
                                    <div class="flex gap-1 w-full">
                                        <SecondaryButton :content="'View'" />
                                        <PrimaryButton :content="'Edit'" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <PaginationSection></PaginationSection>
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


</script>