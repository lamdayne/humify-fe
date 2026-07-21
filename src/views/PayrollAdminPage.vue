<template>
  <MainContent>
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Payroll Management</h1>
          <div class="flex items-center gap-3 mt-2">
            <span class="text-gray-600">{{ selectedPayroll?.name }}</span>
            <span class="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
              {{ selectedPayroll?.status }}
            </span>
            <span v-if="selectedPayroll?.status === 'PAID' && selectedPayroll?.paymentDate" class="text-sm text-gray-500">
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
      <div class="flex items-center gap-4">
        <label class="font-medium">Payroll Period</label>
        <select v-model="selectedPayroll" @change="onPeriodChange" class="border rounded-lg px-3 py-2">
          <option v-for="period in payrollPeriods" :key="period.id" :value="period">
            {{ period.name }}
          </option>
        </select>
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
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-6 py-4">Employee</th>
            <th class="text-left px-6 py-4">Gross Salary</th>
            <th class="text-left px-6 py-4">Net Salary</th>
            <th class="text-left px-6 py-4">Status</th>
            <th class="text-right px-6 py-4">Action</th>
          </tr>
          </thead>

          <tbody>
          <tr v-if="loading">
            <td colspan="5" class="px-6 py-6 text-center text-gray-400">Loading...</td>
          </tr>
          <tr v-else-if="filteredPayslips.length === 0">
            <td colspan="5" class="px-6 py-6 text-center text-gray-400">No data</td>
          </tr>
          <tr v-for="employee in filteredPayslips"
              :key="employee.id"
              class="border-t hover:bg-gray-50 cursor-pointer"
              @click="openDetail(employee)"   >
            <td class="px-6 py-4">{{ employee.employeeName }}</td>
            <td class="px-6 py-4">{{ formatCurrency(employee.grossSalary) }}</td>
            <td class="px-6 py-4">{{ formatCurrency(employee.netSalary) }}</td>
            <td class="px-6 py-4">
              <span :class="statusBadgeClass(employee.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ employee.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button
                  v-if="canEditPayslip"
                  class="text-blue-600 hover:text-blue-700 font-medium"
                  @click.stop="openEdit(employee)">
                Edit
              </button>
              <span v-else class="text-gray-400 text-sm">Locked</span>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex justify-between items-center px-6 py-4 border-t">
          <div class="text-sm text-gray-500">
            Showing {{ payslips.length ? currentPage * pageSize + 1 : 0 }}-{{
              Math.min((currentPage + 1) * pageSize, totalElements)
            }} of {{ totalElements }}
          </div>
          <div class="flex gap-2">
            <button
                :disabled="currentPage === 0"
                @click="goToPage(currentPage - 1)"
                class="px-3 py-1 border rounded disabled:opacity-40 disabled:cursor-not-allowed">
              Previous
            </button>
            <button
                v-for="p in totalPages"
                :key="p"
                @click="goToPage(p - 1)"
                :class="currentPage === p - 1 ? 'bg-blue-600 text-white' : ''"
                class="px-3 py-1 border rounded">
              {{ p }}
            </button>
            <button
                :disabled="currentPage >= totalPages - 1"
                @click="goToPage(currentPage + 1)"
                class="px-3 py-1 border rounded disabled:opacity-40 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>

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
        <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto relative">
          <!-- Header -->
          <div class="flex justify-between items-center border-b px-8 py-5">
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
          <div class="p-8 space-y-8">
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
  </MainContent>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import MainContent from "../components/MainContent.vue";
import { usePayrollStore } from "../store/payroll.js";

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
const currentPage = ref(0);
const pageSize = ref(10);
const totalElements = ref(0);
const totalPages = ref(0);

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
      currentPage.value = 0;
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
      page: currentPage.value,
      size: pageSize.value,
      status: statusFilter.value || null,
    });

    payslips.value = response.data.data.items ?? [];
    totalElements.value = response.data.data.totalElements ?? 0;
    totalPages.value = response.data.data.totalPages ?? 0;
  } catch (e) {
    console.error(e);
    alert("Failed to load payslips.");
  } finally {
    loading.value = false;
  }
};

const onPeriodChange = async () => {
  currentPage.value = 0;
  statusFilter.value = "";
  search.value = "";
  await loadPayslips();
};

const onFilterChange = async () => {
  currentPage.value = 0;
  await loadPayslips();
};

const goToPage = async (page) => {
  if (page < 0 || page >= totalPages.value) return;
  currentPage.value = page;
  await loadPayslips();
};

// ---------- Summary (current page only) ----------

const filteredPayslips = computed(() => {
  if (!search.value) return payslips.value;
  return payslips.value.filter((item) =>
      item.employeeName?.toLowerCase().includes(search.value.toLowerCase())
  );
});

// ---------- Actions ----------
const calculatePayroll = async () => {
  if (!confirm("Recalculating will overwrite all current DRAFT payslips. Continue?")) return;
  try {
    const res = await payrollStore.calculatePayroll(selectedPayroll.value.id);
    alert(res.data.message || "Payroll calculated successfully.");
    await loadPayslips();
  } catch (e) {
    console.error(e);
    alert(e.response?.data?.message || "An error occurred while calculating payroll.");
  }
};

const approvePayroll = async () => {
  if (!confirm("Once approved, the payroll will be locked for editing and notifications will be sent to all employees. Continue?")) return;
  try {
    await payrollStore.approvePayroll(selectedPayroll.value.id);
    await loadPayrollPeriods();
  } catch (e) {
    console.error(e);
    alert(e.response?.data?.message || "An error occurred while approving payroll.");
  }
};

const payPayroll = async () => {
  if (!confirm("Confirm salary payment? This will record the payment date and cannot be undone.")) return;
  try {
    await payrollStore.payPayroll(selectedPayroll.value.id);
    await loadPayrollPeriods();
  } catch (e) {
    console.error(e);
    alert(e.response?.data?.message || "An error occurred while confirming payment.");
  }
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
    alert(e.response?.data?.message || "An error occurred while saving the payslip.");
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

onMounted(async () => {
  await loadPayrollPeriods();
});
</script>