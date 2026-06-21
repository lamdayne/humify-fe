<template>
    <MainContent>
        <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans antialiased text-slate-900 relative">

            <ToastMessage :type="toast.type" :message="toast.message" :show="toast.show"></ToastMessage>

            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-start gap-4 mb-8">
                <div>
                    <h1 class="text-3xl font-semibold text-slate-900 tracking-tight mb-1">Role Management</h1>
                    <nav class="flex items-center gap-1.5 text-xs text-slate-400 font-light">
                        <span class="hover:text-slate-600 cursor-pointer transition-colors">Security</span>
                        <span>&gt;</span>
                        <span class="text-slate-600 font-normal">Roles</span>
                    </nav>
                </div>

                <div class="w-auto min-w-30">
                    <PrimaryButton :content="'Add Role'" @click="openCreateModal">
                        <template #icon>
                            <Plus class="w-5"></Plus>
                        </template>
                    </PrimaryButton>
                </div>
            </div>

            <!-- Table Loader -->
            <div v-if="isLoading" class="flex items-center justify-center py-16">
                <LoaderCircle class="animate-spin w-12 h-12 text-slate-600" />
            </div>

            <!-- Roles Table -->
            <div v-else class="relative">
                <div
                    class="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50/70 border-b border-slate-200/80">
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[25%]">
                                        Role Name
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[30%]">
                                        Description
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[30%]">
                                        Permissions
                                    </th>
                                    <th
                                        class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[15%] text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-if="roles.length > 0" v-for="role in roles" :key="role.id"
                                    class="hover:bg-slate-50/40 transition-colors group">
                                    <td class="py-5 px-6">
                                        <span
                                            class="font-bold text-slate-900 text-[15px] tracking-tight group-hover:text-black transition-colors">
                                            {{ role.name }}
                                        </span>
                                    </td>

                                    <td class="py-5 px-6 text-sm text-slate-600 font-normal">
                                        {{ role.description || 'No description provided' }}
                                    </td>

                                    <td class="py-5 px-6 text-sm text-slate-500 font-light">
                                        <div class="flex flex-wrap gap-1 max-w-md">
                                            <span v-for="perm in (role.permissions || []).slice(0, 3)" :key="perm.id"
                                                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"
                                                :title="perm.description">
                                                {{ perm.name }}
                                            </span>
                                            <span v-if="role.permissions && role.permissions.length > 3"
                                                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-800">
                                                +{{ role.permissions.length - 3 }} more
                                            </span>
                                        </div>
                                    </td>

                                    <td class="py-5 px-6 text-right">
                                        <div class="flex justify-end gap-2 w-full">
                                            <SecondaryButton :content="'Edit'" @click="openEditModal(role)">
                                                <template #icon>
                                                    <Edit class="w-4 h-4" />
                                                </template>
                                            </SecondaryButton>
                                            <button @click="confirmDelete(role.id)"
                                                class="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg hover:text-red-700 text-xs font-medium transition-all flex items-center justify-center cursor-pointer gap-xs border border-red-100">
                                                <Trash2 class="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else>
                                    <td colspan="4" class="text-center py-10 text-slate-400">
                                        No roles found.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <PaginationSection v-if="roles.length > 0 && !isLoading" :page-size="pagination.pageSize"
                :current-page="pagination.pageNo" :item-label="'Roles'" :total-items="pagination.totalItems"
                :total-page="pagination.totalPages" @changePage="handlePageChange">
            </PaginationSection>

            <!-- Create / Edit Modal -->
            <ModalGeneric v-model="isOpen" :title="isEdit ? 'Edit Role' : 'Add New Role'" width="640px">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <div>
                        <label for="role_name"
                            class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Role Name
                        </label>
                        <input type="text" id="role_name" placeholder="E.g. Department Manager" v-model="roleForm.name"
                            class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light"
                            required />
                    </div>

                    <div>
                        <label for="role_desc"
                            class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Description
                        </label>
                        <textarea id="role_desc" rows="3"
                            placeholder="Briefly describe the responsibilities of this role..."
                            v-model="roleForm.description"
                            class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light resize-none"></textarea>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Permissions (Grouped by module)
                        </label>
                        <div v-if="isPermissionsLoading" class="flex justify-center items-center py-8">
                            <LoaderCircle class="animate-spin w-8 h-8 text-slate-400" />
                        </div>
                        <div v-else
                            class="space-y-4 max-h-75 overflow-y-auto border border-slate-100 rounded-lg p-4 bg-slate-50/50">
                            <div v-for="(perms, module) in groupedPermissions" :key="module"
                                class="border-b border-slate-100 last:border-b-0 pb-3 mb-3 last:pb-0 last:mb-0">
                                <div class="flex items-center justify-between mb-2">
                                    <h4 class="text-xs font-semibold text-slate-600 uppercase tracking-wider">{{ module
                                        }}</h4>
                                    <button v-if="perms.some(p => p.canAssign !== false)" type="button"
                                        @click="toggleModuleSelection(perms)"
                                        class="text-[10px] text-slate-400 hover:text-black transition-colors font-medium">
                                        Toggle All
                                    </button>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    <label v-for="perm in perms" :key="perm.id"
                                        class="flex items-start gap-2 select-none text-xs p-1.5 rounded transition-colors"
                                        :class="perm.canAssign === false ? 'cursor-not-allowed opacity-50 bg-slate-50' : 'cursor-pointer hover:bg-slate-100/60'">
                                        <input type="checkbox" :value="perm.id" v-model="roleForm.permissionIds"
                                            :disabled="perm.canAssign === false"
                                            class="mt-0.5 rounded border-slate-300 text-black focus:ring-black accent-black"
                                            :class="perm.canAssign === false ? 'cursor-not-allowed' : 'cursor-pointer'" />
                                        <span class="text-slate-700 font-light" :title="perm.description">{{ perm.name
                                            }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <template #footer>
                    <div class="flex gap-2">
                        <SecondaryButton :content="'Cancel'" @click="isOpen = false" />
                        <button @click="handleSubmit" :disabled="isSaving"
                            class="px-4 py-2 bg-black text-white hover:bg-black/90 text-sm font-medium rounded-lg hover:opacity-95 transition-all flex items-center justify-center cursor-pointer gap-2 disabled:opacity-50">
                            <LoaderCircle v-if="isSaving" class="animate-spin w-4 h-4" />
                            {{ isEdit ? 'Update' : 'Create' }}
                        </button>
                    </div>
                </template>
            </ModalGeneric>

            <!-- Delete Confirmation Modal -->
            <ModalGeneric v-model="isDeleteOpen" title="Confirm Delete" width="400px">
                <div class="space-y-4">
                    <p class="text-sm text-slate-600 font-light leading-relaxed">
                        Are you sure you want to delete this role? This action is permanent and cannot be undone.
                    </p>
                </div>

                <template #footer>
                    <div class="flex gap-2">
                        <SecondaryButton :content="'Cancel'" @click="isDeleteOpen = false" />
                        <button @click="executeDelete" :disabled="isDeleting"
                            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg hover:opacity-95 transition-all flex items-center justify-center cursor-pointer gap-2 disabled:opacity-50">
                            <LoaderCircle v-if="isDeleting" class="animate-spin w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </template>
            </ModalGeneric>
        </div>
    </MainContent>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import MainContent from "../components/MainContent.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import SecondaryButton from "../components/SecondaryButton.vue";
import ToastMessage from "../components/ToastMessage.vue";
import PaginationSection from "../components/PaginationSection.vue";
import ModalGeneric from "../components/ModalGeneric.vue";
import { Plus, LoaderCircle, Trash2, Edit } from "@lucide/vue";
import { useRoleStore } from "../store/roleStore.js";
import { usePermissionStore } from "../store/permissionStore.js";

const roleStore = useRoleStore();
const permissionStore = usePermissionStore();

const roles = computed(() => roleStore.roles);
const permissions = computed(() => permissionStore.permissions);

const isLoading = ref(false);
const isPermissionsLoading = ref(false);
const isSaving = ref(false);
const isOpen = ref(false);
const isEdit = ref(false);
const editId = ref(null);
const isDeleteOpen = ref(false);
const deleteId = ref(null);
const isDeleting = ref(false);

const roleForm = reactive({
    name: '',
    description: '',
    permissionIds: []
});

const pagination = reactive({
    pageNo: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
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

// Group permissions by their module property
const groupedPermissions = computed(() => {
    const groups = {};
    permissions.value.forEach(p => {
        const module = p.module || 'Other';
        if (!groups[module]) {
            groups[module] = [];
        }
        groups[module].push(p);
    });
    return groups;
});

// Toggle selection for all permissions in a specific module
const toggleModuleSelection = (modulePerms) => {
    const assignablePerms = modulePerms.filter(p => p.canAssign !== false);
    const assignableIds = assignablePerms.map(p => p.id);
    if (assignableIds.length === 0) return;

    const allSelected = assignableIds.every(id => roleForm.permissionIds.includes(id));

    if (allSelected) {
        // Deselect only assignable ones
        roleForm.permissionIds = roleForm.permissionIds.filter(id => !assignableIds.includes(id));
    } else {
        // Select all assignable ones
        assignableIds.forEach(id => {
            if (!roleForm.permissionIds.includes(id)) {
                roleForm.permissionIds.push(id);
            }
        });
    }
};

const loadRoles = async (page = 0) => {
    isLoading.value = true;
    try {
        const data = await roleStore.fetchRoles(page, pagination.pageSize);
        if (data && data.data) {
            pagination.pageNo = data.data.pageNo + 1;
            pagination.pageSize = data.data.pageSize;
            pagination.totalItems = data.data.totalElements;
            pagination.totalPages = data.data.totalPages;
        }
    } catch (error) {
        console.error("Load roles error:", error);
        showToast("Failed to load roles.", "error");
    } finally {
        isLoading.value = false;
    }
};

const loadPermissions = async () => {
    if (permissions.value.length > 0) return;
    isPermissionsLoading.value = true;
    try {
        await permissionStore.fetchPermissions(0, 100);
    } catch (error) {
        console.error("Load permissions error:", error);
        showToast("Failed to load permissions.", "error");
    } finally {
        isPermissionsLoading.value = false;
    }
};

const handlePageChange = (page) => {
    loadRoles(page - 1);
};

const openCreateModal = () => {
    isEdit.value = false;
    editId.value = null;
    roleForm.name = '';
    roleForm.description = '';
    roleForm.permissionIds = [];
    isOpen.value = true;
    loadPermissions();
};

const openEditModal = (role) => {
    isEdit.value = true;
    editId.value = role.id;
    roleForm.name = role.name;
    roleForm.description = role.description || '';
    roleForm.permissionIds = role.permissions ? role.permissions.map(p => p.id) : [];
    isOpen.value = true;
    loadPermissions();
};

const handleSubmit = async () => {
    if (!roleForm.name.trim()) {
        showToast("Role name is required.", "error");
        return;
    }
    if (roleForm.permissionIds.length === 0) {
        showToast("Please select at least one permission.", "error");
        return;
    }

    isSaving.value = true;
    try {
        const payload = {
            name: roleForm.name.trim(),
            description: roleForm.description.trim(),
            permissionIds: roleForm.permissionIds
        };

        let res;
        if (isEdit.value) {
            res = await roleStore.updateRole(editId.value, payload);
            if (res.status === 200 && res.data.success) {
                showToast("Role updated successfully!", "success");
                isOpen.value = false;
                loadRoles(pagination.pageNo - 1);
            } else {
                showToast(res.data.message || "Failed to update role.", "error");
            }
        } else {
            res = await roleStore.createRole(payload);
            if (res.status === 201 && res.data.success) {
                showToast("Role created successfully!", "success");
                isOpen.value = false;
                loadRoles(0);
            } else {
                showToast(res.data.message || "Failed to create role.", "error");
            }
        }
    } catch (error) {
        console.error("Save role error:", error);
        if (error.response && error.response.data) {
            showToast(error.response.data.message || "Failed to save role.", "error");
        } else {
            showToast("Cannot connect to server.", "error");
        }
    } finally {
        isSaving.value = false;
    }
};

const confirmDelete = (id) => {
    deleteId.value = id;
    isDeleteOpen.value = true;
};

const executeDelete = async () => {
    if (!deleteId.value) return;
    isDeleting.value = true;
    try {
        const res = await roleStore.deleteRole(deleteId.value);
        if (res.status === 200 && res.data.success) {
            showToast("Role deleted successfully!", "success");
            isDeleteOpen.value = false;
            deleteId.value = null;
            loadRoles(0);
        } else {
            showToast(res.data.message || "Failed to delete role.", "error");
        }
    } catch (error) {
        console.error("Delete role error:", error);
        if (error.response && error.response.data) {
            showToast(error.response.data.message || "Failed to delete role.", "error");
        } else {
            showToast("Cannot connect to server.", "error");
        }
    } finally {
        isDeleting.value = false;
    }
};

onMounted(() => {
    loadRoles(0);
});
</script>

<style scoped>
/* Scrollbar customization for permissions container */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>