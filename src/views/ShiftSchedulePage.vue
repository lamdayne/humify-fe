<template>
  <MainContent>
    <div class="p-6 md:p-8 max-w-7xl mx-auto text-slate-900 font-sans antialiased relative">
      <!-- Toast Notification -->
      <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show" />

      <!-- HEADER PANEL -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between justify-start gap-4 mb-6">
        <div>
          <h1 class="text-xl font-bold text-slate-900 tracking-tight">Employee Shift Matrix</h1>
          <p class="text-xs text-slate-400 mt-0.5 font-light">Manage and coordinate employee work schedules.</p>
        </div>

        <div class="flex items-center gap-2 self-start md:self-auto">
          <SecondaryButton content="Import Excel">
            <template #icon>
              <Upload class="w-3.5 h-3.5" />
            </template>
          </SecondaryButton>
          <button class="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xs cursor-pointer">
            <Sparkles class="w-3.5 h-3.5 text-amber-400" />
            AI Scheduling
          </button>
          <PrimaryButton content="Bulk Assignment" @click="openAssignModal(null, null)">
            <template #icon>
              <Plus class="w-3.5 h-3.5" />
            </template>
          </PrimaryButton>
        </div>
      </div>

      <!-- FILTER & NAVIGATION BAR -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-slate-200/90 p-4 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-6">
        <!-- Date Navigation -->
        <div class="flex items-center gap-3">
          <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
            <button @click="navigateWeek(-1)" class="p-2 hover:bg-slate-50 border-r border-slate-200 text-slate-500 cursor-pointer">
              <ChevronLeft class="w-4 h-4" />
            </button>
            <div class="px-4 py-1.5 text-xs font-semibold text-slate-700 flex items-center gap-2">
              <Calendar class="w-3.5 h-3.5 text-slate-400" />
              <span>{{ formatWeekLabel }}</span>
            </div>
            <button @click="navigateWeek(1)" class="p-2 hover:bg-slate-50 border-l border-slate-200 text-slate-500 cursor-pointer">
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
          <button @click="jumpToToday" class="px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white cursor-pointer shadow-2xs">
            Today
          </button>
        </div>

        <!-- Filters (Department, Branch) -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Department Filter -->
          <select v-model="selectedDept" class="border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none bg-white font-medium text-slate-600 focus:border-blue-500 shadow-2xs">
            <option :value="null">All Departments</option>
            <option v-for="d in departmentStore.departments" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>

          <!-- Branch Filter -->
          <select v-model="selectedBranch" class="border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none bg-white font-medium text-slate-600 focus:border-blue-500 shadow-2xs">
            <option :value="null">All Branches</option>
            <option v-for="b in branchStore.branches" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>

          <!-- Status Filter -->
          <select v-model="selectedStatus" class="border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none bg-white font-medium text-slate-600 focus:border-blue-500 shadow-2xs">
            <option value="ALL">Shift Status</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="OFF">Day Off (OFF)</option>
          </select>

          <!-- Week/Month Toggle -->
          <div class="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 shrink-0 ml-auto lg:ml-0">
            <button class="px-3 py-1 text-xs font-semibold rounded-md bg-white text-slate-800 shadow-2xs cursor-pointer">Week</button>
            <button class="px-3 py-1 text-xs font-medium rounded-md text-slate-400 hover:text-slate-600 cursor-not-allowed" disabled>Month</button>
          </div>
        </div>
      </div>

      <!-- MATRIX GRID TABLE -->
      <div class="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr class="bg-slate-50/70 border-b border-slate-200/80">
                <th class="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[250px] sticky left-0 bg-slate-50/70 z-10">
                  Employee
                </th>
                <th v-for="day in weekDays" :key="day.dateStr" class="py-4 px-4 text-center border-l border-slate-100 w-[110px]" :class="{ 'bg-blue-50/30': day.isToday }">
                  <div class="text-[10px] font-semibold uppercase tracking-wider" :class="day.isToday ? 'text-blue-600' : 'text-slate-400'">
                    {{ day.dayName }}
                  </div>
                  <div class="text-sm font-bold mt-0.5" :class="day.isToday ? 'text-blue-600 font-extrabold' : 'text-slate-800'">
                    {{ day.dayNum }}
                  </div>
                </th>
                <th class="py-4 px-6 text-center border-l border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-[100px]">
                  Total Hours
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="isLoading"><td colspan="9" class="py-20 text-center text-slate-400"><LoaderCircle class="w-8 h-8 animate-spin mx-auto text-slate-600" /></td></tr>
              <tr v-else-if="filteredEmployees.length === 0"><td colspan="9" class="py-12 text-center text-slate-400">No employee records found.</td></tr>
              <tr v-else v-for="emp in filteredEmployees" :key="emp.id" class="hover:bg-slate-50/30 group transition-colors">
                <!-- Employee Row Header -->
                <td class="py-4 px-6 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 flex items-center gap-3 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.01)]">
                  <div class="w-8 h-8 rounded-full border border-slate-200/80 overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center font-bold text-xs text-slate-600">
                    <img v-if="emp.avatarUrl" :src="emp.avatarUrl" class="w-full h-full object-cover" />
                    <span v-else>{{ emp.fullName.charAt(0) }}</span>
                  </div>
                  <div class="overflow-hidden">
                    <div class="font-bold text-sm text-slate-800 truncate">{{ emp.fullName }}</div>
                    <div class="text-[10px] text-slate-400 truncate font-light">{{ emp.employeeCode }} • {{ emp.positionName || 'Staff' }}</div>
                  </div>
                </td>

                <!-- Week Cells -->
                <td v-for="day in weekDays" :key="day.dateStr" class="py-4 px-2 border-l border-slate-100 text-center align-middle relative group/cell" :class="{ 'bg-blue-50/10': day.isToday }">
                  <!-- Case 1: Shift Assigned -->
                  <div v-if="getCellShift(emp.id, day.dateStr)" class="mx-auto select-none">
                    <div @click="openAssignModal(emp, getCellShift(emp.id, day.dateStr))" 
                         class="cursor-pointer hover:scale-105 transition-transform inline-flex flex-col justify-center items-center px-2.5 py-1 rounded-md text-[11px] font-semibold shadow-2xs max-w-[95px] truncate"
                         :style="getShiftStyle(getCellShift(emp.id, day.dateStr))">
                      <span>{{ formatShiftTime(getCellShift(emp.id, day.dateStr).workShift) }}</span>
                    </div>
                  </div>

                  <!-- Case 2: Leave Request -->
                  <div v-else-if="getCellLeave(emp.id, day.dateStr)" class="mx-auto">
                    <span class="inline-block px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-md text-[10px] font-bold tracking-tight">
                      ON LEAVE
                    </span>
                  </div>

                  <!-- Case 3: Weekend (OFF) -->
                  <div v-else-if="day.isWeekend" class="mx-auto text-[10px] font-semibold text-slate-300">
                    OFF
                  </div>

                  <!-- Case 4: Normal Empty Cell (OFF or Quick-Add) -->
                  <div v-else class="relative h-6 flex items-center justify-center">
                    <span class="text-[10px] font-medium text-slate-200 group-hover/cell:opacity-0 transition-opacity">OFF</span>
                    <button @click="openAssignModal(emp, null, day.dateStr)" 
                            class="absolute opacity-0 group-hover/cell:opacity-100 p-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 rounded-full transition-all cursor-pointer shadow-2xs">
                      <Plus class="w-3 h-3" />
                    </button>
                  </div>
                </td>

                <!-- Total Hours Column -->
                <td class="py-4 px-6 text-center border-l border-slate-100 font-extrabold text-sm text-slate-700">
                  {{ calculateTotalHours(emp.id) }}h
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- BULK / SINGLE ASSIGN SHIFT MODAL -->
      <ModalGeneric v-model="shiftModal.show" :title="shiftModal.id ? 'Update Shift Assignment' : 'Bulk Shift Assignment'" width="500px">
        <div class="space-y-5 text-xs text-slate-600">
          
          <!-- STEP 1: EMPLOYEE SELECTION -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 font-bold text-slate-800 uppercase tracking-wider">
              <span class="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">1</span>
              <span>Employee Selection</span>
            </div>
            
            <div v-if="!shiftModal.id" class="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <!-- Search Bar -->
              <div class="relative">
                <Search class="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input type="text" v-model="employeeSearchTerm" placeholder="Search employees..." 
                       class="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
              </div>
              
              <!-- Scrollable list of checkboxes -->
              <div class="max-h-40 overflow-y-auto border border-slate-200 rounded-lg bg-white divide-y divide-slate-100 p-1">
                <label v-for="emp in searchedEmployees" :key="emp.id" class="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md cursor-pointer transition-colors">
                  <input type="checkbox" :value="emp.id" v-model="selectedEmployees" class="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 accent-blue-600" />
                  <div class="w-7 h-7 rounded-full border border-slate-200 overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center font-bold text-[10px] text-slate-500">
                    <img v-if="emp.avatarUrl" :src="emp.avatarUrl" class="w-full h-full object-cover" />
                    <span v-else>{{ emp.fullName.charAt(0) }}</span>
                  </div>
                  <div>
                    <div class="font-semibold text-slate-800">{{ emp.fullName }}</div>
                    <div class="text-[10px] text-slate-400 font-light">{{ emp.employeeCode }} • {{ emp.department?.name || 'No Dept' }}</div>
                  </div>
                </label>
              </div>
              
              <!-- Selection control footer -->
              <div class="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1 font-medium">
                <span>{{ selectedEmployees.length }} selected</span>
                <div class="flex gap-3">
                  <button @click="selectAllEmployees" class="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">Select all</button>
                  <button @click="clearAllEmployees" class="text-slate-500 hover:text-slate-700 font-semibold cursor-pointer">Clear all</button>
                </div>
              </div>
            </div>

            <!-- Single employee mode (When editing) -->
            <div v-else class="flex items-center gap-3 border border-slate-200 rounded-xl p-3 bg-slate-50">
              <div class="w-8 h-8 rounded-full border border-slate-200 overflow-hidden bg-white shrink-0 flex items-center justify-center font-bold text-xs text-slate-600">
                <img v-if="editingEmployee?.avatarUrl" :src="editingEmployee.avatarUrl" class="w-full h-full object-cover" />
                <span v-else-if="editingEmployee">{{ editingEmployee.fullName.charAt(0) }}</span>
              </div>
              <div>
                <div class="font-bold text-sm text-slate-800">{{ editingEmployee?.fullName }}</div>
                <div class="text-[10px] text-slate-400">{{ editingEmployee?.employeeCode }} • {{ editingEmployee?.positionName || 'Staff' }}</div>
              </div>
            </div>
          </div>

          <!-- STEP 2: DATE RANGE & PATTERNS -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 font-bold text-slate-800 uppercase tracking-wider">
              <span class="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">2</span>
              <span>Date Range & Patterns</span>
            </div>
            <div class="grid grid-cols-2 gap-4 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From Date <span class="text-red-500">*</span></label>
                <input type="date" v-model="shiftModal.startDate" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none bg-white mt-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">To Date</label>
                <input type="date" v-model="shiftModal.endDate" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none bg-white mt-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" />
              </div>
            </div>
          </div>

          <!-- STEP 3: SHIFT SELECTION -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 font-bold text-slate-800 uppercase tracking-wider">
              <span class="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">3</span>
              <span>Shift Selection</span>
            </div>
            <div class="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <select v-model="shiftModal.workShiftId" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20">
                <option v-if="workShifts.length === 0" value="" disabled>No work shifts available. Create one first!</option>
                <option v-for="ws in workShifts" :key="ws.id" :value="ws.id">
                  {{ ws.name }} ({{ formatShiftTimeSingle(ws) }})
                </option>
              </select>
            </div>
          </div>

          <!-- CONFLICTS DISPLAY -->
          <div v-if="conflicts.length > 0" class="border border-red-200 bg-red-50/40 rounded-xl p-3 space-y-2">
            <div class="flex items-center gap-2 text-red-600 font-bold">
              <AlertTriangle class="w-4 h-4 shrink-0" />
              <span>{{ conflicts.length }} Conflicts Detected</span>
            </div>
            <ul class="list-disc list-inside text-[11px] text-red-600/90 space-y-1 font-light pl-1 leading-relaxed">
              <li v-for="(conflict, idx) in conflicts" :key="idx">{{ conflict }}</li>
            </ul>
          </div>

        </div>

        <template #footer>
          <div class="flex gap-2 w-full justify-end">
            <button v-if="shiftModal.id" @click="handleDelete" class="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold mr-auto cursor-pointer">
              Delete
            </button>
            <SecondaryButton content="Cancel" @click="shiftModal.show = false" />
            <PrimaryButton :content="shiftModal.id ? 'Save Changes' : 'Apply Assignment'" @click="handleSubmit" />
          </div>
        </template>
      </ModalGeneric>
    </div>
  </MainContent>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import MainContent from '../components/MainContent.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import ToastMessage from '../components/ToastMessage.vue';
