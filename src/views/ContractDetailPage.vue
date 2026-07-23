<template>
  <MainContent>
    <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans text-slate-900" v-if="contract">
      <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show" />

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

        <div class="flex items-center gap-3">
          <SecondaryButton content="Back to List" @click="$router.push('/contracts')" />
          <button v-if="contract.fileUrl" @click="downloadFile" class="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer">
            Download PDF
          </button>
        </div>
      </div>

      <!-- MAIN LAYOUT 2 COLUMNS -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- LEFT COLUMN: GENERAL TERMS & FINANCIALS -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
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

        <!-- RIGHT COLUMN: EMPLOYEE CARD (ĐÃ CẬP NHẬT) -->
        <div class="space-y-6">
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-center space-y-4">
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
            </div>
          </div>
        </div>

      </div>
    </div>
  </MainContent>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MainContent from '../components/MainContent.vue';
import StatusBadge from '../components/StatusBadge.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import ToastMessage from '../components/ToastMessage.vue';
import { useContractStore } from '../store/contractStore';

const route = useRoute();
const contractStore = useContractStore();
const contract = ref(null);

const toast = reactive({ show: false, message: '', type: 'success' });

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
};

const formatDate = (isoStr) => {
  if (!isoStr) return 'N/A';
  return new Date(isoStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

onMounted(async () => {
  try {
    contract.value = await contractStore.fetchContractById(route.params.id);
  } catch (err) {
    console.error("Fetch detail error:", err);
  }
});

const downloadFile = () => {
  if (contract.value?.fileUrl) {
    window.open(contract.value.fileUrl, '_blank');
  }
};
</script>