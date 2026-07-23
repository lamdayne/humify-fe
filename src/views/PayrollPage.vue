<template>
  <MainContent>
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Payslips</h1>
          <p class="text-gray-500 mt-1">View your approved and paid payslip history</p>
        </div>

        <div class="flex items-center gap-3 mt-4 lg:mt-0">
          <label class="font-medium text-sm">Year</label>
          <select v-model="selectedYear" @change="onFilterChange" class="border rounded-lg px-3 py-2">
            <option :value="null">All</option>
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
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
            <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Pay Period
            </th>

            <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Work Days
            </th>

            <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Gross Salary
            </th>

            <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Deductions
            </th>

            <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Net Salary
            </th>

            <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Status
            </th>

            <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-right">
              Action
            </th>
          </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
          <tr v-if="loading">
            <td colspan="7" class="px-6 py-6 text-center text-gray-400">Loading...</td>
          </tr>
          <tr v-else-if="payslips.length === 0">
            <td colspan="7" class="px-6 py-6 text-center text-gray-400">No payslips found</td>
          </tr>
          <tr
              v-for="item in payslips"
              :key="item.id"
              class="hover:bg-slate-50/40 transition-colors group cursor-pointer"
              @click="openDetail(item)"
          >
            <td class="py-5 px-6">
              <div class="font-bold text-slate-900 text-[15px] tracking-tight">
                {{ item.payrollPeriodName }}
              </div>

              <div class="text-xs text-slate-400 mt-1">
                {{ item.month }}/{{ item.year }}
              </div>
            </td>
            <td class="py-5 px-6 text-sm text-slate-600">
              {{ item.actualWorkDays }}/{{ item.standardWorkDays }}
            </td>
            <td class="py-5 px-6 text-sm text-slate-600">
              {{ formatCurrency(item.grossSalary) }}
            </td>
            <td class="py-5 px-6 text-sm text-red-500">
              -{{ formatCurrency(item.totalDeductions) }}
            </td>
            <td class="py-5 px-6 text-sm font-semibold text-green-600">
              {{ formatCurrency(item.netSalary) }}
            </td>
            <td class="py-5 px-6 text-xs md:text-sm whitespace-nowrap">
    <span
        :class="statusBadgeClass(item.status)"
        class="px-3 py-1 rounded-full text-xs font-medium"
    >
        {{ statusLabel(item.status) }}
    </span>
            </td>
            <td class="py-5 px-6 text-right">
              <button
                  class="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  @click.stop="openDetail(item)"
              >
                View
              </button>
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
      <!-- Detail Modal -->

      <div v-if="showDetail" @click.self="showDetail = false"
           class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
          <!-- Header -->
          <div class="flex justify-between items-center border-b px-8 py-5">
            <div>
              <h2 class="text-2xl font-bold">Payslip Detail</h2>
              <p class="text-gray-500 mt-1">{{ detailPayslip.payrollPeriodName }} ({{ detailPayslip.month }}/{{ detailPayslip.year }})</p>
            </div>
            <button @click="showDetail = false" class="text-gray-500 hover:text-red-500 text-2xl">✕</button>
          </div>

          <div
              class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto hide-scrollbar relative"
          >
          <div class="flex-1 overflow-y-auto no-scrollbar p-8">

            <!-- Status -->
            <div class="flex items-center gap-4">
              <span :class="statusBadgeClass(detailPayslip.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ statusLabel(detailPayslip.status) }}
              </span>
              <span v-if="detailPayslip.paymentDate" class="text-sm text-gray-500">
                Payment Date: {{ formatDate(detailPayslip.paymentDate) }}
              </span>
            </div>

            <!-- Attendance -->
            <div>
              <h3 class="font-semibold text-lg mb-4">Attendance</h3>
              <div class="grid grid-cols-4 gap-4">
                <div>
                  <p class="text-gray-500 text-sm">Standard Days</p>
                  <p class="font-medium">{{ detailPayslip.standardWorkDays }}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Actual Days</p>
                  <p class="font-medium">{{ detailPayslip.actualWorkDays }}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Paid Leave</p>
                  <p class="font-medium">{{ detailPayslip.paidLeaveDays }}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Unpaid Leave</p>
                  <p class="font-medium">{{ detailPayslip.unpaidLeaveDays }}</p>
                </div>
              </div>
            </div>

            <!-- Gross -->
            <div>
              <h3 class="font-semibold text-lg mb-4">Earnings</h3>
              <table class="w-full">
                <tbody>
                <tr>
                  <td class="py-2 font-bold">Gross base</td>
                  <td class="py-2 text-right font-bold text-blue-600">
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
                </tbody>
              </table>
            </div>

            <!-- Deductions breakdown -->
            <div>
              <h3 class="font-semibold text-lg font-bold mt-3">Deductions</h3>
              <table class="w-full">
                <tbody>
                <tr class="border-b">
                  <td >Social Insurance</td>
                  <td class="text-right text-red-500">
                    -{{ formatCurrency(detailPayslip.deductionSocialInsurance) }}
                  </td>
                </tr>
                <tr class="border-b">
                  <td >Health Insurance</td>
                  <td class="text-right text-red-500">
                    -{{ formatCurrency(detailPayslip.deductionHealthInsurance) }}
                  </td>
                </tr>
                <tr class="border-b">
                  <td >Unemployment Insurance</td>
                  <td class=" text-right text-red-500">
                    -{{ formatCurrency(detailPayslip.deductionUnemploymentInsurance) }}
                  </td>
                </tr>
                <tr class="border-b">
                  <td >Personal Income Tax</td>
                  <td class="text-right text-red-500">
                    -{{ formatCurrency(detailPayslip.personalIncomeTax) }}
                  </td>
                </tr>
                <tr class="border-b">
                  <td >Other Deductions</td>
                  <td class=" text-right text-red-500">
                    -{{ formatCurrency(detailPayslip.otherDeductions) }}
                  </td>
                </tr>
                <tr>
                  <td class="py-2 font-semibold">Total Deductions</td>
                  <td class="py-2 text-right font-semibold text-red-600">
                    -{{ formatCurrency(detailPayslip.totalDeductions) }}
                  </td>
                </tr>
                <tr>
                  <td class="py-2 font-bold">Gross Salary</td>
                  <td class="py-2 text-right font-bold text-blue-600">
                    {{ formatCurrency(detailPayslip.grossSalary) }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Net -->
            <div class="bg-green-50 rounded-xl p-5 flex justify-between items-center">
              <span class="font-bold text-lg">Net Salary</span>
              <span class="font-bold text-2xl text-green-600">
                {{ formatCurrency(detailPayslip.netSalary) }}
              </span>
            </div>

            <p class="text-xs text-gray-400">
              If you have any questions about this payslip, please contact HR for clarification.
            </p>
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
import PaginationSection from "../components/PaginationSection.vue";

const payrollStore = usePayrollStore();

const payslips = ref([]);
const loading = ref(false);

const selectedYear = ref(null);
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= currentYear - 5; y--) years.push(y);
  return years;
});

