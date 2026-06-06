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
        <PrimaryButton
            content="+ Add Department"
            @click="handleAddDepartment"
        />
    </div>
</div>

<!-- branch filter -->

<div class="bg-white border border-gray-100 rounded-lg shadow-sm mb-6">
    <div class="p-6">

        <label class="block text-sm font-medium mb-2">
            Branch
        </label>

        <select
            class="w-full h-10 border border-gray-100 rounded-lg px-3 outline-none focus:ring-2 focus:ring-black"
        >
            <option>Ho Chi Minh Branch</option>
            <option>Ha Noi Branch</option>
            <option>Da Nang Branch</option>
        </select>

    </div>
</div>

<!-- department table -->
 <div class="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">

    <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="font-semibold">
            Department List
        </h3>
    </div>

    <table class="w-full">

        <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
                <th class="text-left px-6 py-3">Name</th>
                <th class="text-left px-6 py-3">Description</th>
                <th class="text-left px-6 py-3">Employees</th>
                <th class="text-left px-6 py-3">Status</th>
            </tr>
        </thead>

        <tbody>

            <tr class="border-b border-gray-100 hover:bg-gray-50">
                <td class="px-6 py-4">IT</td>
                <td class="px-6 py-4">Information Technology</td>
                <td class="px-6 py-4">12</td>
                <td class="px-6 py-4">
                    <span
                        class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"
                    >
                        Active
                    </span>
                </td>
            </tr>

            <tr class="border-b border-gray-100 hover:bg-gray-50">
                <td class="px-6 py-4">HR</td>
                <td class="px-6 py-4">Human Resources</td>
                <td class="px-6 py-4">8</td>
                <td class="px-6 py-4">
                    <span
                        class="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"
                    >
                        Active
                    </span>
                </td>
            </tr>

        </tbody>

    </table>

</div>

<!-- pagination -->
 <div class="flex justify-end items-center gap-2 p-4">

    <button
        class="h-9 px-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        :disabled="currentPage === 1"
    >
        Previous
    </button>

    <button
        v-for="page in totalPages"
        :key="page"
        class="w-9 h-9 rounded-lg border"
        :class="
            currentPage === page
                ? 'bg-black text-white'
                : 'bg-white hover:bg-gray-50'
        "
    >
        {{ page }}
    </button>

    <button
        class="h-9 px-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        :disabled="currentPage === totalPages"
    >
        Next
    </button>

</div>

<!-- Add Department Modal -->
 <div
    v-if="showModal"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
>
    <div class="w-[500px] bg-white rounded-xl p-6 shadow-xl">

        <h2 class="text-xl font-semibold mb-6">
            Create Department
        </h2>

        <div class="mb-4">
            <label class="block mb-2 text-sm font-medium">
                Department Name
            </label>

            <input
                type="text"
                class="w-full border rounded-lg px-3 py-2"
            />
        </div>

        <div class="mb-6">
            <label class="block mb-2 text-sm font-medium">
                Description
            </label>

            <textarea
                rows="4"
                class="w-full border rounded-lg px-3 py-2"
            />
        </div>

        <div class="flex justify-end gap-3">

            <button
                class="px-4 py-2 border rounded-lg hover:bg-gray-50"
                @click="closeModal"
            >
                Cancel
            </button>

            <div class="w-32">
                <PrimaryButton content="Create" />
            </div>

        </div>

    </div>
</div>


</div>
    </MainContent>
</template>

<script setup>
import { ref } from "vue";
import MainContent from "../components/MainContent.vue";
import PrimaryButton from "../components/PrimaryButton.vue";

const showModal = ref(false);

const handleAddDepartment = () => {
    
   showModal.value = true;
};
const closeModal = () => {
    showModal.value = false;
};
</script>
