<template>
  <MainContent>
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div
          class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Payroll Management</h1>
          <div class="flex items-center gap-3 mt-2">
            <span class="text-gray-600">{{ selectedPayroll?.name }}</span>
            <span class="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
              {{ selectedPayroll?.status }}
            </span>
            <span v-if="selectedPayroll?.status === 'PAID' && selectedPayroll?.paymentDate"
                  class="text-sm text-gray-500">
              Paid on: {{ formatDate(selectedPayroll.paymentDate) }}
            </span>
          </div>

          <!-- Status stepper -->
          <div class="flex items-center gap-2 mt-3">
            <span :class="stepClass('DRAFT')">1. Draft</span>
            <div class="w-6 h-px bg-gray-300"></div>
            <span :class="stepClass('APPROVED')">2. Approved</span>
            <div class="w-6 h-px bg-gray-300"></div>
            <span :class="stepClass('PAID')">3. Paid</span>
          </div>
        </div>

        <div class="flex gap-3 mt-4 lg:mt-0">
          <button @click="calculatePayroll" :disabled="!canCalculate"
                  class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
            Calculate Payroll
          </button>

          <button @click="approvePayroll" :disabled="!canApprove"
                  class="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
            Approve Payroll
          </button>

          <button @click="payPayroll" :disabled="!canPay"
                  class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
            Pay Salary
          </button>
        </div>
      </div>

      <!-- Period selector -->
      <div class="flex items-center gap-4 justify-between">
        <div class="flex items-center gap-4">
          <label class="font-medium">Payroll Period</label>
          <select v-model="selectedPayroll" @change="onPeriodChange" class="border rounded-lg px-3 py-2">
            <option v-for="period in payrollPeriods" :key="period.id" :value="period">
              {{ period.name }}
            </option>
          </select>
        </div>

        <button @click="openCreatePeriod"
                class="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium">
          + New Payroll Period
        </button>
      </div>

      <!-- Filter -->
      <div class="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div class="flex flex-col lg:flex-row gap-4 lg:items-center">
          <input
              v-model="search"
              type="text"
              placeholder="Search employee (current page)..."
              class="w-full lg:w-80 border border-gray-300 rounded-lg px-4 py-2"/>
          <select v-model="statusFilter" @change="onFilterChange" class="border border-gray-300 rounded-lg px-4 py-2">
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div
          class="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
      >
        <table class="w-full text-left border-collapse">
          <thead>
          <tr class="bg-slate-50/70 border-b border-slate-200/80">
            <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Employee</th>
            <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Gross Salary</th>
            <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Net Salary</th>
            <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Status</th>
            <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-right">Action</th>
          </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
          <tr v-if="loading">
            <td colspan="5" class="px-6 py-6 text-center text-gray-400">Loading...</td>
          </tr>
          <tr v-else-if="filteredPayslips.length === 0">
            <td colspan="5" class="px-6 py-6 text-center text-gray-400">No data</td>
          </tr>
          <tr v-for="employee in filteredPayslips"
              :key="employee.id"
              class="hover:bg-slate-50/40 transition-colors group cursor-pointer"
              @click="openDetail(employee)">
            <td class="py-5 px-6">
    <span
        class="font-bold text-slate-900 text-[15px] tracking-tight group-hover:text-black transition-colors">
        {{ employee.employeeName }}
    </span>
            </td>
            <td class="py-5 px-6 text-sm text-slate-600">
              {{ formatCurrency(employee.grossSalary) }}
            </td>
            <td class="py-5 px-6 text-sm font-semibold text-green-600">
              {{ formatCurrency(employee.netSalary) }}
            </td>
            <td class="py-5 px-6 text-xs md:text-sm whitespace-nowrap">
              <span
                  :class="statusBadgeClass(employee.status)"
                  class="px-3 py-1 rounded-full text-xs font-medium">
                {{ employee.status }}
              </span>
            </td>
            <td class="py-5 px-6 text-right">
              <button
                  v-if="canEditPayslip"
                  class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  @click.stop="openEdit(employee)">
                Edit
              </button>
              <span
                  v-else
                  class="text-slate-400 text-sm">Locked
              </span>
            </td>
          </tr>
          </tbody>
        </table>

      </div>
      <!-- Pagination -->
      <PaginationSection
          v-model:currentPage="pagination.pageNo"
          :total-items="pagination.totalElements"
          :total-page="pagination.totalPages"
          :page-size="pagination.pageSize"
          item-label="payslips"
          @changePage="handlePageChange"
      />

      <!--      edit modal-->
      <div v-if="showModal"
           class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between border-b px-6 py-4">
            <h2 class="text-xl font-bold">
              Edit Payslip
            </h2>
            <button
                @click="showModal = false"
                class="text-2xl text-gray-500 hover:text-red-500">
              ×
            </button>
          </div>
          <!-- Body -->
          <div class="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            <div>
              <label class="block text-sm mb-2">Employee</label>
              <input :value="selectedEmployee?.employeeName"
                     disabled
                     class="w-full rounded-lg border bg-gray-100 px-4 py-2">
            </div>
            <div>
              <label class="block text-sm mb-2">Other Bonus</label>
              <input v-model="otherBonus"
                     type="number"
                     class="w-full rounded-lg border px-4 py-2">
            </div>
            <div>
              <label class="block text-sm mb-2">Other Deduction</label>
              <input v-model="otherDeduction"
                     type="number"
                     class="w-full rounded-lg border px-4 py-2">
            </div>
            <div>
              <label class="block text-sm mb-2">Note</label>
              <textarea
                  rows="4"
                  v-model="note"
                  class="w-full rounded-lg border px-4 py-2"
              />
            </div>
          </div>
          <!-- Footer -->
          <div class="flex justify-end gap-3 border-t px-6 py-4">
            <button
                @click="showModal = false"
                class="rounded-lg border px-5 py-2">
              Cancel
            </button>
            <button
                @click="savePayslip"
                class="rounded-lg bg-blue-600 px-5 py-2 text-white">Save
            </button>
          </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <div
          v-if="showDetail"
          @click.self="showDetail = false"
          class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
          <!-- Header -->
          <div class="border-b px-8 py-5 flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold">
                Payroll Detail
              </h2>
              <p class="text-gray-500 mt-1">
                {{ detailPayslip.employeeName }}
              </p>
            </div>
            <button
                @click="showDetail=false"
                class="text-gray-500 hover:text-red-500 text-2xl"
            >
              ✕
            </button>
          </div>
          <div
              class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto hide-scrollbar relative"
          >
            <div class="flex-1 overflow-y-auto no-scrollbar p-8">
              <!-- Employee -->
              <div>
                <h3 class="font-semibold text-lg mb-4">
                  Employee Information
                </h3>
                <div class="grid grid-cols-2 gap-5">
                  <div>
                    <p class="text-gray-500 text-sm">
                      Employee
                    </p>
                    <p class="font-semibold">
                      {{ detailPayslip.employeeName }}
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">
                      Employee Code
                    </p>
                    <p class="font-semibold">
                      {{ detailPayslip.employeeCode }}
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">
                      Status
                    </p>
                    <span
                        :class="statusBadgeClass(detailPayslip.status)"
                        class="px-3 py-1 rounded-full text-xs font-medium">
              {{ detailPayslip.status }}
            </span>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">
                      Payment Date
                    </p>
                    <p>
                      {{ formatDate(detailPayslip.paymentDate) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Income -->

              <div>
                <h3 class="font-semibold text-lg mb-4">
                  Earnings
                </h3>
                <table class="w-full">
                  <tbody>
                  <tr class="border-b">
                    <td>Base Salary</td>
                    <td class="text-right">
                      {{ formatCurrency(detailPayslip.baseSalary) }}
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td>Salary By Work Days</td>
                    <td class="text-right">
                      {{ formatCurrency(detailPayslip.salaryByWorkDays) }}
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td>Allowance</td>
                    <td class="text-right">
                      {{ formatCurrency(detailPayslip.totalAllowances) }}
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td>KPI Bonus</td>
                    <td class="text-right">
                      {{ formatCurrency(detailPayslip.bonusKpi) }}
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td>Project Bonus</td>
                    <td class="text-right">
                      {{ formatCurrency(detailPayslip.bonusProject) }}
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td>Other Bonus</td>
                    <td class="text-right">
                      {{ formatCurrency(detailPayslip.otherBonuses) }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-bold">
                      Gross Salary
                    </td>
                    <td class="text-right font-bold text-blue-600">
                      {{ formatCurrency(detailPayslip.grossSalary) }}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <!-- Deduction -->
              <div>
                <h3 class="font-semibold text-lg mb-4">
                  Deductions
                </h3>
                <table class="w-full">
                  <tbody>
                  <tr class="border-b">
                    <td>Social Insurance</td>
                    <td class="text-right">
                      {{ formatCurrency(detailPayslip.deductionSocialInsurance) }}
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td>Health Insurance</td>
                    <td class="text-right">
                      {{ formatCurrency(detailPayslip.deductionHealthInsurance) }}
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td>Unemployment Insurance</td>
                    <td class="text-right">
                      {{ formatCurrency(detailPayslip.deductionUnemploymentInsurance) }}
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td>Personal Income Tax</td>
                    <td class="text-right">
                      {{ formatCurrency(detailPayslip.personalIncomeTax) }}
                    </td>
                  </tr>
                  <tr class="border-b">
                    <td>Other Deduction</td>
                    <td class="text-right">
                      {{ formatCurrency(detailPayslip.otherDeductions) }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-bold">
                      Net Salary
                    </td>
                    <td class="text-right text-green-600 font-bold text-xl">
                      {{ formatCurrency(detailPayslip.netSalary) }}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <!-- Work -->
              <div>
                <h3 class="font-semibold text-lg mb-4">
                  Attendance
                </h3>
                <div class="grid grid-cols-4 gap-4">
                  <div>
                    <p class="text-gray-500 text-sm">
                      Standard Days
                    </p>
                    <p>
                      {{ detailPayslip.standardWorkDays }}
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">
                      Actual Days
                    </p>
                    <p>
                      {{ detailPayslip.actualWorkDays }}
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">
                      Paid Leave
                    </p>
                    <p>
                      {{ detailPayslip.paidLeaveDays }}
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-500 text-sm">
                      OT Hours
                    </p>
                    <p>
                      {{ detailPayslip.otHours }}
                    </p>
                  </div>
                </div>
              </div>
              <!-- Note -->
              <div>
                <h3 class="font-semibold text-lg mb-2">
                  Note
                </h3>
                <div class="bg-gray-50 rounded-xl p-4">
                  {{ detailPayslip.note || "No note." }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Payroll Period Modal -->
      <ModalGeneric v-model="createModal.show" title="New Payroll Period" width="520px">
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-2">Period Name <span class="text-red-500">*</span></label>
            <input v-model="createForm.name" type="text" placeholder="e.g. Payroll July 2026"
                   class="w-full rounded-lg border px-4 py-2"/>
            <p v-if="createErrors.name" class="text-xs text-red-500 mt-1">{{ createErrors.name }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm mb-2">Month <span class="text-red-500">*</span></label>
              <input v-model.number="createForm.month" type="number" min="1" max="12"
                     class="w-full rounded-lg border px-4 py-2"/>
              <p v-if="createErrors.month" class="text-xs text-red-500 mt-1">{{ createErrors.month }}</p>
            </div>
            <div>
              <label class="block text-sm mb-2">Year <span class="text-red-500">*</span></label>
              <input v-model.number="createForm.year" type="number" min="2000"
                     class="w-full rounded-lg border px-4 py-2"/>
              <p v-if="createErrors.year" class="text-xs text-red-500 mt-1">{{ createErrors.year }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm mb-2">Start Date <span class="text-red-500">*</span></label>
              <input v-model="createForm.startDate" type="date" class="w-full rounded-lg border px-4 py-2"/>
              <p v-if="createErrors.startDate" class="text-xs text-red-500 mt-1">{{ createErrors.startDate }}</p>
            </div>
            <div>
              <label class="block text-sm mb-2">End Date <span class="text-red-500">*</span></label>
              <input v-model="createForm.endDate" type="date" class="w-full rounded-lg border px-4 py-2"/>
              <p v-if="createErrors.endDate" class="text-xs text-red-500 mt-1">{{ createErrors.endDate }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm mb-2">Standard Work Days <span class="text-red-500">*</span></label>
            <input v-model.number="createForm.standardWorkDays" type="number" step="0.5" min="0"
                   class="w-full rounded-lg border px-4 py-2"/>
            <p v-if="createErrors.standardWorkDays" class="text-xs text-red-500 mt-1">{{ createErrors.standardWorkDays }}</p>
            <p class="text-xs text-gray-400 mt-1">Total standard working days used to calculate salary per day.</p>
          </div>
        </div>

        <template #footer>
          <button @click="createModal.show = false" class="px-5 py-2 border rounded-lg">Cancel</button>
          <button @click="submitCreatePeriod" :disabled="creating"
                  class="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
            {{ creating ? "Creating..." : "Create" }}
          </button>
        </template>
      </ModalGeneric>
    </div>
  </MainContent>

  <ToastMessage
      :message="toast.message"
      :type="toast.type"
      :show="toast.show"
  />

  <ModalGeneric
      v-model="actionModal.show"
      :title="actionModal.title"
      width="460px"
  >
    <div class="flex items-start gap-4">
      <div
          class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0"
      >
        <HelpCircle class="w-5 h-5"/>
      </div>

      <div>
        <p class="text-base text-slate-700">
          {{ actionModal.message }}
        </p>

        <p class="text-sm text-slate-400 mt-1">
          {{ actionModal.subMessage }}
        </p>
      </div>
    </div>

    <template #footer>
      <button
          @click="actionModal.show = false"
          class="px-5 py-2 border rounded-lg"
      >
        Cancel
      </button>

      <button
          @click="confirmAction"
          class="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
      >
        {{ actionModal.button }}
      </button>
    </template>
  </ModalGeneric>

</template>

<script setup>
import {computed, ref, onMounted, reactive} from "vue";
import MainContent from "../components/MainContent.vue";
import {usePayrollStore} from "../store/payroll.js";
import PaginationSection from "../components/PaginationSection.vue";
import ToastMessage from "../components/ToastMessage.vue";
import ModalGeneric from "../components/ModalGeneric.vue";
import { HelpCircle } from "@lucide/vue";


const payrollStore = usePayrollStore();
// details payslip
const showDetail = ref(false);
const detailPayslip = ref(null);

// Filters (search applies to current page only, statusFilter is sent to the server)
const search = ref("");
const statusFilter = ref("");

// Edit modal
const showModal = ref(false);
const selectedEmployee = ref(null);
const otherBonus = ref(0);
const otherDeduction = ref(0);
const note = ref("");

// Data
const payrollPeriods = ref([]);
const selectedPayroll = ref(null);
const payslips = ref([]);
const loading = ref(false);

// Pagination (0-based, matches BE /payroll-periods/{id}/payslips; BE requires minimum size of 10)
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  totalPages: 0,
  totalElements: 0,
});

// confirm modal
const actionModal = reactive({
  show: false,
  title: "",
  message: "",
  subMessage: "",
  button: "",
  action: null,
});

// ---------- Create Payroll Period ----------
const createModal = reactive({ show: false });
const creating = ref(false);

const createForm = reactive({
  name: "",
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  startDate: "",
  endDate: "",
  standardWorkDays: 22,
});

const createErrors = reactive({
  name: "",
  month: "",
  year: "",
  startDate: "",
  endDate: "",
  standardWorkDays: "",
});

function openCreatePeriod() {
  createForm.name = "";
  createForm.month = new Date().getMonth() + 1;
  createForm.year = new Date().getFullYear();
  createForm.startDate = "";
  createForm.endDate = "";
  createForm.standardWorkDays = 22;
  Object.keys(createErrors).forEach((k) => (createErrors[k] = ""));
  createModal.show = true;
}

function validateCreateForm() {
  Object.keys(createErrors).forEach((k) => (createErrors[k] = ""));
  let valid = true;

  if (!createForm.name?.trim()) {
    createErrors.name = "Period name is required.";
    valid = false;
  }
  if (!createForm.month || createForm.month < 1 || createForm.month > 12) {
    createErrors.month = "Month must be between 1 and 12.";
    valid = false;
  }
  if (!createForm.year) {
    createErrors.year = "Year is required.";
    valid = false;
  }
  if (!createForm.startDate) {
    createErrors.startDate = "Start date is required.";
    valid = false;
  }
  if (!createForm.endDate) {
    createErrors.endDate = "End date is required.";
    valid = false;
  }
  if (
      createForm.startDate &&
      createForm.endDate &&
      new Date(createForm.startDate) > new Date(createForm.endDate)
  ) {
    createErrors.endDate = "End date must be after start date.";
    valid = false;
  }
  if (!createForm.standardWorkDays || createForm.standardWorkDays <= 0) {
    createErrors.standardWorkDays = "Standard work days must be greater than 0.";
    valid = false;
  }

  return valid;
}

const submitCreatePeriod = async () => {
  if (!validateCreateForm()) return;

  creating.value = true;
  try {
    await payrollStore.createPayrollPeriod({
      name: createForm.name,
      month: createForm.month,
      year: createForm.year,
      startDate: createForm.startDate,
      endDate: createForm.endDate,
      standardWorkDays: createForm.standardWorkDays,
    });

    createModal.show = false;
    triggerToast("Payroll period created successfully.");
    await loadPayrollPeriods();
  } catch (e) {
    console.error(e);
    triggerToast(
        e.response?.data?.message || "Failed to create payroll period.",
        "error"
    );
  } finally {
    creating.value = false;
  }
};

// ---------- Workflow guards ----------
const canCalculate = computed(() => selectedPayroll.value?.status === "DRAFT");
const canApprove = computed(() => selectedPayroll.value?.status === "DRAFT");
const canPay = computed(() => selectedPayroll.value?.status === "APPROVED");
const canEditPayslip = computed(() => selectedPayroll.value?.status === "DRAFT");

function stepClass(step) {
  const order = ["DRAFT", "APPROVED", "PAID"];
  const current = order.indexOf(selectedPayroll.value?.status);
  const target = order.indexOf(step);
  if (current === -1) return "text-gray-400 text-xs";
  if (target < current) return "text-green-600 font-medium text-xs";
  if (target === current) return "text-blue-600 font-bold text-xs underline";
  return "text-gray-400 text-xs";
}

function statusBadgeClass(status) {
  return {
    DRAFT: "bg-gray-100 text-gray-700",
    SENT: "bg-blue-100 text-blue-700",
    PAID: "bg-green-100 text-green-700",
  }[status] || "bg-gray-100 text-gray-700";
}

// ---------- Loaders ----------
const loadPayrollPeriods = async () => {
  try {
    loading.value = true;
    const response = await payrollStore.getPayrollPeriods();
    payrollPeriods.value = response.data.data.items ?? [];

    if (payrollPeriods.value.length > 0) {
      selectedPayroll.value = payrollPeriods.value[0];
      pagination.pageNo = 1;
      await loadPayslips();
    }
  } catch (e) {
    console.error(e);
    alert("Failed to load payroll periods.");
  } finally {
    loading.value = false;
  }
};

const loadPayslips = async () => {
  if (!selectedPayroll.value) return;

  try {
    loading.value = true;

    const response = await payrollStore.getPayslips(selectedPayroll.value.id, {
      page: pagination.pageNo -1,
      size: pagination.pageSize,
      status: statusFilter.value || null,
    });

    const data = response.data.data;
    payslips.value = data.items ?? [];
    pagination.pageNo = data.pageNo + 1;
    pagination.pageSize = data.pageSize;
    pagination.totalPages = data.totalPages;
    pagination.totalElements = data.totalElements;
  } catch (e) {
    console.error(e);
    alert("Failed to load payslips.");
  } finally {
    loading.value = false;
  }
};

const onPeriodChange = async () => {
  pagination.pageNo = 1;
  statusFilter.value = "";
  search.value = "";
  await loadPayslips();
};

const onFilterChange = async () => {
  pagination.pageNo = 1;
  await loadPayslips();
};

const handlePageChange = async (page) => {
  pagination.pageNo = page;
  await loadPayslips();
};

const filteredPayslips = computed(() => {
  if (!search.value) return payslips.value;
  return payslips.value.filter((item) =>
      item.employeeName?.toLowerCase().includes(search.value.toLowerCase())
  );
});

// ---------- Actions ----------
const calculatePayroll = () => {
  openConfirm(
      "Calculate Payroll",
      "Recalculate payroll for this period?",
      "This action will overwrite all current DRAFT payslips.",
      "Calculate",
      async () => {
        try {
          const res = await payrollStore.calculatePayroll(selectedPayroll.value.id);

          triggerToast(
              res.data.message || "Payroll calculated successfully."
          );

          await loadPayslips();
        } catch (e) {
          triggerToast(
              e.response?.data?.message ||
              "Failed to calculate payroll.",
              "error"
          );
        }
      }
  );
};

const approvePayroll = () => {
  openConfirm(
      "Approve Payroll",
      "Approve this payroll period?",
      "After approval, all payslips will be locked and employees will receive notifications.",
      "Approve",
      async () => {
        try {
          await payrollStore.approvePayroll(selectedPayroll.value.id);

          triggerToast("Payroll approved successfully.");

          await loadPayrollPeriods();
        } catch (e) {
          triggerToast(
              e.response?.data?.message ||
              "Failed to approve payroll.",
              "error"
          );
        }
      }
  );
};

const payPayroll = () => {
  openConfirm(
      "Pay Salary",
      "Confirm salary payment?",
      "Payment date will be recorded and this action cannot be undone.",
      "Pay Salary",
      async () => {
        try {
          await payrollStore.payPayroll(selectedPayroll.value.id);

          triggerToast("Salary payment completed.");

          await loadPayrollPeriods();
        } catch (e) {
          triggerToast(
              e.response?.data?.message ||
              "Failed to pay salary.",
              "error"
          );
        }
      }
  );
};

function openEdit(employee) {
  if (!canEditPayslip.value) return;
  selectedEmployee.value = employee;
  otherBonus.value = employee.otherBonuses || 0;
  otherDeduction.value = employee.otherDeductions || 0;
  note.value = employee.note || "";
  showModal.value = true;
}

const savePayslip = async () => {
  try {
    await payrollStore.updatePayslip(selectedEmployee.value.id, {
      otherBonuses: otherBonus.value,
      otherDeductions: otherDeduction.value,
      note: note.value,
    });

    showModal.value = false;
    await loadPayslips();
  } catch (e) {
    console.error(e);
    triggerToast(
        e.response?.data?.message ||
        "Failed to update payslip.",
        "error"
    );
  }
};

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(value || 0) + " ₫";
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US");
}

// details
function openDetail(employee) {
  detailPayslip.value = employee;
  showDetail.value = true;
}

// toast
const toast = reactive({
  show: false,
  message: "",
  type: "success",
});

const triggerToast = (message, type = "success") => {
  toast.message = message;
  toast.type = type;
  toast.show = true;

  setTimeout(() => {
    toast.show = false;
  }, 3000);
};

const openConfirm = (
    title,
    message,
    subMessage,
    button,
    action
) => {
  actionModal.title = title;
  actionModal.message = message;
  actionModal.subMessage = subMessage;
  actionModal.button = button;
  actionModal.action = action;

  actionModal.show = true;
};
const confirmAction = async () => {
  actionModal.show = false;

  if (actionModal.action) {
    await actionModal.action();
  }
};

onMounted(async () => {
  await loadPayrollPeriods();
});
</script>