import ModalGeneric from '../components/ModalGeneric.vue';

import { useEmployeeStore } from '../store/employeeStore';
import { useWorkShiftStore } from '../store/workShiftStore';
import { useEmployeeShiftStore } from '../store/employeeShiftStore';
import { useDepartmentStore } from '../store/departmentStore';
import { useBranchStore } from '../store/branchStore';
import { useAttendanceStore } from '../store/attendanceStore';

import { storeToRefs } from 'pinia';
import { Plus, ChevronLeft, ChevronRight, Calendar, Sparkles, Upload, LoaderCircle, Search, AlertTriangle } from '@lucide/vue';

const employeeStore = useEmployeeStore();
const workShiftStore = useWorkShiftStore();
const employeeShiftStore = useEmployeeShiftStore();
const departmentStore = useDepartmentStore();
const branchStore = useBranchStore();
const attendanceStore = useAttendanceStore();

const { workShifts } = storeToRefs(workShiftStore);

const isLoading = ref(false);
const currentDate = ref(new Date());

const selectedDept = ref(null);
const selectedBranch = ref(null);
const selectedStatus = ref('ALL');

const employeeShiftsList = ref([]);
const leaveRequestsList = ref([]);

const selectedEmployees = ref([]);
const employeeSearchTerm = ref('');

