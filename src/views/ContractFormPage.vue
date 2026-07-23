<template>
  <MainContent>
    <div class="p-6 md:p-8 max-w-4xl mx-auto font-sans text-slate-900">
      <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show" />

      <!-- HEADER -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Create New Contract</h1>
        <p class="text-xs text-slate-400 font-light mt-1">Define employment terms, financial structure, and compliance details for the employee.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-8 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">

        <!-- SECTION 1: IDENTITY & CORE INFO -->
        <div class="space-y-4">
          <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">1. Identity & Core Info</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Employee Selection <span class="text-red-500">*</span></label>

              <select v-model.number="form.employeeId" required class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black bg-slate-50">
                <option :value="null" disabled>Select employee...</option>
                <option v-for="e in employees" :key="e.id || e.employeeCode" :value="e.id">
                  {{ e.fullName }} ({{ e.employeeCode }})
                </option>
              </select>
            </div>

            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Contract Number <span class="text-red-500">*</span></label>
              <input type="text" v-model="form.contractNumber" placeholder="e.g. CTR-2026-001" required class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Contract Type <span class="text-red-500">*</span></label>
              <select v-model="form.contractType" required class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black bg-slate-50">
                <option value="Full-time Permanent">Full-time Permanent</option>
                <option value="Probation">Probation</option>
                <option value="Fixed-term">Fixed-term</option>
              </select>
            </div>

            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Taxable Dependents</label>
              <input type="number" min="0" v-model.number="form.taxableDependents" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black" />
            </div>
          </div>
        </div>

        <!-- SECTION 2: CONTRACT TERM -->
        <div class="space-y-4">
          <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">2. Contract Term</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Start Date <span class="text-red-500">*</span></label>
              <input type="date" v-model="form.startDate" required class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black" />
            </div>

            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">End Date (Optional)</label>
              <input type="date" v-model="form.endDate" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black" />
            </div>
          </div>
        </div>

        <!-- SECTION 3: COMPENSATION STRUCTURE -->
        <div class="space-y-4">
          <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">3. Compensation Structure</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Base Monthly Salary (VND) <span class="text-red-500">*</span></label>
              <input type="number" step="100000" v-model.number="form.baseSalary" required placeholder="0.00" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black font-mono" />
            </div>

            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Insurance Salary (VND) <span class="text-red-500">*</span></label>
              <input type="number" step="100000" v-model.number="form.insuranceSalary" required placeholder="0.00" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black font-mono" />
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Lunch Allowance</label>
              <input type="number" v-model.number="form.allowanceLunch" class="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-black font-mono" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Phone Allowance</label>
              <input type="number" v-model.number="form.allowancePhone" class="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-black font-mono" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Transport</label>
              <input type="number" v-model.number="form.allowanceTransport" class="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-black font-mono" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Other Allowance</label>
              <input type="number" v-model.number="form.allowanceOther" class="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-black font-mono" />
            </div>
          </div>
        </div>


        <!-- FOOTER ACTIONS -->
        <div class="flex items-center justify-between border-t border-slate-100 pt-6">
          <span class="text-xs text-slate-400 font-light">Ensure all mandatory fields (*) are populated accurately.</span>
          <div class="flex gap-3">
            <SecondaryButton content="Cancel" @click="cancel" />
            <PrimaryButton :content="isSubmitting ? 'Creating...' : 'Create'" type="submit" :disabled="isSubmitting" />
          </div>
        </div>

      </form>
    </div>
  </MainContent>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MainContent from '../components/MainContent.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import ToastMessage from '../components/ToastMessage.vue';
import { useContractStore } from '../store/contractStore';
import { useEmployeeStore } from '../store/employeeStore';

const router = useRouter();
const contractStore = useContractStore();
const employeeStore = useEmployeeStore();

const isSubmitting = ref(false);
const employees = ref([]);

const toast = reactive({ show: false, message: '', type: 'success' });
const triggerToast = (msg, type = 'success') => {
  toast.message = msg; toast.type = type; toast.show = true;
  setTimeout(() => { toast.show = false; }, 3500);
};

const form = reactive({
  employeeId: null,
  contractNumber: '',
  contractType: 'Full-time Permanent',
  startDate: '',
  endDate: null,
  baseSalary: 10000000,
  insuranceSalary: 10000000,
  allowanceLunch: 0,
  allowancePhone: 0,
  allowanceTransport: 0,
  allowanceOther: 0,
  taxableDependents: 0,
  fileUrl: ''
});

onMounted(async () => {
  try {
    const res = await employeeStore.fetchEmployees(0, 100);
    employees.value = res?.data?.items || employeeStore.employees || [];
  } catch (e) {
    console.error("Load employees error:", e);
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    await contractStore.createContract({ ...form });
    triggerToast('Contract created successfully!', 'success');
    setTimeout(() => {
      router.push('/contracts');
    }, 1500);
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Failed to create contract.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const cancel = () => router.push('/contracts');
</script>