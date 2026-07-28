<template>
  <MainContent>
    <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans text-slate-900 relative">
      <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show" />

      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">User Accounts</h1>
          <nav class="flex items-center gap-1.5 text-xs text-slate-400 font-light mt-1">
            <span class="hover:text-slate-600 cursor-pointer transition-colors">Admin</span>
            <span>&gt;</span>
            <span class="text-slate-600 font-normal">User Management</span>
          </nav>
        </div>

        <div class="flex items-center gap-3">
          <PrimaryButton content="+ Create User" @click="openCreateModal" />
        </div>
      </div>

      <!-- STATS SUMMARY CARDS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <!-- Card 1: Total Users -->
        <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Users</span>
            <span class="text-3xl font-extrabold text-slate-900">{{ pagination.totalElements }}</span>
          </div>
          <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Users class="w-6 h-6" />
          </div>
        </div>

        <!-- Card 2: Active Users -->
        <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Users</span>
            <div class="flex items-center gap-2">
              <span class="text-3xl font-extrabold text-slate-900">{{ activeUsersCount }}</span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> LIVE
              </span>
            </div>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <UserCheck class="w-6 h-6" />
          </div>
        </div>
      </div>

      <!-- TOOLBAR & FILTERS -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          <button @click="statusFilter = 'ALL'"
                  :class="[statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900', 'px-4 py-1.5 text-xs rounded-lg transition-all cursor-pointer']">
            All Users
          </button>
          <button @click="statusFilter = 'ACTIVE'"
                  :class="[statusFilter === 'ACTIVE' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900', 'px-4 py-1.5 text-xs rounded-lg transition-all cursor-pointer']">
            Active
          </button>
          <button @click="statusFilter = 'INACTIVE'"
                  :class="[statusFilter === 'INACTIVE' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900', 'px-4 py-1.5 text-xs rounded-lg transition-all cursor-pointer']">
            Inactive
          </button>
        </div>

        <!-- SEARCH INPUT -->
        <div class="relative w-full sm:w-72">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input v-model="searchQuery"
                 type="text"
                 name="search_filter_query"
                 id="search_filter_query"
                 autocomplete="off"
                 :readonly="isSearchReadonly"
                 @focus="isSearchReadonly = false"
                 placeholder="Search users, emails, or IDs..."
                 class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-black transition-colors" />
        </div>
      </div>

      <!-- TABLE USER ACCOUNTS -->
      <div class="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th class="py-4 px-6">USER</th>
              <th class="py-4 px-6">ROLES</th>
              <th class="py-4 px-6 text-center">STATUS</th>
              <th class="py-4 px-6 text-right">ACTIONS</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
            <tr v-if="isLoading">
              <td colspan="4" class="py-12 text-center text-slate-400">
                <LoaderCircle class="w-6 h-6 animate-spin mx-auto mb-2 text-slate-600" />
                Loading accounts...
              </td>
            </tr>
            <tr v-else-if="filteredUsers.length === 0">
              <td colspan="4" class="py-12 text-center text-slate-400">No user accounts found.</td>
            </tr>
            <tr v-else v-for="user in filteredUsers" :key="user.id || user.email" class="hover:bg-slate-50/60 transition-colors group">

              <!-- USER COLUMN -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0 uppercase">
                    {{ getInitials(user.email) }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-900">{{ user.email }}</div>
                    <div class="text-[10px] text-slate-400">Created: {{ formatDate(user.createdAt) }}</div>
                  </div>
                </div>
              </td>

              <!-- ROLES -->
              <td class="py-4 px-6">
                <div class="flex flex-wrap gap-1">
                    <span v-for="role in (user.roles || [])" :key="role.id || role"
                          class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white tracking-wider uppercase">
                      {{ typeof role === 'string' ? role : role.name }}
                    </span>
                  <span v-if="!user.roles || user.roles.length === 0" class="text-slate-400 text-[11px]">—</span>
                </div>
              </td>

              <!-- STATUS -->
              <td class="py-4 px-6 text-center">
                <StatusBadge :content="user.active ? 'ACTIVE' : 'INACTIVE'" :type="user.active ? 'ACTIVE' : 'INACTIVE'" />
              </td>

              <!-- ACTIONS -->
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openChangeRoleModal(user)" class="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" title="Change Role">
                    <Shield class="w-4 h-4" />
                  </button>
                  <button @click="openChangePasswordModal(user)" class="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" title="Change Password">
                    <KeyRound class="w-4 h-4" />
                  </button>
                </div>
              </td>

            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- PAGINATION -->
      <PaginationSection class="mt-6"
                         :page-size="pagination.pageSize"
                         :current-page="pagination.pageNo"
                         :item-label="'users'"
                         :total-items="pagination.totalElements"
                         :total-page="pagination.totalPages"
                         @changePage="handlePageChange" />

      <!-- MODAL 1: CREATE USER -->
      <ModalGeneric v-model="createModal.show" title="Create New User Account" width="520px">
        <form @submit.prevent="handleCreateUser" class="space-y-4" autocomplete="off">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address <span class="text-red-500">*</span></label>
            <input type="email" v-model="createForm.email" placeholder="user@company.com" required
                   class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black" />
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Password <span class="text-red-500">*</span></label>
            <input type="password" v-model="createForm.password" placeholder="••••••••" required autocomplete="new-password"
                   class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black" />
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Assign Roles <span class="text-red-500">*</span></label>
            <div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50">
              <label v-for="role in roleList" :key="role.id" class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input type="checkbox" :value="role.id" v-model="createForm.roleIds" class="rounded border-slate-300 accent-black" />
                <span>{{ role.name }}</span>
              </label>
            </div>
          </div>
        </form>

        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton content="Cancel" @click="createModal.show = false" />
            <PrimaryButton content="Create" @click="handleCreateUser" :disabled="isSubmitting" />
          </div>
        </template>
      </ModalGeneric>

      <!-- MODAL 2: CHANGE ROLE -->
      <ModalGeneric v-model="roleModal.show" title="Update User Roles" width="480px">
        <div class="space-y-4" v-if="selectedTargetUser">
          <div class="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
            Updating roles for <strong class="text-slate-900">{{ selectedTargetUser.email }}</strong>
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Roles</label>
            <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3">
              <label v-for="role in roleList" :key="role.id" class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1.5 hover:bg-slate-50 rounded-md">
                <input type="checkbox" :value="role.id" v-model="roleModal.selectedRoleIds" class="rounded border-slate-300 accent-black" />
                <span class="font-medium">{{ role.name }}</span>
              </label>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton content="Cancel" @click="roleModal.show = false" />
            <PrimaryButton content="Save" @click="handleSaveRole" :disabled="isSubmitting" />
          </div>
        </template>
      </ModalGeneric>

      <!-- MODAL 3: CHANGE PASSWORD -->
      <ModalGeneric v-model="passwordModal.show" title="Change Password" width="450px">
        <form @submit.prevent="handleSavePassword" class="space-y-4" v-if="selectedTargetUser" autocomplete="off">
          <div class="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
            Target account: <strong class="text-slate-900">{{ selectedTargetUser.email }}</strong>
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Old Password <span class="text-red-500">*</span></label>
            <input type="password"
                   v-model="passwordForm.oldPassword"
                   autocomplete="current-password"
                   placeholder="••••••••"
                   required
                   class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black" />
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">New Password <span class="text-red-500">*</span></label>
            <input type="password"
                   v-model="passwordForm.newPassword"
                   autocomplete="new-password"
                   placeholder="••••••••"
                   required
                   class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black" />
          </div>
        </form>

        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton content="Cancel" @click="passwordModal.show = false" />
            <PrimaryButton content="Update" @click="handleSavePassword" :disabled="isSubmitting" />
          </div>
        </template>
      </ModalGeneric>

    </div>
  </MainContent>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import MainContent from '../components/MainContent.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import StatusBadge from '../components/StatusBadge.vue';
import PaginationSection from '../components/PaginationSection.vue';
import ToastMessage from '../components/ToastMessage.vue';
import ModalGeneric from '../components/ModalGeneric.vue';
import { useUserStore } from '../store/userStore';
import { useRoleStore } from '../store/roleStore';
import { useEmployeeStore } from '../store/employeeStore';
import { Users, UserCheck, Search, Shield, KeyRound, LoaderCircle } from '@lucide/vue';

const userStore = useUserStore();
const roleStore = useRoleStore();
const employeeStore = useEmployeeStore();

const isLoading = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref('');
const statusFilter = ref('ALL');
const isSearchReadonly = ref(true);

const roleList = ref([]);
const employeeList = ref([]);
const selectedTargetUser = ref(null);

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  totalElements: 0,
  totalPages: 1
});

