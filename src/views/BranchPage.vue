<template>
  <MainContent>
    <div class="w-full space-y-6 pt-4 px-6 text-slate-700 relative">

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Branches</h1>
          <span class="bg-slate-100 text-slate-700 px-2 py-0.5 text-xs font-bold rounded-md border border-slate-200 shadow-sm">
            {{ pagination.totalElements }}
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
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div class="w-36">
            <PrimaryButton @click="openDrawer('create')" content="+ Add Branch" />
          </div>
        </div>
      </div>

      <div class="relative w-full max-w-sm flex items-center">
        <span class="absolute left-3 text-slate-400 select-none text-sm">🔍</span>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Filter branches..."
            class="w-full h-10 bg-white border border-slate-200 pl-10 pr-4 rounded-lg outline-none focus:border-black text-sm transition-colors placeholder:text-slate-400 shadow-sm block"
        />
      </div>

      <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden w-full">
        <div class="overflow-x-auto w-full">
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
            <tr v-if="isLoading">
              <td colspan="7" class="px-6 py-12 text-center text-slate-400 font-light animate-pulse">Loading branches data...</td>
            </tr>
            <tr v-else-if="filteredBranches.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-slate-400 font-light">No branches found.</td>
            </tr>
            <tr
                v-else
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
                      class="text-slate-400 hover:text-slate-900 transition-colors cursor-pointer text-sm"
                      title="View Details"
                  >
                    ✏️
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50 w-full">
          <span class="text-xs text-slate-400 font-light">
              Page {{ pagination.pageNo }} of {{ pagination.totalPages }}
          </span>
          <div class="flex gap-2">
            <button
                @click="handlePageChange(pagination.pageNo - 1)"
                :disabled="pagination.pageNo === 1 || isLoading"
                class="px-3 py-1 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
                @click="handlePageChange(pagination.pageNo + 1)"
                :disabled="pagination.pageNo >= pagination.totalPages || isLoading"
                class="px-3 py-1 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div v-if="isDrawerOpen" class="fixed inset-0 z-[100] overflow-hidden flex justify-end">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity" @click="closeDrawer"></div>

        <div class="relative w-96 max-w-full bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-2xl h-full z-10 animate-in slide-in-from-right">

          <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h3 class="text-lg font-semibold text-slate-900">
              {{ drawerMode === 'create' ? 'Create Branch' : 'Branch Details' }}
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
                  :disabled="drawerMode === 'edit'"
                  class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Field</label>
                <input
                    v-model="form.field"
                    type="text"
                    placeholder="Logistics"
                    :disabled="drawerMode === 'edit'"
                    class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Standard Hours</label>
                <input
                    v-model.number="form.standardHoursPerDay"
                    type="number"
                    placeholder="8"
                    :disabled="drawerMode === 'edit'"
                    class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Website</label>
              <input
                  v-model="form.website"
                  type="text"
                  placeholder="https://domixi.com"
                  :disabled="drawerMode === 'edit'"
                  class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location Address</label>
              <textarea
                  v-model="form.address"
                  rows="4"
                  placeholder="Enter full address..."
                  :disabled="drawerMode === 'edit'"
                  class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm resize-none disabled:bg-slate-50 disabled:text-slate-400"
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operational Status</label>
              <div class="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    @click="form.status = 'ACTIVE'"
                    :disabled="drawerMode === 'edit'"
                    :class="[
                        'py-2 text-sm font-medium border rounded-lg transition-all text-center cursor-pointer',
                        form.status === 'ACTIVE'
                            ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-sm font-semibold'
                            : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    ]"
                >
                  Active
                </button>
                <button
                    type="button"
                    @click="form.status = 'CLOSED'"
                    :disabled="drawerMode === 'edit'"
                    :class="[
                        'py-2 text-sm font-medium border rounded-lg transition-all text-center cursor-pointer',
                        form.status === 'CLOSED'
                            ? 'bg-red-50 border-red-600 text-red-600 shadow-sm font-semibold'
                            : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    ]"
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          <div class="border-t border-slate-100 pt-4 mt-4 space-y-2">
            <PrimaryButton
                v-if="drawerMode === 'create'"
                @click="handleSave"
                content="Save Changes"
            />
            <SecondaryButton
                @click="closeDrawer"
                content="Cancel"
            />
          </div>

        </div>
      </div>

    </div>
  </MainContent>
</template>

<script setup>
import MainContent from '../components/MainContent.vue'
import { ref, computed, onMounted, reactive } from 'vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import StatusBadge from '../components/StatusBadge.vue';
import { useBranchStore } from '../store/branchStore.js';

const branchStore = useBranchStore()

const searchQuery = ref('');
const statusFilter = ref('ALL');
const isDrawerOpen = ref(false);
const drawerMode = ref('create');
const isLoading = ref(false);

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  totalElements: 0,
  totalPages: 1
})

const branches = computed(() => branchStore.branches)

const form = ref({
  name: '',
  field: '',
  website: '',
  address: '',
  standardHoursPerDay: 8,
  status: 'ACTIVE'
});

const loadBranchesData = async (page = 0) => {
  isLoading.value = true
  try {
    const res = await branchStore.fetchBranches(page, pagination.pageSize)
    pagination.pageNo = res.data.pageNo + 1
    pagination.pageSize = res.data.pageSize
    pagination.totalElements = res.data.totalElements
    pagination.totalPages = res.data.totalPages
  } catch (err) {
    alert("Failed to load branches from system.");
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadBranchesData(0);
});

const handlePageChange = (targetPage) => {
  pagination.pageNo = targetPage
  loadBranchesData(targetPage - 1)
}

const filteredBranches = computed(() => {
  let list = branches.value;

  if (statusFilter.value !== 'ALL') {
    const mappedStatus = statusFilter.value === 'INACTIVE' ? 'CLOSED' : 'ACTIVE';
    list = list.filter(b => b.status === mappedStatus);
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
    form.value = { ...branchData };
  } else {
    form.value = {
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
    alert("Please enter a Branch Name and Field.");
    return;
  }

  if (drawerMode.value === 'create') {
    try {
      await branchStore.createBranch({
        name: form.value.name,
        field: form.value.field,
        website: form.value.website,
        address: form.value.address,
        standardHoursPerDay: form.value.standardHoursPerDay || 8
      });
      alert("Branch created successfully!");
      closeDrawer();
      loadBranchesData(0);
    } catch (error) {
      alert(error.response?.data?.message || "Error creating new branch resource.");
    }
  }
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