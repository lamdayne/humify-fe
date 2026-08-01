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

            <!-- CUSTOM EMPLOYEE SELECTOR (INFINITE SCROLL + SEARCH) -->
            <div class="relative">
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
                        class="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-black"
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
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import MainContent from '../components/MainContent.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import ToastMessage from '../components/ToastMessage.vue';
import { useContractStore } from '../store/contractStore';
import { useEmployeeStore } from '../store/employeeStore';
import { ChevronDown, Search, LoaderCircle } from '@lucide/vue';

const router = useRouter();
const contractStore = useContractStore();
const employeeStore = useEmployeeStore();

const isSubmitting = ref(false);

// State Quản lý Infinite Scroll Nhập viên
const employees = ref([]);
const isDropdownOpen = ref(false);
const searchKeyword = ref('');
const currentPage = ref(1); // Page 1-based (Store sẽ trừ 1 khi gọi API)
const pageSize = 20; // Mỗi lần load 20 nhân viên
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
  fileUrl: ''
});

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
    console.error("Load employees page error:", e);
  } finally {
    isLoadingMore.value = false;
  }
};

// Xử lý sự kiện Scroll trong Menu Thả xuống
const handleScroll = (e) => {
  const el = e.target;
  // Bắt điểm chạm đáy (cách đáy dưới 10px)
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
    if (hasMoreEmployees.value && !isLoadingMore.value) {
      fetchEmployeesPage(currentPage.value + 1, false);
    }
  }
};

// Toggle Bật/Tắt Dropdown
const toggleEmployeeDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Chọn Nhân viên
const selectEmployee = (emp) => {
  form.employeeId = emp.id;
  selectedEmployeeText.value = `${emp.fullName} (${emp.employeeCode})`;
  isDropdownOpen.value = false;
};

// Tìm kiếm có Debounce
const onSearchInput = () => {
  clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(() => {
    currentPage.value = 1;
    hasMoreEmployees.value = true;
    fetchEmployeesPage(1, true);
  }, 300);
};

// Đóng dropdown khi click ra ngoài
const handleClickOutside = (e) => {
  const target = e.target;
  if (isDropdownOpen.value && !target.closest('.relative')) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  fetchEmployeesPage(1, true);
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleSubmit = async () => {
  if (!form.employeeId) {
    triggerToast('Please select an employee.', 'error');
    return;
  }

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