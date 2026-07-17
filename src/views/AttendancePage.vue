<template>
  <MainContent>
    <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans text-slate-900 relative">
      <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show" />

      <!-- BANNER CHECK-IN / CHECK-OUT NHANH -->
      <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 mb-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-1 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-2">
            <Clock class="w-5 h-5 text-emerald-400" />
            <h2 class="text-xl font-semibold tracking-tight">Daily Time Attendance</h2>
          </div>
          <p class="text-xs text-slate-400 font-light">
            Today: <span class="font-medium text-slate-200">{{ currentDateFormatted }}</span>
            <span v-if="todayStatusText" class="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-emerald-300">
              {{ todayStatusText }}
            </span>
          </p>
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <!-- NÚT CHECK IN -->
          <button @click="handleWebSwipe('CHECK_IN')"
                  :disabled="isSwiping || isAlreadyCheckedIn || isCompletedToday"
                  :class="[
                    isAlreadyCheckedIn || isCompletedToday ? 'bg-slate-700 opacity-50 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95 cursor-pointer',
                    'flex-1 md:flex-none px-6 py-2.5 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2'
                  ]">
            <LogIn class="w-4 h-4" />
            <span>{{ isAlreadyCheckedIn ? 'Checked In' : 'Check In' }}</span>
          </button>

          <!-- NÚT CHECK OUT -->
          <button @click="handleWebSwipe('CHECK_OUT')"
                  :disabled="isSwiping || !isAlreadyCheckedIn || isCompletedToday"
                  :class="[
                    !isAlreadyCheckedIn || isCompletedToday ? 'bg-slate-700 opacity-50 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600 active:scale-95 cursor-pointer',
                    'flex-1 md:flex-none px-6 py-2.5 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2'
                  ]">
            <LogOut class="w-4 h-4" />
            <span>{{ isCompletedToday ? 'Checked Out' : 'Check Out' }}</span>
          </button>

          <button @click="openLeaveModal"
                  class="flex-1 md:flex-none px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all cursor-pointer">
            + Request Leave
          </button>
        </div>
      </div>

      <!-- HEADER & TAB NAVIGATION -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">Attendance & Leave</h1>
          <p class="text-xs text-slate-400 font-light mt-1">Track daily attendance, requests, and approvals.</p>
        </div>

        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          <button @click="activeTab = 'my-attendance'"
                  :class="[activeTab === 'my-attendance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900', 'px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap']">
            My Attendance
          </button>

          <button @click="activeTab = 'my-corrections'"
                  :class="[activeTab === 'my-corrections' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900', 'px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap']">
            My Corrections
          </button>

          <!-- CHỈ HR / ADMIN MỚI THẤY CÁC TAB NÀY -->
          <template v-if="isHR">
            <button @click="activeTab = 'hr-attendance'"
                    :class="[activeTab === 'hr-attendance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900', 'px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap']">
              HR Management
            </button>
            <button @click="activeTab = 'hr-corrections'"
                    :class="[activeTab === 'hr-corrections' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900', 'px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap']">
              Corrections Approval
            </button>
          </template>
        </div>
      </div>

      <!-- TAB 1: MY ATTENDANCE -->
      <div v-if="activeTab === 'my-attendance'" class="space-y-6">
        <div class="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-sm">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="bg-slate-50/70 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              <th class="py-4 px-6">Work Date</th>
              <th class="py-4 px-6">Check In</th>
              <th class="py-4 px-6">Check Out</th>
              <th class="py-4 px-6 text-center">Worked Hours</th>
              <th class="py-4 px-6 text-center">Status</th>
              <th class="py-4 px-6 text-right">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
            <tr v-if="isLoading"><td colspan="6" class="py-12 text-center text-slate-400">Loading attendance records...</td></tr>
            <tr v-else-if="myAttendances.length === 0"><td colspan="6" class="py-12 text-center text-slate-400">No attendance records found.</td></tr>
            <tr v-else v-for="item in myAttendances" :key="item.id" class="hover:bg-slate-50/50">
              <td class="py-4 px-6 font-medium text-slate-900">{{ item.workDate }}</td>
              <td class="py-4 px-6 font-mono text-xs text-slate-600">{{ formatTime(item.checkInTime) }}</td>
              <td class="py-4 px-6 font-mono text-xs text-slate-600">{{ formatTime(item.checkOutTime) }}</td>
              <td class="py-4 px-6 text-center font-mono text-xs font-semibold">{{ item.workedHours }}h</td>
              <td class="py-4 px-6 text-center"><StatusBadge :content="item.status" :type="item.status" /></td>
              <td class="py-4 px-6 text-right">
                <button @click="openCorrectionModal(item)" class="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">
                  Request Correction
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: MY CORRECTIONS -->
      <div v-if="activeTab === 'my-corrections'" class="space-y-6">
        <div class="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-sm">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="bg-slate-50/70 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              <th class="py-4 px-6">Work Date</th>
              <th class="py-4 px-6">Requested In / Out</th>
              <th class="py-4 px-6">Reason</th>
              <th class="py-4 px-6 text-center">Status</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
            <tr v-if="myCorrections.length === 0"><td colspan="4" class="py-12 text-center text-slate-400">No correction requests found.</td></tr>
            <tr v-else v-for="item in myCorrections" :key="item.id" class="hover:bg-slate-50/50">
              <td class="py-4 px-6 font-medium text-slate-900">{{ item.workDate || item.correctionDate }}</td>
              <td class="py-4 px-6 font-mono text-xs text-slate-600">
                {{ formatTime(item.requestedCheckIn) }} – {{ formatTime(item.requestedCheckOut) }}
              </td>
              <td class="py-4 px-6 text-xs text-slate-500 max-w-xs truncate">{{ item.reason }}</td>
              <td class="py-4 px-6 text-center"><StatusBadge :content="item.status" :type="item.status" /></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: HR MANAGEMENT -->
      <div v-if="activeTab === 'hr-attendance' && isHR" class="space-y-6">
        <div class="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-sm">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="bg-slate-50/70 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              <th class="py-4 px-6">Employee</th>
              <th class="py-4 px-6">Work Date</th>
              <th class="py-4 px-6">Check In / Out</th>
              <th class="py-4 px-6 text-center">Worked Hours</th>
              <th class="py-4 px-6 text-center">Status</th>
              <th class="py-4 px-6 text-right">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
            <tr v-if="isLoading"><td colspan="6" class="py-12 text-center text-slate-400">Loading HR Records...</td></tr>
            <tr v-else v-for="item in hrAttendances" :key="item.id" class="hover:bg-slate-50/50">
              <td class="py-4 px-6">
                <div class="font-semibold text-slate-900">{{ item.employeeName }}</div>
                <div class="text-xs font-mono text-slate-400">{{ item.employeeCode }}</div>
              </td>
              <td class="py-4 px-6 font-medium text-slate-800">{{ item.workDate }}</td>
              <td class="py-4 px-6 font-mono text-xs text-slate-600">
                {{ formatTime(item.checkInTime) }} – {{ formatTime(item.checkOutTime) }}
              </td>
              <td class="py-4 px-6 text-center font-mono text-xs font-semibold">{{ item.workedHours }}h</td>
              <td class="py-4 px-6 text-center"><StatusBadge :content="item.status" :type="item.status" /></td>
              <td class="py-4 px-6 text-right">
                <button @click="openManualUpdateModal(item)" class="text-xs text-slate-600 hover:text-black font-semibold border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                  Edit
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: CORRECTIONS APPROVAL -->
      <div v-if="activeTab === 'hr-corrections' && isHR" class="space-y-6">
        <div class="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-sm">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="bg-slate-50/70 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              <th class="py-4 px-6">Employee</th>
              <th class="py-4 px-6">Work Date</th>
              <th class="py-4 px-6">Requested In / Out</th>
              <th class="py-4 px-6">Reason</th>
              <th class="py-4 px-6 text-center">Status</th>
              <th class="py-4 px-6 text-right">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
            <tr v-if="isLoading"><td colspan="6" class="py-12 text-center text-slate-400">Loading requests...</td></tr>
            <tr v-else-if="hrCorrections.length === 0"><td colspan="6" class="py-12 text-center text-slate-400">No pending correction requests found.</td></tr>
            <tr v-else v-for="item in hrCorrections" :key="item.id" class="hover:bg-slate-50/50">
              <td class="py-4 px-6">
                <div class="font-semibold text-slate-900">{{ item.employeeName || 'Employee #' + item.employeeId }}</div>
                <div class="text-xs font-mono text-slate-400">{{ item.employeeCode || 'N/A' }}</div>
              </td>
              <td class="py-4 px-6 font-medium text-slate-900">{{ item.correctionDate || item.workDate }}</td>
              <td class="py-4 px-6 font-mono text-xs text-slate-600">
                {{ formatTime(item.requestedCheckIn) }} – {{ formatTime(item.requestedCheckOut) }}
              </td>
              <td class="py-4 px-6 text-xs text-slate-500 max-w-xs truncate">{{ item.reason }}</td>
              <td class="py-4 px-6 text-center"><StatusBadge :content="item.status" :type="item.status" /></td>
              <td class="py-4 px-6 text-right space-x-2">
                <button v-if="item.status === 'PENDING'" @click="handleApproveCorrection(item.id, 'APPROVED')" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-all">
                  Approve
                </button>
                <button v-if="item.status === 'PENDING'" @click="handleApproveCorrection(item.id, 'REJECTED')" class="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-all">
                  Reject
                </button>
                <span v-else class="text-xs text-slate-400 italic">Processed</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL 1: GIẢI TRÌNH CÔNG -->
      <ModalGeneric v-model="correctionModal.show" title="Request Attendance Correction" width="500px">
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Requested Check In</label>
            <input type="datetime-local" v-model="correctionModal.requestedCheckIn" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black mt-1" />
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Requested Check Out</label>
            <input type="datetime-local" v-model="correctionModal.requestedCheckOut" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black mt-1" />
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Reason <span class="text-red-500">*</span></label>
            <textarea v-model="correctionModal.reason" rows="3" placeholder="Enter reason for explanation..." class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black mt-1 resize-none"></textarea>
          </div>
        </div>
        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton content="Cancel" @click="correctionModal.show = false" />
            <PrimaryButton content="Submit Request" @click="submitCorrection" />
          </div>
        </template>
      </ModalGeneric>

      <!-- MODAL 2: XIN NGHỈ PHÉP -->
      <ModalGeneric v-model="leaveModal.show" title="Create Leave Request" width="500px">
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Leave Type <span class="text-red-500">*</span></label>
            <select v-model="leaveModal.leaveTypeId" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black mt-1">
              <option v-for="t in (leaveTypes || [])" :key="t.id" :value="t.id">
                {{ t.name }} ({{ t.code }}) {{ t.isPaid ? '- Paid' : '- Unpaid' }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase">Start Date <span class="text-red-500">*</span></label>
              <input type="date" v-model="leaveModal.startDate" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black mt-1" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase">End Date <span class="text-red-500">*</span></label>
              <input type="date" v-model="leaveModal.endDate" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black mt-1" />
            </div>
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Reason <span class="text-red-500">*</span></label>
            <textarea v-model="leaveModal.reason" rows="3" placeholder="Reason for leave..." class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black mt-1 resize-none"></textarea>
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between">
              <span>Attachment URL {{ isAttachmentRequired ? '(Required)' : '(Optional)' }}</span>
              <span v-if="isAttachmentRequired" class="text-red-500 text-[10px] font-normal">* This leave type requires proof</span>
            </label>
            <input type="url" v-model="leaveModal.attachmentUrl" placeholder="https://example.com/medical-proof.pdf"
                   class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black mt-1" />
          </div>
        </div>

        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton content="Cancel" @click="leaveModal.show = false" />
            <PrimaryButton content="Submit Leave Request" @click="submitLeaveRequest" />
          </div>
        </template>
      </ModalGeneric>

      <!-- MODAL 3: HR SỬA CÔNG THỦ CÔNG -->
      <ModalGeneric v-model="manualModal.show" title="Update Attendance Record" width="500px">
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Check In Time</label>
            <input type="datetime-local" v-model="manualModal.checkIn" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black mt-1" />
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Check Out Time</label>
            <input type="datetime-local" v-model="manualModal.checkOut" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black mt-1" />
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Status</label>
            <select v-model="manualModal.status" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black mt-1">
              <option value="PRESENT">PRESENT</option>
              <option value="LATE">LATE</option>
              <option value="HALF_DAY">HALF_DAY</option>
              <option value="ABSENT">ABSENT</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Modification Reason <span class="text-red-500">*</span></label>
            <textarea v-model="manualModal.reason" rows="3" placeholder="Explain why modifying this record..." class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-black mt-1 resize-none"></textarea>
          </div>
        </div>
        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton content="Cancel" @click="manualModal.show = false" />
            <PrimaryButton content="Save Changes" @click="submitManualUpdate" />
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
import StatusBadge from '../components/StatusBadge.vue';
import ToastMessage from '../components/ToastMessage.vue';
import ModalGeneric from '../components/ModalGeneric.vue';
import { useAttendanceStore } from '../store/attendanceStore';
import { useAuthStore } from '../store/authStore';
import { useLeaveTypeStore } from '../store/leaveTypeStore';
import { storeToRefs } from 'pinia';
import { Clock, LogIn, LogOut } from '@lucide/vue';

const attendanceStore = useAttendanceStore();
const authStore = useAuthStore();
const leaveTypeStore = useLeaveTypeStore();

const { leaveTypes } = storeToRefs(leaveTypeStore);

const activeTab = ref('my-attendance');
const isLoading = ref(false);
const isSwiping = ref(false);

const myAttendances = ref([]);
const myCorrections = ref([]);
const hrAttendances = ref([]);
const hrCorrections = ref([]);

// 🌟 PHÂN QUYỀN HR / ADMIN CHUẨN XÁC
const isHR = computed(() => {
  if (authStore.isSystemAdmin) return true;

  const user = authStore.user || {};
  const userRoles = user.roles || authStore.roles || [];
  const userPerms = user.permissions || authStore.permissions || [];

  const roleNames = userRoles.map(r => (typeof r === 'string' ? r : r.name || '').toUpperCase());
  const permNames = userPerms.map(p => (typeof p === 'string' ? p : p.name || '').toUpperCase());

  const exactHRRoles = ['HR', 'ADMIN', 'HR_MANAGER', 'ROLE_HR', 'ROLE_ADMIN', 'COMPANY_ADMIN', 'SYSTEM_ADMIN'];
  const hasExactRole = roleNames.some(r => exactHRRoles.includes(r));

  const exactHRPerms = ['ATTENDANCE_FULL', 'ATTENDANCE_WRITE', 'ATTENDANCE_MANAGE'];
  const hasExactPerm = permNames.some(p => exactHRPerms.includes(p));

  return hasExactRole || hasExactPerm;
});

const todayRecord = computed(() => {
  const todayStr = new Date().toISOString().split('T')[0];
  return myAttendances.value.find(item => item.workDate === todayStr);
});

const isAlreadyCheckedIn = computed(() => {
  return !!(todayRecord.value && todayRecord.value.checkInTime && !todayRecord.value.checkOutTime);
});

const isCompletedToday = computed(() => {
  return !!(todayRecord.value && todayRecord.value.checkInTime && todayRecord.value.checkOutTime);
});

const todayStatusText = computed(() => {
  if (isCompletedToday.value) return 'Workday Completed';
  if (isAlreadyCheckedIn.value) return 'Working...';
  return 'Not Checked In';
});

const currentDateFormatted = computed(() => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
});

