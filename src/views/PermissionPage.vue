<template>
    <MainContent>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <!-- Header Section -->
            <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div>
                    <div class="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <span>Security</span>
                        <span>/</span>
                        <span class="text-slate-600 font-medium">Permissions</span>
                    </div>
                    <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Permissions</h1>
                    <p class="text-sm text-slate-500 font-light mt-1">
                        Browse and inspect system security modules, permissions, and your assignment capability.
                    </p>
                </div>

                <!-- Module filter select -->
                <div class="flex items-center gap-2 self-start md:self-auto">
                    <label class="text-xs font-medium text-slate-500 whitespace-nowrap">Filter by Module:</label>
                    <select v-model="selectedModule"
                        class="border border-slate-200 hover:border-slate-300 focus:border-black rounded-lg px-3 py-2.5 text-sm outline-none transition-colors bg-white font-medium text-slate-700 min-w-40 shadow-sm">
                        <option v-for="mod in modules" :key="mod" :value="mod">
                            {{ mod === 'ALL' ? 'All Modules' : mod }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Table Card -->
            <div class="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm mb-6">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-slate-100 bg-slate-50/70">
                                <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Permission Name</th>
                                <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Module
                                </th>
                                <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Description</th>
                                <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Assignability</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <!-- Skeleton Loading -->
                            <tr v-if="isLoading" v-for="i in 5" :key="'skeleton-' + i" class="animate-pulse">
                                <td class="py-5 px-6">
                                    <div class="h-4 bg-slate-100 rounded w-2/3"></div>
                                </td>
                                <td class="py-5 px-6">
                                    <div class="h-4 bg-slate-100 rounded w-1/2"></div>
                                </td>
                                <td class="py-5 px-6">
                                    <div class="h-4 bg-slate-100 rounded w-5/6"></div>
                                </td>
                                <td class="py-5 px-6">
                                    <div class="h-6 bg-slate-100 rounded-full w-24"></div>
                                </td>
                            </tr>

                            <!-- Permissions List -->
                            <tr v-else-if="paginatedPermissions.length > 0" v-for="perm in paginatedPermissions"
                                :key="perm.id" class="hover:bg-slate-50/40 transition-colors group">
                                <td class="py-5 px-6">
                                    <span
                                        class="font-mono text-xs font-semibold text-slate-900 bg-slate-100 px-2.5 py-1.5 rounded border border-slate-200/60">
                                        {{ perm.name }}
                                    </span>
                                </td>
                                <td class="py-5 px-6">
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 uppercase tracking-wider">
                                        {{ perm.module }}
                                    </span>
                                </td>
                                <td class="py-5 px-6 text-sm text-slate-600 font-light leading-relaxed">
                                    {{ perm.description || 'No description provided' }}
                                </td>
                                <td class="py-5 px-6">
                                    <span v-if="perm.canAssign !== false"
                                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        <Shield class="w-3.5 h-3.5" />
                                        Assignable
                                    </span>
                                    <span v-else
                                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200">
                                        <ShieldAlert class="w-3.5 h-3.5" />
                                        Locked
                                    </span>
                                </td>
                            </tr>

                            <!-- Empty State -->
                            <tr v-else>
                                <td colspan="4" class="text-center py-12 text-slate-400 font-light">
                                    No permissions found matching the filters.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination -->
            <PaginationSection v-if="totalItems > 0 && !isLoading" :page-size="pagination.pageSize"
                :current-page="pagination.pageNo" :item-label="'Permissions'" :total-items="totalItems"
                :total-page="totalPages" @changePage="handlePageChange">
            </PaginationSection>

            <!-- Toast Messages -->
            <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show" @close="toast.show = false" />
        </div>
    </MainContent>
</template>

<script setup>
import { onMounted, ref, reactive, computed, watch } from "vue";
import MainContent from "../components/MainContent.vue";
import ToastMessage from "../components/ToastMessage.vue";
import PaginationSection from "../components/PaginationSection.vue";
import { Shield, ShieldAlert } from "@lucide/vue";
import { usePermissionStore } from "../store/permissionStore.js";

const permissionStore = usePermissionStore();
const permissions = computed(() => permissionStore.permissions);
const isLoading = ref(false);
const selectedModule = ref('ALL');

const pagination = reactive({
    pageNo: 1,
    pageSize: 10
});

const toast = reactive({
    type: 'success',
    message: '',
    show: false
});

const showToast = (message, type = 'success') => {
    toast.message = message;
    toast.type = type;
    toast.show = true;
    setTimeout(() => {
        toast.show = false;
        toast.message = '';
    }, 3000);
};

const loadPermissions = async () => {
    isLoading.value = true;
    try {
        // Load up to 100 permissions (fully fetches the list since permissions are a static list of ~28 items)
        await permissionStore.fetchPermissions(0, 100);
    } catch (error) {
        console.error("Load permissions error:", error);
        showToast("Failed to load permissions.", "error");
    } finally {
        isLoading.value = false;
    }
};

// Computed property for unique module list automatically derived from permissions
const modules = computed(() => {
    const unique = new Set(permissions.value.map(p => p.module).filter(Boolean));
    return ['ALL', ...Array.from(unique)];
});

// Filter permissions based on active module
const filteredPermissions = computed(() => {
    return permissions.value.filter(p => {
        return selectedModule.value === 'ALL' || p.module === selectedModule.value;
    });
});

const totalItems = computed(() => filteredPermissions.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pagination.pageSize) || 1);

// Client-side pagination derived from filtered results
const paginatedPermissions = computed(() => {
    const start = (pagination.pageNo - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredPermissions.value.slice(start, end);
});

const handlePageChange = (page) => {
    pagination.pageNo = page;
};

// Reset page offset when filter changes
watch(selectedModule, () => {
    pagination.pageNo = 1;
});

onMounted(() => {
    loadPermissions();
});
</script>

<style scoped>
/* Scoped custom styling if necessary */
</style>