const toast = reactive({ show: false, message: '', type: 'success' });
const triggerToast = (msg, type = 'success') => {
  toast.message = msg; toast.type = type; toast.show = true;
  setTimeout(() => { toast.show = false; }, 3500);
};

const users = computed(() => userStore.users);

const activeUsersCount = computed(() => {
  return users.value.filter(u => u.active).length;
});

const filteredUsers = computed(() => {
  let list = users.value;

  if (statusFilter.value === 'ACTIVE') {
    list = list.filter(u => u.active);
  } else if (statusFilter.value === 'INACTIVE') {
    list = list.filter(u => !u.active);
  }

  if (!searchQuery.value.trim()) return list;

  const q = searchQuery.value.toLowerCase().trim();
  return list.filter(u =>
      u.email?.toLowerCase().includes(q) ||
      u.employee?.employeeCode?.toLowerCase().includes(q) ||
      u.employee?.fullName?.toLowerCase().includes(q)
  );
});

// Modals State
const createModal = reactive({ show: false });
const createForm = reactive({
  email: '',
  password: '',
  employeeId: null,
  roleIds: []
});

const roleModal = reactive({ show: false, selectedRoleIds: [] });

const passwordModal = reactive({ show: false });
const passwordForm = reactive({
  oldPassword: '',
  newPassword: ''
});

