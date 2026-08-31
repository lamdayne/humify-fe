<template>
  <MainContent>
    <!-- Loading state -->
    <div v-if="isLoading" class="p-6 md:p-8 max-w-7xl mx-auto font-sans text-slate-900 flex items-center justify-center py-32">
      <div class="flex items-center gap-3 text-slate-400">
        <LoaderCircle class="w-5 h-5 animate-spin" />
        <span class="text-sm">Loading contract...</span>
      </div>
    </div>

    <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans text-slate-900" v-else-if="contract">
      <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show" />

      <!-- DELETE CONFIRM MODAL -->
      <Transition name="modal-fade">
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showDeleteModal = false"></div>
          <!-- Modal content -->
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 space-y-4 border border-slate-200/80" style="min-width: 380px;">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 class="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">Delete Contract</h3>
                <p class="text-xs text-slate-400 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete contract
              <span class="font-semibold text-slate-900 font-mono">{{ contract.contractNumber }}</span>
              for <span class="font-semibold text-slate-900">{{ contract.employeeName }}</span>?
            </p>
            <div class="flex gap-3 pt-2">
              <button
                @click="showDeleteModal = false"
                class="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                @click="handleDelete"
                :disabled="isDeleting"
                class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <LoaderCircle v-if="isDeleting" class="w-3.5 h-3.5 animate-spin" />
                <span>{{ isDeleting ? 'Deleting...' : 'Delete Contract' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- HEADER DETAIL -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-slate-200 pb-5">
        <div>
          <nav class="flex items-center gap-1.5 text-xs text-slate-400 font-light mb-2">
            <span @click="$router.push('/contracts')" class="hover:text-slate-600 cursor-pointer transition-colors">Contracts</span>
            <span>&gt;</span>
            <span class="text-slate-600 font-normal">{{ contract.contractNumber }}</span>
          </nav>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-bold tracking-tight text-slate-900">Contract #{{ contract.contractNumber }}</h1>
            <StatusBadge :content="contract.status" :type="contract.status" />
          </div>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <SecondaryButton content="Back to List" @click="$router.push('/contracts')" />

          <button v-if="contract.fileUrl" @click="downloadFile"
            class="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5">
            <Download class="w-3.5 h-3.5" />
            Download PDF
          </button>

          <!-- Edit Button -->
          <button @click="goToEdit"
            class="px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white rounded-md text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm">
            <Pencil class="w-3.5 h-3.5" />
            Edit
          </button>

          <!-- Delete Button -->
          <button @click="showDeleteModal = true"
            class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-md text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5">
            <Trash2 class="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      <!-- MAIN LAYOUT 2 COLUMNS -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

        <!-- LEFT COLUMN: GENERAL TERMS & FINANCIALS -->
        <div class="lg:col-span-2 flex flex-col">
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6 flex-1">
            <h3 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">General Terms</h3>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Contract Type</span>
                <span class="text-sm font-semibold text-slate-800">{{ contract.contractType }}</span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Start Date</span>
                <span class="text-sm font-semibold text-slate-800">{{ contract.startDate }}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">End Date</span>
                <span class="text-sm font-semibold text-slate-800">{{ contract.endDate || 'Indefinite (Không thời hạn)' }}</span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Taxable Dependents</span>
                <span class="text-sm font-semibold text-slate-800">{{ contract.taxableDependents }} dependents</span>
              </div>
            </div>

            <h3 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 pt-4">Compensation & Allowances</h3>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Monthly Base Salary</span>
                <span class="text-lg font-mono font-bold text-emerald-600">{{ formatCurrency(contract.baseSalary) }}</span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Insurance Salary</span>
                <span class="text-lg font-mono font-bold text-slate-800">{{ formatCurrency(contract.insuranceSalary) }}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Lunch</span>
                <span class="text-xs font-mono font-semibold">{{ formatCurrency(contract.allowanceLunch) }}</span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Phone</span>
                <span class="text-xs font-mono font-semibold">{{ formatCurrency(contract.allowancePhone) }}</span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Transport</span>
                <span class="text-xs font-mono font-semibold">{{ formatCurrency(contract.allowanceTransport) }}</span>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Other</span>
                <span class="text-xs font-mono font-semibold">{{ formatCurrency(contract.allowanceOther) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: EMPLOYEE CARD -->
        <div class="flex flex-col">
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-center space-y-4 flex-1">
            <div class="w-16 h-16 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center mx-auto text-xl shadow-md uppercase">
              {{ contract.employeeName?.charAt(0) || 'E' }}
            </div>
            <div>
              <h4 class="text-base font-bold text-slate-900">{{ contract.employeeName || ('Employee #' + contract.employeeId) }}</h4>
              <p class="text-xs text-slate-400 font-mono">Code: {{ contract.employeeCode || contract.employeeId }}</p>
            </div>
            <div class="border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-1 text-left">
              <div class="flex justify-between"><span>Contract ID:</span> <span class="font-semibold text-slate-800">{{ contract.id }}</span></div>
              <div class="flex justify-between"><span>Created At:</span> <span class="font-semibold text-slate-800">{{ formatDate(contract.createdAt) }}</span></div>
              <div v-if="contract.updatedAt" class="flex justify-between"><span>Updated At:</span> <span class="font-semibold text-slate-800">{{ formatDate(contract.updatedAt) }}</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Not found state -->
    <div v-else class="p-6 md:p-8 max-w-7xl mx-auto font-sans text-slate-900 flex items-center justify-center py-32">
      <div class="text-center space-y-3">
        <p class="text-slate-400 text-sm">Contract not found.</p>
        <button @click="$router.push('/contracts')" class="text-xs text-blue-600 hover:underline cursor-pointer">Back to list</button>
      </div>
    </div>
  </MainContent>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainContent from '../components/MainContent.vue';
import StatusBadge from '../components/StatusBadge.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import ToastMessage from '../components/ToastMessage.vue';
import { useContractStore } from '../store/contractStore';
import { Pencil, Trash2, Download, LoaderCircle } from '@lucide/vue';

const route = useRoute();
const router = useRouter();
const contractStore = useContractStore();

const contract = ref(null);
const isLoading = ref(false);
const showDeleteModal = ref(false);
const isDeleting = ref(false);

const toast = reactive({ show: false, message: '', type: 'success' });
const triggerToast = (msg, type = 'success') => {
  toast.message = msg; toast.type = type; toast.show = true;
  setTimeout(() => { toast.show = false; }, 3500);
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
};

const formatDate = (isoStr) => {
  if (!isoStr) return 'N/A';
  return new Date(isoStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

onMounted(async () => {
  isLoading.value = true;
  try {
    contract.value = await contractStore.fetchContractById(route.params.id);
  } catch (err) {
    console.error('Fetch detail error:', err);
  } finally {
    isLoading.value = false;
  }
});

const goToEdit = () => {
  router.push(`/contracts/${route.params.id}/edit`);
};

const handleDelete = async () => {
  isDeleting.value = true;
  try {
    await contractStore.deleteContract(route.params.id);
    showDeleteModal.value = false;
    triggerToast('Contract deleted successfully.', 'success');
    setTimeout(() => {
      router.push('/contracts');
    }, 1200);
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Failed to delete contract.', 'error');
  } finally {
    isDeleting.value = false;
  }
};

const downloadFile = () => {
  if (contract.value?.fileUrl) {
    window.open(contract.value.fileUrl, '_blank');
  }
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>