const toast = reactive({ show: false, message: '', type: 'success' });
const triggerToast = (msg, type = 'success') => {
  toast.message = msg; toast.type = type; toast.show = true;
  setTimeout(() => { toast.show = false; }, 3500);
};

const leaveModal = reactive({
  show: false,
  leaveTypeId: null,
  startDate: '',
  endDate: '',
  reason: '',
  attachmentUrl: ''
});

const correctionModal = reactive({
  show: false,
  attendanceId: null,
  requestedCheckIn: '',
  requestedCheckOut: '',
  reason: ''
});

const manualModal = reactive({
  show: false,
  id: null,
  checkIn: '',
  checkOut: '',
  status: 'PRESENT',
  reason: ''
});

const selectedLeaveType = computed(() => {
  if (!leaveTypes.value || !leaveModal.leaveTypeId) return null;
  return leaveTypes.value.find(t => t.id === leaveModal.leaveTypeId);
});

const isAttachmentRequired = computed(() => {
  return selectedLeaveType.value?.requiresAttachment === true;
});

const formatTime = (isoString) => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const handleWebSwipe = async (logType) => {
  if (logType === 'CHECK_IN' && (isAlreadyCheckedIn.value || isCompletedToday.value)) {
    triggerToast('You have already checked in for today!', 'error');
    return;
  }
  if (logType === 'CHECK_OUT' && !isAlreadyCheckedIn.value) {
    triggerToast('You must check in first before checking out!', 'error');
    return;
  }

  isSwiping.value = true;
  try {
    await attendanceStore.webSwipe(logType);
    triggerToast(`Swiped ${logType} successfully!`, 'success');
    await loadMyAttendances();
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Swipe failed.', 'error');
  } finally {
    isSwiping.value = false;
  }
};

