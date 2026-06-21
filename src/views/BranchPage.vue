<template>
  <MainContent>
    <div class="w-full space-y-6 pt-4 px-6 text-slate-700 relative">
      <ToastMessage :type="toast.type" :message="toast.message" :show="toast.show"></ToastMessage>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Branches</h1>
          <span class="bg-slate-100 text-slate-700 px-2 py-0.5 text-xs font-bold rounded-md border border-slate-200 shadow-sm">
            {{ totalBranches }}
          </span>
        </div>

        <div class="flex items-center gap-4 sm:ml-auto">
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-500 font-light">Status:</span>
            <select
                v-model="statusFilter"
                class="bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer shadow-sm min-w-36"
            >
              <option value="ALL">All Branches</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div class="w-36">
            <PrimaryButton @click="openDrawer('create')" content="+ Add Branch" />
          </div>
        </div>
      </div>

      <div class="relative w-100 flex items-center">
        <span class="absolute left-3 text-slate-400 select-none text-sm">🔍</span>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Filter branches..."
            class="w-full h-10 bg-white border border-slate-200 pl-10 pr-4 rounded-lg outline-none focus:border-black text-sm transition-colors placeholder:text-slate-400 shadow-sm block"
        />
      </div>

      <div class="bg-white border border-slate-200 rounded-xl shadow-sm w-full">
        <div class="w-full">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="bg-slate-50/70 border-b border-slate-200 text-xs uppercase font-semibold tracking-wider text-slate-500">
              <th class="px-6 py-4">Branch Code</th>
              <th class="px-6 py-4">Name</th>
              <th class="px-6 py-4">Field</th>
              <th class="px-6 py-4">Location</th>
              <th class="px-6 py-4 text-center">Hours/Day</th>
              <th class="px-6 py-4 text-center">Status</th>
              <th class="px-6 py-4 text-center">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-sm text-slate-700">
            <tr v-if="filteredBranches.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-slate-400 font-light">No branches found.</td>
            </tr>
            <tr
                v-for="branch in filteredBranches"
                :key="branch.id"
                class="hover:bg-slate-50/60 transition-colors"
            >
              <td class="px-6 py-4 font-mono text-blue-600 font-medium text-xs">
                {{ branch.branchCode }}
              </td>
              <td class="px-6 py-4 font-semibold text-slate-900">{{ branch.name }}</td>
              <td class="px-6 py-4 text-slate-500 font-light">{{ branch.field }}</td>
              <td class="px-6 py-4 text-slate-500 font-light max-w-md truncate" :title="branch.address">
                {{ branch.address || '—' }}
              </td>
              <td class="px-6 py-4 text-center font-mono text-slate-600">
                {{ branch.standardHoursPerDay }}
              </td>
              <td class="px-6 py-4 text-center">
                <StatusBadge :content="branch.status" :type="branch.status" />
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button
                      @click="openDrawer('edit', branch)"
                      class="text-slate-400 hover:text-slate-900 transition-colors cursor-pointer flex items-center justify-center p-1 rounded hover:bg-slate-100"
                      title="Edit Details"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                      @click="handleDelete(branch.id)"
                      class="text-slate-400 hover:text-red-600 transition-colors cursor-pointer flex items-center justify-center p-1 rounded hover:bg-red-50"
                      title="Delete"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-6">
        <PaginationSection
          :current-page="currentPage + 1"
          :total-items="totalBranches"
          :total-page="totalPages"
          :page-size="pageSize"
          :item-label="'branches'"
          @changePage="(page) => loadBranches(page - 1)"
        />
      </div>

      <div v-if="isDrawerOpen" class="fixed inset-0 z-[100] overflow-hidden flex justify-end">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity" @click="closeDrawer"></div>

        <div class="relative w-96 max-w-full bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-2xl h-full z-10 animate-in slide-in-from-right">

          <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h3 class="text-lg font-semibold text-slate-900">
              {{ drawerMode === 'create' ? 'Create Branch' : 'Edit Branch' }}
            </h3>
            <button @click="closeDrawer" class="text-slate-400 hover:text-slate-900 text-xl font-light cursor-pointer transition-colors">&times;</button>
          </div>

          <div class="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Branch Name</label>
              <input
                  v-model="form.name"
                  type="text"
                  placeholder="London Central"
                  class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Field</label>
                <input
                    v-model="form.field"
                    type="text"
                    placeholder="Logistics"
                    class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm"
                />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Standard Hours</label>
                <input
                    v-model.number="form.standardHoursPerDay"
                    type="number"
                    placeholder="8"
                    class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Website</label>
              <input
                  v-model="form.website"
                  type="text"
                  placeholder="https://domixi.com"
                  class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location Address</label>
              <textarea
                  v-model="form.address"
                  rows="4"
                  placeholder="Enter full address..."
                  class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm resize-none"
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operational Status</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                    type="button"
                    @click="form.status = 'ACTIVE'"
                    :class="[
                        'py-2 text-xs font-medium border rounded-lg transition-all text-center cursor-pointer',
                        form.status === 'ACTIVE'
                            ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-sm font-semibold'
                            : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    ]"
                >
                  Active
                </button>
                <button
                    type="button"
                    @click="form.status = 'PENDING'"
                    :class="[
                        'py-2 text-xs font-medium border rounded-lg transition-all text-center cursor-pointer',
                        form.status === 'PENDING'
                            ? 'bg-yellow-50 border-yellow-600 text-yellow-600 shadow-sm font-semibold'
                            : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    ]"
                >
                  Pending
                </button>
                <button
                    type="button"
                    @click="form.status = 'CLOSED'"
                    :class="[
                        'py-2 text-xs font-medium border rounded-lg transition-all text-center cursor-pointer',
                        form.status === 'CLOSED'
                            ? 'bg-slate-100 border-slate-400 text-slate-700 shadow-sm font-semibold'
                              : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    ]"
                >
                  Closed
                </button>
              </div>
            </div>
          </div>

          <div class="border-t border-slate-100 pt-4 mt-4 space-y-2">
            <PrimaryButton
                @click="handleSave"
                :content="drawerMode === 'create' ? 'Save Changes' : 'Update Branch'"
            />
            <SecondaryButton
                @click="closeDrawer"
                content="Cancel"
            />
          </div>

        </div>
      </div>

    </div>

    <ModalGeneric
      v-model="isDeleteModalOpen"
      title="Delete Branch"
      width="440px"
    >
      <div class="space-y-3">
        <p class="text-sm text-slate-500 font-light leading-relaxed">
          Are you sure you want to delete this branch? This action cannot be undone.
        </p>
      </div>
      <template #footer>
        <button
          type="button"
          @click="isDeleteModalOpen = false"
          class="px-4 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-md transition-all duration-150 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleConfirmDelete"
          class="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2 px-4 rounded-md transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
        >
          Delete
        </button>
      </template>
    </ModalGeneric>
  </MainContent>