const toast = reactive({ show: false, message: '', type: 'success' });
const triggerToast = (msg, type = 'success') => {
  toast.message = msg; toast.type = type; toast.show = true;
  setTimeout(() => { toast.show = false; }, 3500);
};

// FILTERED EMPLOYEES
const filteredEmployees = computed(() => {
  let list = employeeStore.employees || [];
  if (selectedDept.value) {
    list = list.filter(e => e.departmentId === selectedDept.value);
  }
  if (selectedBranch.value) {
    list = list.filter(e => e.branchId === selectedBranch.value);
  }
  return list;
});

// SEARCH EMPLOYEES INSIDE MODAL
const searchedEmployees = computed(() => {
  const term = employeeSearchTerm.value.toLowerCase().trim();
  const list = employeeStore.employees || [];
  if (!term) return list;
  return list.filter(e => 
    (e.fullName || '').toLowerCase().includes(term) ||
    (e.employeeCode || '').toLowerCase().includes(term)
  );
});

const editingEmployee = computed(() => {
  if (!shiftModal.id || !shiftModal.employeeId) return null;
  return employeeStore.employees.find(e => e.id === shiftModal.employeeId);
});

const selectAllEmployees = () => {
  selectedEmployees.value = searchedEmployees.value.map(e => e.id);
};