const loadMyAttendances = async () => {
  isLoading.value = true;
  try {
    myAttendances.value = await attendanceStore.fetchMyAttendances();
  } catch (err) {
    console.error("Load my attendances error:", err);
  } finally {
    isLoading.value = false;
  }
};

const loadMyCorrections = async () => {
  try {
    const res = await attendanceStore.fetchMyCorrections('', 0, 20);
    myCorrections.value = res?.content || res?.items || res?.data?.items || (Array.isArray(res) ? res : []);
  } catch (err) {
    console.error("Load my corrections error:", err);
  }
};

const loadHRAttendances = async () => {
  if (!isHR.value) return;
  isLoading.value = true;
  try {
    const res = await attendanceStore.fetchHRAttendances(0, 20);
    hrAttendances.value = res?.content || res?.data?.items || res?.items || [];
  } catch (err) {
    console.error("Load HR attendances error:", err);
  } finally {
    isLoading.value = false;
  }
};

const loadHRCorrections = async () => {
  if (!isHR.value) return;
  isLoading.value = true;
  try {
    const fetchFn = attendanceStore.fetchHRCorrections || attendanceStore.fetchAllCorrectionsHR;
    if (typeof fetchFn === 'function') {
      const res = await fetchFn(0, 20);
      if (res?.content) {
        hrCorrections.value = res.content;
      } else if (res?.items) {
        hrCorrections.value = res.items;
      } else if (res?.data?.items) {
        hrCorrections.value = res.data.items;
      } else if (Array.isArray(res?.data)) {
        hrCorrections.value = res.data;
      } else if (Array.isArray(res)) {
        hrCorrections.value = res;
      } else {
        hrCorrections.value = [];
      }
    }
  } catch (err) {
    console.error("Load HR Corrections catch error:", err);
  } finally {
    isLoading.value = false;
  }
};