</template>

<script setup>
import MainContent from '../components/MainContent.vue';
import ToastMessage from '../components/ToastMessage.vue';
import PaginationSection from '../components/PaginationSection.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import StatusBadge from '../components/StatusBadge.vue';
import ModalGeneric from '../components/ModalGeneric.vue';
import { ref, reactive, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { Pencil, Trash2 } from '@lucide/vue';
import { useBranchStore } from '../store/branchStore.js';

const branchStore = useBranchStore();
const { branches, totalBranches, totalPages } = storeToRefs(branchStore);

const searchQuery = ref('');
const statusFilter = ref('ALL');
const isDrawerOpen = ref(false);
const isDeleteModalOpen = ref(false);
const branchIdToDelete = ref(null);
const drawerMode = ref('create');

const currentPage = ref(0);
const pageSize = ref(10);

const toast = reactive({
  show: false,
  message: '',
  type: 'success'
});

const showToast = (message, type = 'success') => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 3000);
};

const loadBranches = async (page = 0) => {
  try {
    await branchStore.fetchBranches(page, pageSize.value);
    currentPage.value = page;
  } catch (error) {
    showToast("Error loading branches data", "error");
  }
};

onMounted(async () => {
  await loadBranches(0);
});

const form = ref({
  id: null,
  name: '',
  field: '',
  website: '',
  address: '',
  standardHoursPerDay: 8,
  status: 'ACTIVE'
});

const filteredBranches = computed(() => {
  let list = branches.value;

  if (statusFilter.value !== 'ALL') {
    list = list.filter(b => b.status === statusFilter.value);
  }

  if (!searchQuery.value.trim()) {
    return list;
  }
  const query = searchQuery.value.toLowerCase();
  return list.filter(b =>
      b.name?.toLowerCase().includes(query) ||
      b.field?.toLowerCase().includes(query) ||
      b.branchCode?.toLowerCase().includes(query)
  );
});

const openDrawer = (mode, branchData = null) => {
  drawerMode.value = mode;
  if (mode === 'edit' && branchData) {
    form.value = {
      id: branchData.id,
      name: branchData.name,
      field: branchData.field,
      website: branchData.website || '',
      address: branchData.address || '',
      standardHoursPerDay: branchData.standardHoursPerDay || 8,
      status: branchData.status || 'ACTIVE'
    };
  } else {
    form.value = {
      id: null,
      name: '',
      field: '',
      website: '',
      address: '',
      standardHoursPerDay: 8,
      status: 'ACTIVE'
    };
  }
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const handleSave = async () => {
  if (!form.value.name || !form.value.field) {
    showToast("Please enter a Branch Name and Field.", "error");
    return;
  }

  if (drawerMode.value === 'create') {
    const result = await branchStore.createBranch(form.value);
    if (result.success) {
      showToast("Branch created successfully!", "success");
      closeDrawer();
      await loadBranches(0);
    } else {
      showToast("Error creating branch: " + result.message, "error");
    }
  } else if (drawerMode.value === 'edit') {
    const result = await branchStore.updateBranch(form.value.id, form.value);
    if (result.success) {
      showToast("Branch updated successfully!", "success");
      closeDrawer();
      await loadBranches(currentPage.value);
    } else {
      showToast("Error updating branch: " + result.message, "error");
    }
  }
};

const handleDelete = (id) => {
  branchIdToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = async () => {
  if (!branchIdToDelete.value) return;
  const result = await branchStore.deleteBranch(branchIdToDelete.value);
  if (result.success) {
    showToast("Branch deleted successfully!", "success");
    await loadBranches(currentPage.value);
  } else {
    showToast("Error deleting branch: " + result.message, "error");
  }
  isDeleteModalOpen.value = false;
  branchIdToDelete.value = null;
};
</script>

<style scoped>
.animate-in {
  animation-duration: 220ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-fill-mode: forwards;
}
.slide-in-from-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>