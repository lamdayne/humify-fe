<template>
  <MainContent>
    <div class="p-6 md:p-8 max-w-4xl mx-auto font-sans text-slate-900">
      <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show" />

      <!-- HEADER -->
      <div class="mb-8">
        <nav class="flex items-center gap-1.5 text-xs text-slate-400 font-light mb-2">
          <span @click="cancel" class="hover:text-slate-600 cursor-pointer transition-colors">Contracts</span>
          <span>&gt;</span>
          <span v-if="isEditMode && contract" @click="$router.push(`/contracts/${contractId}`)" class="hover:text-slate-600 cursor-pointer transition-colors">
            {{ contract.contractNumber }}
          </span>
          <span v-if="isEditMode">&gt;</span>
          <span class="text-slate-600 font-normal">{{ isEditMode ? 'Edit Contract' : 'New Contract' }}</span>
        </nav>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">
          {{ isEditMode ? 'Edit Contract' : 'Create New Contract' }}
        </h1>
        <p class="text-xs text-slate-400 font-light mt-1">
          {{ isEditMode ? 'Update employment terms and compensation details.' : 'Define employment terms, financial structure, and compliance details for the employee.' }}
        </p>
      </div>

      <!-- LOADING STATE (edit mode) -->
      <div v-if="isLoadingContract" class="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-center gap-3 py-20">
        <LoaderCircle class="w-5 h-5 animate-spin text-slate-500" />
        <span class="text-sm text-slate-400">Loading contract data...</span>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-8 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">

        <!-- SECTION 1: IDENTITY & CORE INFO -->
        <div class="space-y-4">
          <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">1. Identity & Core Info</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <!-- EMPLOYEE SELECTOR (chỉ hiển thị khi tạo mới) -->
            <div class="relative" v-if="!isEditMode">
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Employee Selection <span class="text-red-500">*</span>
              </label>

              <!-- Ô hiển thị / trigger mở dropdown -->
              <div
                  @click="toggleEmployeeDropdown"
                  class="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50 flex items-center justify-between cursor-pointer hover:border-slate-400 transition-colors"
              >
                <span :class="selectedEmployeeText ? 'text-slate-900 font-medium' : 'text-slate-400'">
                  {{ selectedEmployeeText || 'Select employee...' }}
                </span>
                <ChevronDown class="w-4 h-4 text-slate-400 transition-transform" :class="{ 'rotate-180': isDropdownOpen }" />
              </div>

              <!-- Menu Thả Xuống -->
              <div
                  v-if="isDropdownOpen"
                  class="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col"
              >
                <!-- Ô Tìm kiếm tên / mã NV -->
                <div class="p-2 border-b border-slate-100 bg-slate-50">
                  <div class="relative">
                    <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                        type="text"
                        v-model="searchKeyword"
                        @input="onSearchInput"
                        placeholder="Type to search..."
                        class="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <!-- Danh sách nhân viên có bắt sự kiện Scroll -->
                <div
                    ref="dropdownListRef"
                    @scroll="handleScroll"
                    class="max-h-56 overflow-y-auto hide-scrollbar divide-y divide-slate-50"
                >
                  <div
                      v-for="e in employees"
                      :key="e.id"
                      @click="selectEmployee(e)"
                      class="p-2.5 text-xs hover:bg-slate-100 cursor-pointer flex items-center justify-between transition-colors"
                      :class="{ 'bg-slate-50 font-semibold text-blue-600': form.employeeId === e.id }"
                  >
                    <span>{{ e.fullName }}</span>
                    <span class="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {{ e.employeeCode }}
                    </span>
                  </div>

                  <!-- Trạng thái Loading khi cuộn xuống cuối -->
                  <div v-if="isLoadingMore" class="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <LoaderCircle class="w-4 h-4 animate-spin text-slate-600" />
                    <span>Loading more...</span>
                  </div>

                  <!-- Khi không tìm thấy kết quả -->
                  <div v-if="employees.length === 0 && !isLoadingMore" class="p-4 text-center text-xs text-slate-400">
                    No employees found.
                  </div>
                </div>
              </div>
            </div>

            <!-- Edit mode: hiển thị tên nhân viên (readonly) -->
            <div v-else>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Employee</label>
              <div class="w-full border border-slate-100 rounded-lg p-2.5 text-xs bg-slate-50 text-slate-600 font-medium flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase">
                  {{ contract?.employeeName?.charAt(0) || 'E' }}
                </div>
                {{ contract?.employeeName || ('Employee #' + contract?.employeeId) }}
                <span class="text-slate-400 font-mono text-[10px]">({{ contract?.employeeCode || contract?.employeeId }})</span>
              </div>
            </div>

            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Contract Number <span class="text-red-500">*</span></label>
              <input
                type="text"
                v-model="form.contractNumber"
                placeholder="e.g. CTR-2026-001"
                :required="!isEditMode"
                :readonly="isEditMode"
                :class="isEditMode ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''"
                class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Contract Type <span class="text-red-500">*</span></label>
              <select v-model="form.contractType" required class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-slate-50">
                <option value="Full-time Permanent">Full-time Permanent</option>
                <option value="Probation">Probation</option>
                <option value="Fixed-term">Fixed-term</option>
              </select>
            </div>

            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Taxable Dependents</label>
              <input type="number" min="0" v-model.number="form.taxableDependents" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
            </div>
          </div>

          <!-- Status field (only in edit mode) -->
          <div v-if="isEditMode" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Contract Status</label>
              <select v-model="form.status" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-slate-50">
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expired</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>
          </div>
        </div>

        <!-- SECTION 2: CONTRACT TERM -->
        <div class="space-y-4">
          <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">2. Contract Term</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Start Date <span class="text-red-500">*</span></label>
              <input type="date" v-model="form.startDate" required class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
            </div>

            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">End Date (Optional)</label>
              <input type="date" v-model="form.endDate" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
            </div>
          </div>
        </div>

        <!-- SECTION 3: COMPENSATION STRUCTURE -->
        <div class="space-y-4">
          <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">3. Compensation Structure</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Base Monthly Salary (VND) <span class="text-red-500">*</span></label>
              <input type="number" step="100000" v-model.number="form.baseSalary" required placeholder="0.00" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-mono" />
            </div>

            <div>
              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Insurance Salary (VND) <span class="text-red-500">*</span></label>
              <input type="number" step="100000" v-model.number="form.insuranceSalary" required placeholder="0.00" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-mono" />
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Lunch Allowance</label>
              <input type="number" v-model.number="form.allowanceLunch" class="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-mono" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Phone Allowance</label>
              <input type="number" v-model.number="form.allowancePhone" class="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-mono" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Transport</label>
              <input type="number" v-model.number="form.allowanceTransport" class="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-mono" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Other Allowance</label>
              <input type="number" v-model.number="form.allowanceOther" class="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-mono" />
            </div>
          </div>
        </div>

        <!-- FOOTER ACTIONS -->
        <div class="flex items-center justify-between border-t border-slate-100 pt-6">
          <span class="text-xs text-slate-400 font-light">Ensure all mandatory fields (*) are populated accurately.</span>
          <div class="flex gap-3">
            <SecondaryButton content="Cancel" @click="cancel" />
            <PrimaryButton
              :content="isSubmitting ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create')"
              type="submit"
              :disabled="isSubmitting"
            />
          </div>
        </div>

      </form>
    </div>
  </MainContent>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import MainContent from '../components/MainContent.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import ToastMessage from '../components/ToastMessage.vue';
