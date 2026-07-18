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
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-6 py-4">Pay Period</th>
            <th class="text-left px-6 py-4">Work Days</th>
            <th class="text-left px-6 py-4">Gross</th>
            <th class="text-left px-6 py-4">Deductions</th>
            <th class="text-left px-6 py-4">Net</th>
            <th class="text-left px-6 py-4">Status</th>
            <th class="text-right px-6 py-4">Details</th>
          </tr>
          </thead>

          <tbody>
          <tr v-if="loading">
            <td colspan="7" class="px-6 py-6 text-center text-gray-400">Loading...</td>
          </tr>
          <tr v-else-if="payslips.length === 0">
            <td colspan="7" class="px-6 py-6 text-center text-gray-400">No payslips found</td>
          </tr>
          <tr v-for="item in payslips" :key="item.id" class="border-t hover:bg-gray-50 cursor-pointer"
              @click="openDetail(item)">
            <td class="px-6 py-4">
              <p class="font-medium">{{ item.payrollPeriodName }}</p>
              <p class="text-xs text-gray-400">{{ item.month }}/{{ item.year }}</p>
            </td>
            <td class="px-6 py-4">{{ item.actualWorkDays }}/{{ item.standardWorkDays }} days</td>
            <td class="px-6 py-4">{{ formatCurrency(item.grossSalary) }}</td>
            <td class="px-6 py-4 text-red-500">-{{ formatCurrency(item.totalDeductions) }}</td>
            <td class="px-6 py-4 font-bold text-green-600">{{ formatCurrency(item.netSalary) }}</td>
            <td class="px-6 py-4">
              <span :class="statusBadgeClass(item.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ statusLabel(item.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button class="text-blue-600 hover:text-blue-700 font-medium" @click.stop="openDetail(item)">
                View
              </button>
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
            <button :disabled="currentPage === 0" @click="goToPage(currentPage - 1)"
                    class="px-3 py-1 border rounded disabled:opacity-40 disabled:cursor-not-allowed">
              Previous
            </button>
            <button v-for="p in totalPages" :key="p" @click="goToPage(p - 1)"
                    :class="currentPage === p - 1 ? 'bg-blue-600 text-white' : ''"
                    class="px-3 py-1 border rounded">
              {{ p }}
            </button>
            <button :disabled="currentPage >= totalPages - 1" @click="goToPage(currentPage + 1)"
                    class="px-3 py-1 border rounded disabled:opacity-40 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <div v-if="showDetail" @click.self="showDetail = false"
           class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto relative">
          <!-- Header -->
          <div class="flex justify-between items-center border-b px-8 py-5">
            <div>
              <h2 class="text-2xl font-bold">Payslip Detail</h2>
              <p class="text-gray-500 mt-1">{{ detailPayslip.payrollPeriodName }} ({{ detailPayslip.month }}/{{ detailPayslip.year }})</p>
            </div>
            <button @click="showDetail = false" class="text-gray-500 hover:text-red-500 text-2xl">✕</button>
          </div>

          <div class="p-8 space-y-8">
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
                  <td class="py-2 font-bold">Gross Salary</td>
                  <td class="py-2 text-right font-bold text-blue-600">
                    {{ formatCurrency(detailPayslip.grossSalary) }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- Deductions breakdown -->
            <div>
              <h3 class="font-semibold text-lg mb-4">Deductions</h3>
              <table class="w-full">
                <tbody>
                <tr class="border-b">
                  <td class="py-2">Social Insurance</td>
                  <td class="py-2 text-right text-red-500">
                    -{{ formatCurrency(detailPayslip.deductionSocialInsurance) }}
                  </td>
                </tr>
                <tr class="border-b">
                  <td class="py-2">Health Insurance</td>
                  <td class="py-2 text-right text-red-500">
                    -{{ formatCurrency(detailPayslip.deductionHealthInsurance) }}
                  </td>
                </tr>
                <tr class="border-b">
                  <td class="py-2">Unemployment Insurance</td>
                  <td class="py-2 text-right text-red-500">
                    -{{ formatCurrency(detailPayslip.deductionUnemploymentInsurance) }}
                  </td>
                </tr>
                <tr class="border-b">
                  <td class="py-2">Personal Income Tax</td>
                  <td class="py-2 text-right text-red-500">
                    -{{ formatCurrency(detailPayslip.personalIncomeTax) }}
                  </td>
                </tr>
                <tr class="border-b">
                  <td class="py-2">Other Deductions</td>
                  <td class="py-2 text-right text-red-500">
                    -{{ formatCurrency(detailPayslip.otherDeductions) }}
                  </td>
                </tr>
                <tr>
                  <td class="py-2 font-semibold">Total Deductions</td>
                  <td class="py-2 text-right font-semibold text-red-600">
                    -{{ formatCurrency(detailPayslip.totalDeductions) }}
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
  </MainContent>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import MainContent from "../components/MainContent.vue";
import { usePayrollStore } from "../store/payroll.js";

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
const currentPage = ref(0);
const pageSize = ref(10);
const totalElements = ref(0);
const totalPages = ref(0);

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
      page: currentPage.value,
      size: pageSize.value,
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

const onFilterChange = async () => {
  currentPage.value = 0;
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