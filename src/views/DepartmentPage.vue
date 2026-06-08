<template>
    <MainContent>
        <div class="p-8">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-3xl font-semibold">
                        Department Management
                    </h1>
                    <p class="text-gray-500 mt-1">
                        Manage departments across branches
                    </p>
                </div>

                <div class="w-44">
                    <PrimaryButton content="Add Department" @click="openModal">
                        <template #icon>
                            <Plus class="w-5"></Plus>
                        </template>
                    </PrimaryButton>
                </div>
            </div>

            <!-- branch filter -->

            <div class="bg-white border border-gray-100 rounded-lg shadow-sm mb-6">
                <div class="p-6">

                    <label class="block text-sm font-medium mb-2">
                        Branch
                    </label>

                    <select
                        class="w-full h-10 border border-gray-100 rounded-lg px-3 outline-none focus:ring-2 focus:ring-black">
                        <option>Ho Chi Minh Branch</option>
                        <option>Ha Noi Branch</option>
                        <option>Da Nang Branch</option>
                    </select>

                </div>
            </div>

            <div
                class="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50/70 border-b border-slate-200/80">
                                <th
                                    class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[20%]">
                                    Name
                                </th>
                                <th
                                    class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[30%]">
                                    Description
                                </th>
                                <th
                                    class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[30%]">
                                    Branch
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

                                <td class="py-5 px-6 text-sm text-slate-600 font-normal">
                                    test2
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
            <ModalGeneric v-model="isOpen" :title="'Add New Department'">
                <div class="space-y-6">
                    <div>
                        <label for="position_name"
                            class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Department Name
                        </label>
                        <input type="text" id="position_name" placeholder="Marketing..."
                            class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light"
                            required />
                    </div>

                    <div>
                        <label for="position_name"
                            class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Branch
                        </label>
                        <select
                            class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                            <option>Ho Chi Minh Branch</option>
                            <option>Ha Noi Branch</option>
                            <option>Da Nang Branch</option>
                        </select>
                    </div>

                    <div>
                        <label for="description"
                            class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                        <textarea id="description" rows="4" placeholder="Briefly describe the key responsibilities..."
                            class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light resize-none"></textarea>
                    </div>
                </div>
                <template #footer>
                    <div class="flex gap-2">
                        <SecondaryButton :content="'Cancel'"></SecondaryButton>
                        <PrimaryButton :content="'Create'"></PrimaryButton>
                    </div>
                </template>
            </ModalGeneric>
        </div>
    </MainContent>
</template>

<script setup>
import { ref } from "vue";
import MainContent from "../components/MainContent.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import { Plus } from "@lucide/vue";
import StatusBadge from "../components/StatusBadge.vue";
import SecondaryButton from "../components/SecondaryButton.vue";
import PaginationSection from "../components/PaginationSection.vue";
import ModalGeneric from "../components/ModalGeneric.vue";

const isOpen = ref(false);

const openModal = () => {
    isOpen.value = true
}
</script>