import { useContractStore } from '../store/contractStore';
import { useEmployeeStore } from '../store/employeeStore';
import { ChevronDown, Search, LoaderCircle } from '@lucide/vue';

const router = useRouter();
const route = useRoute();
const contractStore = useContractStore();
const employeeStore = useEmployeeStore();

// Detect edit mode dựa vào route
const contractId = computed(() => route.params.id);
const isEditMode = computed(() => !!contractId.value);

const isSubmitting = ref(false);
const isLoadingContract = ref(false);
const contract = ref(null); // dữ liệu gốc khi edit

// State Quản lý Infinite Scroll Nhân viên (chỉ dùng khi tạo mới)
const employees = ref([]);
const isDropdownOpen = ref(false);
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = 20;
const hasMoreEmployees = ref(true);
const isLoadingMore = ref(false);
const selectedEmployeeText = ref('');
const dropdownListRef = ref(null);
let searchDebounceTimeout = null;

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
  status: 'ACTIVE',
  fileUrl: ''
});

// Load dữ liệu contract khi edit
const loadContractData = async () => {
  if (!isEditMode.value) return;
  isLoadingContract.value = true;
  try {
    const data = await contractStore.fetchContractById(contractId.value);
    contract.value = data;

    // Điền dữ liệu vào form
    form.contractNumber = data.contractNumber || '';
    form.contractType = data.contractType || 'Full-time Permanent';
    form.startDate = data.startDate || '';
    form.endDate = data.endDate || null;
    form.baseSalary = data.baseSalary || 0;
    form.insuranceSalary = data.insuranceSalary || 0;
    form.allowanceLunch = data.allowanceLunch || 0;
    form.allowancePhone = data.allowancePhone || 0;
    form.allowanceTransport = data.allowanceTransport || 0;
    form.allowanceOther = data.allowanceOther || 0;
    form.taxableDependents = data.taxableDependents || 0;
    form.status = data.status || 'ACTIVE';
    form.fileUrl = data.fileUrl || '';
  } catch (e) {
    triggerToast('Failed to load contract data.', 'error');
    console.error('Load contract for edit error:', e);
  } finally {
    isLoadingContract.value = false;
  }
};