const openCorrectionModal = (item) => {
  correctionModal.attendanceId = item.id;
  correctionModal.requestedCheckIn = item.checkInTime ? new Date(item.checkInTime).toISOString().slice(0, 16) : '';
  correctionModal.requestedCheckOut = item.checkOutTime ? new Date(item.checkOutTime).toISOString().slice(0, 16) : '';
  correctionModal.reason = '';
  correctionModal.show = true;
};

const submitCorrection = async () => {
  if (!correctionModal.reason || !correctionModal.reason.trim()) {
    triggerToast('Please state a reason for explanation.', 'error');
    return;
  }
  try {
    const payload = {
      attendanceId: correctionModal.attendanceId,
      requestedCheckIn: correctionModal.requestedCheckIn ? new Date(correctionModal.requestedCheckIn).toISOString() : null,
      requestedCheckOut: correctionModal.requestedCheckOut ? new Date(correctionModal.requestedCheckOut).toISOString() : null,
      reason: correctionModal.reason.trim()
    };

    await attendanceStore.createCorrection(payload);
    triggerToast('Correction request submitted successfully!', 'success');
    correctionModal.show = false;

    await loadMyCorrections();
    activeTab.value = 'my-corrections';
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to submit correction.';
    triggerToast(errorMsg, 'error');
  }
};

