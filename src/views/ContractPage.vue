<template>
  <MainContent>
    <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans text-slate-900 relative">
      <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show" />

      <!-- HEADER & ACTIONS -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">Contracts</h1>
          <nav class="flex items-center gap-1.5 text-xs text-slate-400 font-light mt-1">
            <span class="hover:text-slate-600 cursor-pointer transition-colors">Overview</span>
            <span>&gt;</span>
            <span class="text-slate-600 font-normal">Contracts</span>
          </nav>
        </div>

        <button @click="goToCreate"
                class="bg-black hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer">
          <Plus class="w-4 h-4" />
          <span>New Contract</span>
        </button>
      </div>

      <!-- FILTERS ROW -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div class="flex flex-wrap items-center gap-3">
          <!-- Filter Status -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">Status:</span>
            <select v-model="statusFilter" @change="loadContracts" class="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 cursor-pointer">
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="TERMINATED">Terminated</option>
            </select>
          </div>

          <!-- Clear Filters -->
          <button v-if="statusFilter !== 'ALL' || searchQuery" @click="resetFilters" class="text-xs text-blue-600 hover:underline font-medium cursor-pointer ml-2">
            Clear all filters
          </button>
        </div>

        <!-- Search input -->
        <div class="relative w-full sm:w-72">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input v-model="searchQuery" type="text" placeholder="Search contracts, employees..." class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors" />
        </div>
      </div>

      <!-- TABLE CONTRACTS -->
      <div class="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th class="py-4 px-6">Employee</th>
              <th class="py-4 px-6">Contract No.</th>
              <th class="py-4 px-6">Type</th>
              <th class="py-4 px-6">Start Date</th>
              <th class="py-4 px-6">Base Salary</th>
              <th class="py-4 px-6">Status</th>
              <th class="py-4 px-6 text-right">Action</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
            <tr v-if="isLoading">
              <td colspan="7" class="py-12 text-center text-slate-400">Loading contracts...</td>
            </tr>
            <tr v-else-if="filteredContracts.length === 0">
              <td colspan="7" class="py-12 text-center text-slate-400">No contracts found.</td>
            </tr>
            <tr v-else v-for="item in filteredContracts" :key="item.id" @click="goToDetail(item.id)" class="hover:bg-slate-50/60 transition-colors cursor-pointer group">
              <!-- CỘT EMPLOYEE ĐÃ ĐƯỢC CHỈNH SỬA -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center shrink-0">
                    <span class="text-xs font-bold text-slate-600 uppercase">{{ item.employeeName?.charAt(0) || 'E' }}</span>
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {{ item.employeeName || ('Employee #' + item.employeeId) }}
                    </div>
                    <div class="text-[10px] text-slate-400 font-mono">
                      Code: {{ item.employeeCode || item.employeeId }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6 font-mono font-medium text-slate-800">{{ item.contractNumber }}</td>
              <td class="py-4 px-6 font-medium text-slate-600">
                <span class="bg-slate-100 px-2.5 py-1 rounded-md text-[11px]">{{ item.contractType }}</span>
              </td>
              <td class="py-4 px-6 font-medium text-slate-700">{{ item.startDate }}</td>
              <td class="py-4 px-6 font-mono font-bold text-slate-900">{{ formatCurrency(item.baseSalary) }}</td>
              <td class="py-4 px-6">
                <StatusBadge :content="item.status" :type="item.status" />
              </td>
              <td class="py-4 px-6 text-right">
                <button @click.stop="goToDetail(item.id)" class="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-black transition-all">
                  <ChevronRight class="w-4 h-4" />
                </button>
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
                         :item-label="'contracts'"
                         :total-items="pagination.totalElements"
                         :total-page="pagination.totalPages"
                         @changePage="handlePageChange" />
    </div>
  </MainContent>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MainContent from '../components/MainContent.vue';
import StatusBadge from '../components/StatusBadge.vue';
import PaginationSection from '../components/PaginationSection.vue';
import ToastMessage from '../components/ToastMessage.vue';
import { useContractStore } from '../store/contractStore';
import { Plus, Search, ChevronRight } from '@lucide/vue';

const router = useRouter();
const contractStore = useContractStore();

const isLoading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('ALL');

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

const contracts = computed(() => contractStore.contracts);

const filteredContracts = computed(() => {
  if (!searchQuery.value.trim()) return contracts.value;
  const q = searchQuery.value.toLowerCase();
  return contracts.value.filter(c =>
      c.contractNumber?.toLowerCase().includes(q) ||
      c.contractType?.toLowerCase().includes(q) ||
      c.employeeName?.toLowerCase().includes(q) ||
      c.employeeCode?.toLowerCase().includes(q)
  );
});

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
};

const loadContracts = async () => {
  isLoading.value = true;
  try {
    const res = await contractStore.fetchContracts(
        null,
        statusFilter.value,
        pagination.pageNo - 1,
        pagination.pageSize
    );
    if (res?.data) {
      pagination.totalElements = res.data.totalElements || 0;
      pagination.totalPages = res.data.totalPages || 1;
    }
  } catch (err) {
    triggerToast('Failed to load contracts list.', 'error');
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (page) => {
  pagination.pageNo = page;
  loadContracts();
};

const resetFilters = () => {
  statusFilter.value = 'ALL';
  searchQuery.value = '';
  loadContracts();
};

const goToCreate = () => router.push('/contracts/create');
const goToDetail = (id) => router.push(`/contracts/${id}`);

onMounted(() => {
  loadContracts();
});
</script>