const loadUsers = async () => {
  isLoading.value = true;
  try {
    const res = await userStore.fetchUsers(pagination.pageNo - 1, pagination.pageSize);
    if (res?.data) {
      pagination.totalElements = res.data.totalElements || 0;
      pagination.totalPages = res.data.totalPages || 1;
    }
  } catch (err) {
    triggerToast('Failed to load user accounts list.', 'error');
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (page) => {
  pagination.pageNo = page;
  loadUsers();
};

const getInitials = (email) => {
  if (!email) return 'U';
  return email.charAt(0).toUpperCase();
};

const formatDate = (isoStr) => {
  if (!isoStr) return 'N/A';
  return new Date(isoStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Modal Handlers
const openCreateModal = async () => {
  createForm.email = '';
  createForm.password = '';
  createForm.employeeId = null;
  createForm.roleIds = [];
  createModal.show = true;

  try {
    if (roleStore.roles.length === 0) await roleStore.fetchRoles(0, 100);
    roleList.value = roleStore.roles || [];

    const empRes = await employeeStore.fetchEmployees(0, 100);
    employeeList.value = empRes?.data?.items || employeeStore.employees || [];
  } catch (e) {
    console.error("Load dependency options error:", e);
  }
};

const handleCreateUser = async () => {
  if (!createForm.email || !createForm.password || createForm.roleIds.length === 0) {
    triggerToast('Please fill all required fields.', 'error');
    return;
  }

  isSubmitting.value = true;
  try {
    await userStore.createUser({ ...createForm });
    triggerToast('User account created successfully!', 'success');
    createModal.show = false;
    await loadUsers();
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Failed to create user account.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const openChangeRoleModal = async (user) => {
  if (!user || !user.id) {
    triggerToast('User ID is missing. Please refresh the page.', 'error');
    return;
  }

  selectedTargetUser.value = user;
  roleModal.selectedRoleIds = (user.roles || []).map(r => typeof r === 'object' ? r.id : r);
  roleModal.show = true;

  try {
    if (roleStore.roles.length === 0) await roleStore.fetchRoles(0, 100);
    roleList.value = roleStore.roles || [];
  } catch (e) {
    console.error("Fetch roles error:", e);
  }
};

const handleSaveRole = async () => {
  if (!selectedTargetUser.value || !selectedTargetUser.value.id) {
    triggerToast('Invalid target user.', 'error');
    return;
  }
  if (roleModal.selectedRoleIds.length === 0) {
    triggerToast('Please select at least one role.', 'error');
    return;
  }

  isSubmitting.value = true;
  try {
    await userStore.changeRole(selectedTargetUser.value.id, roleModal.selectedRoleIds);
    triggerToast('User roles updated successfully!', 'success');
    roleModal.show = false;
    await loadUsers();
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Failed to update roles.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const openChangePasswordModal = (user) => {
  if (!user || !user.id) {
    triggerToast('User ID is missing. Please refresh the page.', 'error');
    return;
  }

  selectedTargetUser.value = user;
  passwordForm.oldPassword = '';
  passwordForm.newPassword = '';
  passwordModal.show = true;
};

const handleSavePassword = async () => {
  if (!selectedTargetUser.value || !selectedTargetUser.value.id) {
    triggerToast('Invalid target user.', 'error');
    return;
  }
  if (!passwordForm.oldPassword || !passwordForm.newPassword) {
    triggerToast('Please enter both old and new password.', 'error');
    return;
  }

  isSubmitting.value = true;
  try {
    await userStore.changePassword(selectedTargetUser.value.id, { ...passwordForm });
    triggerToast('Password changed successfully!', 'success');
    passwordModal.show = false;
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Failed to change password.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  loadUsers();
});
</script>