// ---- Employee Dropdown (chỉ dùng khi create) ----
const fetchEmployeesPage = async (page = 1, isNewSearch = false) => {
  if (isLoadingMore.value) return;
  if (!isNewSearch && !hasMoreEmployees.value) return;

  isLoadingMore.value = true;
  try {
    const keyword = searchKeyword.value.trim();
    const res = keyword
        ? await employeeStore.searchEmployees(keyword, page - 1, pageSize)
        : await employeeStore.fetchEmployees(page, pageSize);

    const newItems = res?.data?.items || [];
    const totalPages = res?.data?.totalPages || 1;

    if (isNewSearch) {
      employees.value = newItems;
    } else {
      employees.value = [...employees.value, ...newItems];
    }

    hasMoreEmployees.value = page < totalPages;
    currentPage.value = page;
  } catch (e) {
    console.error('Load employees page error:', e);
  } finally {
    isLoadingMore.value = false;
  }
};

const handleScroll = (e) => {
  const el = e.target;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
    if (hasMoreEmployees.value && !isLoadingMore.value) {
      fetchEmployeesPage(currentPage.value + 1, false);
    }
  }
};

const toggleEmployeeDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectEmployee = (emp) => {
  form.employeeId = emp.id;
  selectedEmployeeText.value = `${emp.fullName} (${emp.employeeCode})`;
  isDropdownOpen.value = false;
};

const onSearchInput = () => {
  clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(() => {
    currentPage.value = 1;
    hasMoreEmployees.value = true;
    fetchEmployeesPage(1, true);
  }, 300);
};

const handleClickOutside = (e) => {
  const target = e.target;
  if (isDropdownOpen.value && !target.closest('.relative')) {
    isDropdownOpen.value = false;
  }
};

onMounted(async () => {
  if (isEditMode.value) {
    await loadContractData();
  } else {
    fetchEmployeesPage(1, true);
    document.addEventListener('click', handleClickOutside);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Submit: tạo mới hoặc cập nhật
const handleSubmit = async () => {
  if (!isEditMode.value && !form.employeeId) {
    triggerToast('Please select an employee.', 'error');
    return;
  }

  isSubmitting.value = true;
  try {
    if (isEditMode.value) {
      // Chỉ gửi các field có trong UpdateContractRequest
      const payload = {
        contractType: form.contractType,
        startDate: form.startDate,
        endDate: form.endDate || null,
        baseSalary: form.baseSalary,
        insuranceSalary: form.insuranceSalary,
        allowanceLunch: form.allowanceLunch,
        allowancePhone: form.allowancePhone,
        allowanceTransport: form.allowanceTransport,
        allowanceOther: form.allowanceOther,
        taxableDependents: form.taxableDependents,
        status: form.status,
        fileUrl: form.fileUrl
      };
      await contractStore.updateContract(contractId.value, payload);
      triggerToast('Contract updated successfully!', 'success');
      setTimeout(() => {
        router.push(`/contracts/${contractId.value}`);
      }, 1500);
    } else {
      await contractStore.createContract({ ...form });
      triggerToast('Contract created successfully!', 'success');
      setTimeout(() => {
        router.push('/contracts');
      }, 1500);
    }
  } catch (err) {
    triggerToast(err.response?.data?.message || (isEditMode.value ? 'Failed to update contract.' : 'Failed to create contract.'), 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const cancel = () => {
  if (isEditMode.value) {
    router.push(`/contracts/${contractId.value}`);
  } else {
    router.push('/contracts');
  }
};
</script>