const clearAllEmployees = () => {
  selectedEmployees.value = [];
};

// GENERATE 7 DAYS OF THE WEEK
const weekDays = computed(() => {
  const day = currentDate.value.getDay();
  // Monday is 1, Sunday is 0. Shift start of week to Monday
  const diff = currentDate.value.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(currentDate.value);
  monday.setDate(diff);

  const days = [];
  const englishDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayStr = new Date().toISOString().split('T')[0];

  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    const dateStr = nextDay.toISOString().split('T')[0];
    const isWeekend = nextDay.getDay() === 0 || nextDay.getDay() === 6; // Sunday = 0, Saturday = 6

    days.push({
      dateStr,
      dayName: englishDayNames[i],
      dayNum: nextDay.getDate(),
      isToday: dateStr === todayStr,
      isWeekend
    });
  }
  return days;
});

const formatWeekLabel = computed(() => {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = monthNames[currentDate.value.getMonth()];
  const year = currentDate.value.getFullYear();
  return `${month} ${year}`;
});

const navigateWeek = (weeks) => {
  const newDate = new Date(currentDate.value);
  newDate.setDate(currentDate.value.getDate() + weeks * 7);
  currentDate.value = newDate;
};

const jumpToToday = () => {
  currentDate.value = new Date();
};

// LOAD ALL SCHEDULING DATA
const loadData = async () => {
  isLoading.value = true;
  try {
    await employeeStore.fetchEmployees(0, 100);
    await workShiftStore.fetchWorkShifts(0, 100);
    await departmentStore.fetchDepartments();
    await branchStore.fetchBranches();

    // Fetch shift assignments
    const shiftRes = await employeeShiftStore.fetchEmployeeShifts(0, 1000);
    employeeShiftsList.value = shiftRes?.data?.items || shiftRes?.data || [];

    // Fetch leave requests for LEAVE checking
    const leaveRes = await attendanceStore.fetchLeaveRequests(0, 1000);
    leaveRequestsList.value = leaveRes?.data?.items || leaveRes?.items || leaveRes?.data || [];
  } catch (err) {
    console.error("Load shifts matrix data error:", err);
  } finally {
    isLoading.value = false;
  }
};