const handleApproveCorrection = async (id, status) => {
  try {
    await attendanceStore.approveCorrection(id, { status, approverNote: 'Processed via HR Portal' });
    triggerToast(`Correction request ${status.toLowerCase()} successfully!`, 'success');
    await loadHRCorrections();
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Action failed.', 'error');
  }
};

const openLeaveModal = async () => {
  try {
    await leaveTypeStore.fetchLeaveTypes();
    if (leaveTypes.value && leaveTypes.value.length > 0) {
      leaveModal.leaveTypeId = leaveTypes.value[0].id;
    }
    leaveModal.show = true;
  } catch (e) {
    triggerToast('Failed to fetch leave types.', 'error');
  }
};

const submitLeaveRequest = async () => {
  if (!leaveModal.leaveTypeId || !leaveModal.startDate || !leaveModal.endDate || !leaveModal.reason.trim()) {
    triggerToast('Please fill all required fields.', 'error');
    return;
  }

  if (isAttachmentRequired.value && (!leaveModal.attachmentUrl || !leaveModal.attachmentUrl.trim())) {
    triggerToast('This leave type requires an attachment proof URL!', 'error');
    return;
  }

  try {
    await attendanceStore.createLeaveRequest({
      leaveTypeId: leaveModal.leaveTypeId,
      startDate: leaveModal.startDate,
      endDate: leaveModal.endDate,
      reason: leaveModal.reason.trim(),
      attachmentUrl: leaveModal.attachmentUrl ? leaveModal.attachmentUrl.trim() : null,
      sessionType: 'FULL_DAY'
    });
    triggerToast('Leave request submitted successfully!', 'success');
    leaveModal.show = false;
    leaveModal.attachmentUrl = '';
    leaveModal.reason = '';
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Submit request failed.', 'error');
  }
};