// Pagination
import { reactive } from "vue";

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  totalElements: 0,
  totalPages: 0,
});

// Detail modal
const showDetail = ref(false);
const detailPayslip = ref(null);

function statusLabel(status) {
  return { SENT: "Sent", PAID: "Paid" }[status] || status;
}

function statusBadgeClass(status) {
  return {
    SENT: "bg-blue-100 text-blue-700",
    PAID: "bg-green-100 text-green-700",
  }[status] || "bg-gray-100 text-gray-700";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(value || 0) + " ₫";
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US");
}

const loadMyPayslips = async () => {
  try {
    loading.value = true;

    const response = await payrollStore.getMyPayslips({
      year: selectedYear.value,
      page: pagination.pageNo - 1,
      size: pagination.pageSize,
    });

    const data = response.data.data;

    payslips.value = data.items ?? [];

    pagination.pageNo = data.pageNo + 1;
    pagination.pageSize = data.pageSize;
    pagination.totalPages = data.totalPages;
    pagination.totalElements = data.totalElements;
  } finally {
    loading.value = false;
  }
};

const onFilterChange = async () => {
  pagination.pageNo = 1;
  await loadMyPayslips();
};
const handlePageChange = async (page) => {
  pagination.pageNo = page;
  await loadMyPayslips();
};
const goToPage = async (page) => {
  if (page < 0 || page >= totalPages.value) return;
  currentPage.value = page;
  await loadMyPayslips();
};

function openDetail(item) {
  detailPayslip.value = item;
  showDetail.value = true;
}

onMounted(async () => {
  await loadMyPayslips();
});
</script>