// CELLS MATCHING LOGIC
const getCellShift = (employeeId, dateStr) => {
  const current = new Date(dateStr);
  return employeeShiftsList.value.find(es => {
    if (es.employee?.id !== employeeId) return false;
    const start = new Date(es.startDate);
    const end = es.endDate ? new Date(es.endDate) : null;
    return start <= current && (!end || end >= current);
  });
};

const getCellLeave = (employeeId, dateStr) => {
  const currentStr = dateStr;
  return leaveRequestsList.value.find(lr => {
    if (lr.employeeId !== employeeId && lr.employee?.id !== employeeId) return false;
    if (lr.status !== 'APPROVED') return false;
    return lr.startDate <= currentStr && lr.endDate >= currentStr;
  });
};

const calculateTotalHours = (employeeId) => {
  let total = 0;
  weekDays.value.forEach(day => {
    const shiftAssign = getCellShift(employeeId, day.dateStr);
    const leave = getCellLeave(employeeId, day.dateStr);
    if (shiftAssign && !leave) {
      const start = new Date(shiftAssign.workShift.startTime);
      const end = new Date(shiftAssign.workShift.endTime);
      let diff = (end - start) / (1000 * 60 * 60); // hours
      // Subtract break hours if exists
      if (shiftAssign.workShift.breakStartTime && shiftAssign.workShift.breakEndTime) {
        const breakStart = new Date(shiftAssign.workShift.breakStartTime);
        const breakEnd = new Date(shiftAssign.workShift.breakEndTime);
        diff -= (breakEnd - breakStart) / (1000 * 60 * 60);
      }
      total += Math.max(0, diff);
    }
  });
  return Math.round(total);
};