const openManualUpdateModal = (item) => {
  if (!isHR.value) return;
  manualModal.id = item.id;
  manualModal.checkIn = item.checkInTime ? new Date(item.checkInTime).toISOString().slice(0, 16) : '';
  manualModal.checkOut = item.checkOutTime ? new Date(item.checkOutTime).toISOString().slice(0, 16) : '';
  manualModal.status = item.status || 'PRESENT';
  manualModal.reason = '';
  manualModal.show = true;
};

const submitManualUpdate = async () => {
  if (!manualModal.reason || !manualModal.reason.trim()) {
    triggerToast('Please enter modification reason.', 'error');
    return;
  }
  try {
    await attendanceStore.updateManualAttendance(manualModal.id, {
      manualCheckIn: manualModal.checkIn ? new Date(manualModal.checkIn).toISOString() : null,
      manualCheckOut: manualModal.checkOut ? new Date(manualModal.checkOut).toISOString() : null,
      workPoints: 1.0,
      status: manualModal.status,
      modificationReason: manualModal.reason.trim()
    });
    triggerToast('Updated attendance successfully!', 'success');
    manualModal.show = false;
    await loadHRAttendances();
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Update failed.', 'error');
  }
};

// 🌟 THEO DÕI TAB CLICK ĐỂ TẢI DỮ LIỆU CHUẨN XÁC
watch(activeTab, (newTab) => {
  if (!isHR.value && (newTab === 'hr-attendance' || newTab === 'hr-corrections')) {
    activeTab.value = 'my-attendance';
    return;
  }

  if (newTab === 'my-attendance') loadMyAttendances();
  if (newTab === 'my-corrections') loadMyCorrections();
  if (newTab === 'hr-attendance' && isHR.value) loadHRAttendances();
  if (newTab === 'hr-corrections' && isHR.value) loadHRCorrections();
});

onMounted(() => {
  // Đảm bảo chỉ gọi API cá nhân ban đầu
  activeTab.value = 'my-attendance';
  loadMyAttendances();
});
</script>