const formatShiftTime = (workShift) => {
  if (!workShift || !workShift.startTime || !workShift.endTime) return '—';
  const fmt = (isoStr) => new Date(isoStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${fmt(workShift.startTime)} - ${fmt(workShift.endTime)}`;
};

const formatShiftTimeSingle = (ws) => {
  if (!ws || !ws.startTime || !ws.endTime) return '';
  const fmt = (isoStr) => new Date(isoStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${fmt(ws.startTime)} - ${fmt(ws.endTime)}`;
};

const getShiftStyle = (employeeShift) => {
  const code = (employeeShift.workShift?.shiftCode || '').toUpperCase();
  if (code.includes('HC') || code.includes('OFFICE') || code.includes('DAY') || code.includes('SANG')) {
    return 'background-color: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe;'; // Light Blue
  }
  if (code.includes('CHIEU') || code.includes('EVENING') || code.includes('SAL')) {
    return 'background-color: #f8fafc; color: #334155; border: 1px solid #e2e8f0;'; // Light Gray border
  }
  if (code.includes('TOI') || code.includes('NIGHT') || code.includes('HE')) {
    return 'background-color: #1e293b; color: #f8fafc; border: 1px solid #334155;'; // Dark / Black
  }
  return 'background-color: #f0fdf4; color: #166534; border: 1px solid #bbf7d0;'; // Default Light Green
};

// CONFLICT DETECTION
const conflicts = computed(() => {
  if (!shiftModal.startDate || selectedEmployees.value.length === 0) return [];
  const list = [];
  const selStart = new Date(shiftModal.startDate);
  const selEnd = shiftModal.endDate ? new Date(shiftModal.endDate) : null;

  selectedEmployees.value.forEach(empId => {
    const emp = employeeStore.employees.find(e => e.id === empId);
    if (!emp) return;

    // Check Leave conflicts
    const leaveOverlap = leaveRequestsList.value.find(lr => {
      const lrEmpId = lr.employeeId || lr.employee?.id;
      if (lrEmpId !== empId) return false;
      if (lr.status !== 'APPROVED') return false;
      const start = new Date(lr.startDate);
      const end = new Date(lr.endDate);
      return start <= (selEnd || new Date("9999-12-31")) && (selStart <= end);
    });
    if (leaveOverlap) {
      list.push(`${emp.fullName} has approved leave from ${leaveOverlap.startDate} to ${leaveOverlap.endDate}.`);
    }

    // Check overlapping shift assignments
    const shiftOverlap = employeeShiftsList.value.find(es => {
      if (es.employee?.id !== empId) return false;
      if (shiftModal.id && es.id === shiftModal.id) return false;
      const start = new Date(es.startDate);
      const end = es.endDate ? new Date(es.endDate) : null;
      return start <= (selEnd || new Date("9999-12-31")) && (end === null || selStart <= end);
    });
    if (shiftOverlap) {
      list.push(`${emp.fullName} has an overlapping shift "${shiftOverlap.workShift?.name}" from ${shiftOverlap.startDate} to ${shiftOverlap.endDate || 'Ongoing'}.`);
    }
  });
  return list;
});

// MODAL CONTROLLER
const shiftModal = reactive({
  show: false,
  id: null,
  employeeId: null,
  workShiftId: null,
  startDate: '',
  endDate: ''
});

const openAssignModal = async (employee = null, employeeShift = null, dateStr = null) => {
  try {
    await workShiftStore.fetchWorkShifts(0, 100);
    await employeeStore.fetchEmployees(0, 100);

    employeeSearchTerm.value = '';

    if (employeeShift) {
      shiftModal.id = employeeShift.id;
      shiftModal.employeeId = employeeShift.employee?.id;
      shiftModal.workShiftId = employeeShift.workShift?.id;
      shiftModal.startDate = employeeShift.startDate;
      shiftModal.endDate = employeeShift.endDate || '';
      selectedEmployees.value = [employeeShift.employee?.id];
    } else {
      shiftModal.id = null;
      shiftModal.employeeId = null;
      shiftModal.workShiftId = workShifts.value?.[0]?.id || null;
      shiftModal.startDate = dateStr || new Date().toISOString().split('T')[0];
      shiftModal.endDate = '';
      selectedEmployees.value = employee ? [employee.id] : [];
    }
    shiftModal.show = true;
  } catch (err) {
    triggerToast("Failed to load shift assignment data.", "error");
  }
};

const handleSubmit = async () => {
  if (shiftModal.id) {
    if (!shiftModal.workShiftId || !shiftModal.startDate) {
      triggerToast("Please enter all required fields.", "error");
      return;
    }
    const payload = {
      workShiftId: Number(shiftModal.workShiftId),
      startDate: shiftModal.startDate,
      endDate: shiftModal.endDate || null
    };
    try {
      await employeeShiftStore.updateEmployeeShift(shiftModal.id, payload);
      triggerToast("Shift assignment updated successfully!", "success");
      shiftModal.show = false;
      await loadData();
    } catch (err) {
      triggerToast(err.response?.data?.message || "Failed to update shift due to schedule overlap.", "error");
    }
  } else {
    if (selectedEmployees.value.length === 0 || !shiftModal.workShiftId || !shiftModal.startDate) {
      triggerToast("Please select employees and enter all required fields.", "error");
      return;
    }
    
    let successCount = 0;
    let failCount = 0;
    let firstErrorMsg = "";
    
    for (const empId of selectedEmployees.value) {
      const payload = {
        employeeId: Number(empId),
        workShiftId: Number(shiftModal.workShiftId),
        startDate: shiftModal.startDate,
        endDate: shiftModal.endDate || null
      };
      try {
        await employeeShiftStore.assignShift(payload);
        successCount++;
      } catch (err) {
        failCount++;
        if (!firstErrorMsg) {
          firstErrorMsg = err.response?.data?.message || "Overlap detected.";
        }
      }
    }
    
    if (successCount > 0) {
      triggerToast(`Successfully assigned shifts to ${successCount} employees.`, "success");
    }
    if (failCount > 0) {
      triggerToast(`Failed for ${failCount} employees: ${firstErrorMsg}`, "error");
    }
    
    shiftModal.show = false;
    await loadData();
  }
};

const handleDelete = async () => {
  if (!shiftModal.id) return;
  if (!confirm("Are you sure you want to delete this shift assignment?")) return;
  try {
    await employeeShiftStore.deleteEmployeeShift(shiftModal.id);
    triggerToast("Shift assignment deleted successfully!", "success");
    shiftModal.show = false;
    await loadData();
  } catch (err) {
    triggerToast("Failed to delete shift assignment.", "error");
  }
};

watch(currentDate, () => {
  loadData();
});

onMounted(() => {
  loadData();
});
</script>
