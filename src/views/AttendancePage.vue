<template>
  <MainContent>
    <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans text-slate-900 relative">
      <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show" />

      <!-- CHECK-IN / CHECK-OUT ACTION BAR -->
      <div class="bg-white border border-slate-200 rounded-lg px-5 py-4 mb-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <Clock class="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <p class="text-sm font-medium text-slate-800">Daily Time Tracking</p>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ currentDateFormatted }}
              <span v-if="todayStatusText" class="ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                {{ todayStatusText }}
              </span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <!-- CHECK IN -->
          <button @click="handleWebSwipe('CHECK_IN')"
                  :disabled="isSwiping || isAlreadyCheckedIn || isCompletedToday"
                  :class="[
                    isAlreadyCheckedIn || isCompletedToday
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-green-600 hover:bg-green-700 text-white cursor-pointer border border-green-600',
                    'flex-1 sm:flex-none px-4 py-2 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5'
                  ]">
            <LogIn class="w-3.5 h-3.5" />
            <span>{{ isAlreadyCheckedIn ? 'Checked In' : 'Check In' }}</span>
          </button>

          <!-- CHECK OUT -->
          <button @click="handleWebSwipe('CHECK_OUT')"
                  :disabled="isSwiping || !isAlreadyCheckedIn || isCompletedToday"
                  :class="[
                    !isAlreadyCheckedIn || isCompletedToday
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer border border-red-600',
                    'flex-1 sm:flex-none px-4 py-2 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5'
                  ]">
            <LogOut class="w-3.5 h-3.5" />
            <span>{{ isCompletedToday ? 'Checked Out' : 'Check Out' }}</span>
          </button>

          <button @click="openLeaveModal"
                  class="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition-colors cursor-pointer">
            Request Leave
          </button>
        </div>
      </div>

      <!-- HEADER & TAB NAVIGATION -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-lg font-semibold text-slate-900">Attendance &amp; Leave</h1>
          <p class="text-xs text-slate-400 mt-0.5">Track daily attendance, requests, and approvals.</p>
        </div>

        <div class="flex items-center gap-0.5 bg-slate-100 p-1 rounded-lg overflow-x-auto">
          <button @click="activeTab = 'my-attendance'"
                  :class="[activeTab === 'my-attendance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700', 'px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap']">
            My Attendance
          </button>

          <button @click="activeTab = 'my-corrections'"
                  :class="[activeTab === 'my-corrections' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700', 'px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap']">
            My Corrections
          </button>

          <button @click="activeTab = 'my-leaves'"
                  :class="[activeTab === 'my-leaves' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700', 'px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap']">
            My Leaves
          </button>

          <!-- HR / ADMIN TABS -->
          <template v-if="isHR">
            <button @click="activeTab = 'hr-attendance'"
                    :class="[activeTab === 'hr-attendance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700', 'px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap']">
              HR Management
            </button>
            <button @click="activeTab = 'hr-corrections'"
                    :class="[activeTab === 'hr-corrections' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700', 'px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap']">
              Corrections Approval
            </button>
            <button @click="activeTab = 'hr-leaves'"
                    :class="[activeTab === 'hr-leaves' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700', 'px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap']">
              Leave Approvals
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

      <!-- TAB 3: MY LEAVES (CÁ NHÂN XEM VÀ HỦY ĐƠN) -->
      <div v-if="activeTab === 'my-leaves'" class="space-y-6">
        <div class="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-sm">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="bg-slate-50/70 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              <th class="py-4 px-6">Leave Type</th>
              <th class="py-4 px-6">Duration</th>
              <th class="py-4 px-6">Reason</th>
              <th class="py-4 px-6">Proof File</th>
              <th class="py-4 px-6 text-center">Status</th>
              <th class="py-4 px-6 text-right">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
            <tr v-if="myLeaves.length === 0"><td colspan="6" class="py-12 text-center text-slate-400">No leave requests found.</td></tr>
            <tr v-else v-for="item in myLeaves" :key="item.id" class="hover:bg-slate-50/50">
              <td class="py-4 px-6 font-medium text-slate-900">{{ item.leaveTypeName || 'Leave' }}</td>
              <td class="py-4 px-6 text-xs text-slate-600">
                {{ item.startDate }} → {{ item.endDate }} ({{ item.durationDays }} days)
                <span v-if="item.sessionType && item.sessionType !== 'FULL_DAY'" class="ml-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  {{ item.sessionType }}
                </span>
              </td>
              <td class="py-4 px-6 text-xs text-slate-500 max-w-xs truncate">{{ item.reason }}</td>
              <td class="py-4 px-6 text-xs">
                <a v-if="item.attachmentUrl" :href="item.attachmentUrl" target="_blank" class="text-blue-600 hover:underline flex items-center gap-1">
                  <Paperclip class="w-3.5 h-3.5" /> View File
                </a>
                <span v-else class="text-slate-400">—</span>
              </td>
              <td class="py-4 px-6 text-center"><StatusBadge :content="item.status" :type="item.status" /></td>
              <td class="py-4 px-6 text-right">
                <button v-if="item.status === 'PENDING' || item.status === 'APPROVED'"
                        @click="handleCancelLeave(item.id)"
                        class="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold cursor-pointer transition-all">
                  Cancel Request
                </button>
                <span v-else class="text-xs text-slate-400 italic">No action</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: HR MANAGEMENT -->
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

      <!-- TAB 5: CORRECTIONS APPROVAL -->
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

      <!-- TAB 6: LEAVE APPROVALS (HR DUYỆT ĐƠN NGHỈ PHÉP TOÀN CÔNG TY) -->
      <div v-if="activeTab === 'hr-leaves' && isHR" class="space-y-6">
        <div class="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-sm">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="bg-slate-50/70 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              <th class="py-4 px-6">Employee</th>
              <th class="py-4 px-6">Leave Type</th>
              <th class="py-4 px-6">Duration</th>
              <th class="py-4 px-6">Reason</th>
              <th class="py-4 px-6">Proof File</th>
              <th class="py-4 px-6 text-center">Status</th>
              <th class="py-4 px-6 text-right">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
            <tr v-if="isLoading"><td colspan="7" class="py-12 text-center text-slate-400">Loading leave requests...</td></tr>
            <tr v-else-if="hrLeaves.length === 0"><td colspan="7" class="py-12 text-center text-slate-400">No leave requests found.</td></tr>
            <tr v-else v-for="item in hrLeaves" :key="item.id" class="hover:bg-slate-50/50">
              <td class="py-4 px-6 font-semibold text-slate-900">
                {{ item.employeeName || 'Employee #' + item.employeeId }}
              </td>
              <td class="py-4 px-6 font-medium text-slate-900">{{ item.leaveTypeName }}</td>
              <td class="py-4 px-6 text-xs text-slate-600">
                {{ item.startDate }} → {{ item.endDate }} ({{ item.durationDays }} days)
                <span v-if="item.sessionType && item.sessionType !== 'FULL_DAY'" class="ml-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  {{ item.sessionType }}
                </span>
              </td>
              <td class="py-4 px-6 text-xs text-slate-500 max-w-xs truncate">{{ item.reason }}</td>
              <td class="py-4 px-6 text-xs">
                <a v-if="item.attachmentUrl" :href="item.attachmentUrl" target="_blank" class="text-blue-600 hover:underline flex items-center gap-1">
                  <Paperclip class="w-3.5 h-3.5" /> View File
                </a>
                <span v-else class="text-slate-400">—</span>
              </td>
              <td class="py-4 px-6 text-center"><StatusBadge :content="item.status" :type="item.status" /></td>
              <td class="py-4 px-6 text-right space-x-2">
                <template v-if="item.status === 'PENDING'">
                  <button @click="handleApproveLeave(item.id, 'APPROVED')" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all">Approve</button>
                  <button @click="handleApproveLeave(item.id, 'REJECTED')" class="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all">Reject</button>
                </template>
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
            <DateTimePicker v-model="correctionModal.requestedCheckIn" />
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Requested Check Out</label>
            <DateTimePicker v-model="correctionModal.requestedCheckOut" />
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Reason <span class="text-red-500">*</span></label>
            <textarea v-model="correctionModal.reason" rows="3" placeholder="Enter reason for explanation..." class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 mt-1 resize-none"></textarea>
          </div>
        </div>
        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton content="Cancel" @click="correctionModal.show = false" />
            <PrimaryButton content="Submit" @click="submitCorrection" />
          </div>
        </template>
      </ModalGeneric>

      <!-- MODAL 2: XIN NGHỈ PHÉP (ĐÃ CHUYỂN ATTACHMENT SANG UPLOAD FILE THỰC TẾ) -->
      <ModalGeneric v-model="leaveModal.show" title="Create Leave Request" width="500px">
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Leave Type <span class="text-red-500">*</span></label>
            <select v-model="leaveModal.leaveTypeId" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 mt-1 bg-white text-slate-800">
              <option :value="null" disabled>-- Select Leave Type --</option>
              <option v-for="t in (leaveTypes || [])" :key="t.id" :value="t.id">
                {{ t.name }} ({{ t.code }}) {{ t.isPaid ? '- Paid' : '- Unpaid' }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase">Start Date <span class="text-red-500">*</span></label>
              <input type="date" v-model="leaveModal.startDate" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 mt-1 bg-white text-slate-800 cursor-pointer" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase">End Date <span class="text-red-500">*</span></label>
              <input type="date" v-model="leaveModal.endDate" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 mt-1 bg-white text-slate-800 cursor-pointer" />
            </div>
          </div>

          <!-- LỰA CHỌN CA NGHỈ (HIỆN KHI CHỌN NGHỈ TRONG CÙNG 1 NGÀY) -->
          <div v-if="isSingleDayLeave">
            <label class="text-[10px] font-bold text-slate-400 uppercase">Session Type (Half-Day Support)</label>
            <select v-model="leaveModal.sessionType" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 mt-1">
              <option value="FULL_DAY">Full Day (1.0 day)</option>
              <option value="MORNING">Morning Half-Day (0.5 day)</option>
              <option value="AFTERNOON">Afternoon Half-Day (0.5 day)</option>
            </select>
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Reason <span class="text-red-500">*</span></label>
            <textarea v-model="leaveModal.reason" rows="3" placeholder="Reason for leave..." class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 mt-1 resize-none"></textarea>
          </div>

          <!-- 🌟 UPLOAD ATTACHMENT FILE (THAY THẾ CHO CHO PHẦN INPUT LINK URL THỦ CÔNG) -->
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between mb-1">
              <span>Attachment {{ isAttachmentRequired ? '(Required)' : '(Optional)' }}</span>
              <span v-if="isAttachmentRequired" class="text-red-500 text-[10px] font-normal">* Requires proof document</span>
            </label>

            <input type="file" ref="leaveFileInputRef" class="hidden" @change="onLeaveFileSelected" accept="image/*,.pdf,.doc,.docx" />

            <!-- Trường hợp chưa chọn / chưa upload file -->
            <div v-if="!leaveModal.attachmentUrl"
                 @click="leaveFileInputRef.click()"
                 class="border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center gap-1">
              <Upload class="w-5 h-5 text-slate-400" />
              <span class="text-xs text-slate-600 font-medium">Click to upload proof document</span>
              <span class="text-[10px] text-slate-400">PDF, PNG, JPG, DOC up to 10MB</span>
            </div>

            <!-- Trường hợp đang tải file lên Cloudinary -->
            <div v-else-if="isUploadingAttachment" class="border border-slate-200 rounded-xl p-3 flex items-center justify-center gap-2 bg-slate-50 text-xs text-slate-500">
              <LoaderCircle class="w-4 h-4 animate-spin text-slate-700" />
              <span>Uploading attachment...</span>
            </div>

            <!-- Trường hợp đã tải file lên thành công -->
            <div v-else class="border border-slate-200 rounded-xl p-3 flex items-center justify-between bg-slate-50 text-xs">
              <div class="flex items-center gap-2 overflow-hidden mr-2">
                <Paperclip class="w-4 h-4 text-blue-600 shrink-0" />
                <span class="font-medium text-slate-800 truncate max-w-xs">{{ uploadedFileName || 'Attachment Document' }}</span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <a :href="leaveModal.attachmentUrl" target="_blank" class="text-blue-600 hover:underline text-[11px] font-medium">Preview</a>
                <button type="button" @click="removeLeaveAttachment" class="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer">
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton content="Cancel" @click="leaveModal.show = false" />
            <PrimaryButton content="Submit" @click="submitLeaveRequest" :disabled="isUploadingAttachment" />
          </div>
        </template>
      </ModalGeneric>

      <!-- MODAL 3: HR SỬA CÔNG THỦ CÔNG -->
      <ModalGeneric v-model="manualModal.show" title="Update Attendance Record" width="500px">
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Check In Time</label>
            <input type="datetime-local" lang="en-US" v-model="manualModal.checkIn" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 mt-1" />
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Check Out Time</label>
            <input type="datetime-local" lang="en-US" v-model="manualModal.checkOut" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 mt-1" />
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Status</label>
            <select v-model="manualModal.status" class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 mt-1">
              <option value="PRESENT">PRESENT</option>
              <option value="LATE">LATE</option>
              <option value="HALF_DAY">HALF_DAY</option>
              <option value="ABSENT">ABSENT</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase">Modification Reason <span class="text-red-500">*</span></label>
            <textarea v-model="manualModal.reason" rows="3" placeholder="Explain why modifying this record..." class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 mt-1 resize-none"></textarea>
          </div>
        </div>
        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton content="Cancel" @click="manualModal.show = false" />
            <PrimaryButton content="Save" @click="submitManualUpdate" />
          </div>
        </template>
      </ModalGeneric>

      <!-- MODAL XÁC NHẬN HỦY ĐƠN NGHỈ PHÉP (POPUP GIỮA MÀN HÌNH) -->
      <ModalGeneric v-model="cancelLeaveModal.show" title="Cancel Leave Request" width="450px">
        <div class="p-2 text-center space-y-3">
          <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle class="w-6 h-6" />
          </div>
          <h3 class="text-base font-semibold text-slate-900">Are you sure you want to cancel?</h3>
        </div>
        <template #footer>
          <div class="flex gap-2 justify-end w-full">
            <SecondaryButton content="Keep Request" @click="cancelLeaveModal.show = false" />
            <button @click="confirmCancelLeave"
                    class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer">
              Yes
            </button>
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
import DateTimePicker from '../components/DateTimePicker.vue';
import { useAttendanceStore } from '../store/attendanceStore';
import { useAuthStore } from '../store/authStore';
import { useLeaveTypeStore } from '../store/leaveTypeStore';
import { useUploadStore } from '../store/uploadStore';

import { storeToRefs } from 'pinia';
import { Clock, LogIn, LogOut, AlertTriangle, Paperclip, Upload, X, LoaderCircle } from '@lucide/vue';

const attendanceStore = useAttendanceStore();
const authStore = useAuthStore();
const leaveTypeStore = useLeaveTypeStore();
const uploadStore = useUploadStore();

const { leaveTypes } = storeToRefs(leaveTypeStore);

const activeTab = ref('my-attendance');
const isLoading = ref(false);
const isSwiping = ref(false);

// State dành riêng cho Upload Attachment File trong Leave Modal
const leaveFileInputRef = ref(null);
const isUploadingAttachment = ref(false);
const uploadedFileName = ref('');

const myAttendances = ref([]);
const myCorrections = ref([]);
const myLeaves = ref([]);
const hrAttendances = ref([]);
const hrCorrections = ref([]);
const hrLeaves = ref([]);

// PHÂN QUYỀN HR / ADMIN
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
  attachmentUrl: '',
  sessionType: 'FULL_DAY'
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

const cancelLeaveModal = reactive({
  show: false,
  requestId: null
});

const selectedLeaveType = computed(() => {
  if (!leaveTypes.value || !leaveModal.leaveTypeId) return null;
  return leaveTypes.value.find(t => t.id === leaveModal.leaveTypeId);
});

const isAttachmentRequired = computed(() => {
  return selectedLeaveType.value?.requiresAttachment === true;
});

// BẮT ĐIỀU KIỆN NGHỈ TRONG CÙNG 1 NGÀY ĐỂ MỞ TÙY CHỌN HALF-DAY
const isSingleDayLeave = computed(() => {
  return leaveModal.startDate && leaveModal.endDate && leaveModal.startDate === leaveModal.endDate;
});

const formatTime = (isoString) => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

// 🌟 XỬ LÝ UPLOAD FILE NGHỈ PHÉP LÊN CLOUDINARY
const onLeaveFileSelected = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isUploadingAttachment.value = true;
  uploadedFileName.value = file.name;

  try {
    const presignRes = await uploadStore.getPresignedUrl('leave_requests');
    const presignData = presignRes.data?.data;
    const cloudinaryRes = await uploadStore.uploadToCloudinary(file, presignData);

    leaveModal.attachmentUrl = cloudinaryRes.secure_url;
    triggerToast('File uploaded successfully!', 'success');
  } catch (err) {
    triggerToast('Failed to upload file. Please try again.', 'error');
    removeLeaveAttachment();
  } finally {
    isUploadingAttachment.value = false;
    if (leaveFileInputRef.value) {
      leaveFileInputRef.value.value = '';
    }
  }
};

const removeLeaveAttachment = () => {
  leaveModal.attachmentUrl = '';
  uploadedFileName.value = '';
  if (leaveFileInputRef.value) {
    leaveFileInputRef.value.value = '';
  }
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

const loadMyLeaves = async () => {
  try {
    const res = await attendanceStore.fetchMyLeaveRequests(0, 20);
    myLeaves.value = res?.content || res?.items || res?.data?.items || (Array.isArray(res) ? res : []);
  } catch (err) {
    console.error("Load my leaves error:", err);
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
      hrCorrections.value = res?.content || res?.items || res?.data?.items || (Array.isArray(res) ? res : []);
    }
  } catch (err) {
    console.error("Load HR Corrections catch error:", err);
  } finally {
    isLoading.value = false;
  }
};

const loadHRLeaves = async () => {
  if (!isHR.value) return;
  isLoading.value = true;
  try {
    const res = await attendanceStore.fetchLeaveRequests(0, 20);
    hrLeaves.value = res?.content || res?.items || res?.data?.items || (Array.isArray(res) ? res : []);
  } catch (err) {
    console.error("Load HR Leaves error:", err);
  } finally {
    isLoading.value = false;
  }
};

const handleCancelLeave = (id) => {
  cancelLeaveModal.requestId = id;
  cancelLeaveModal.show = true;
};

const confirmCancelLeave = async () => {
  if (!cancelLeaveModal.requestId) return;

  try {
    await attendanceStore.cancelLeaveRequest(cancelLeaveModal.requestId);
    triggerToast("Leave request cancelled successfully!", "success");

    cancelLeaveModal.show = false;
    cancelLeaveModal.requestId = null;

    await loadMyLeaves();
    if (isHR.value) await loadHRLeaves();
  } catch (err) {
    triggerToast(err.response?.data?.message || err.response?.data?.data || "Failed to cancel leave request.", "error");
  }
};

const handleApproveLeave = async (id, status) => {
  try {
    if (status === 'APPROVED') {
      await attendanceStore.approveLeaveRequest(id, 'Approved by HR');
    } else {
      await attendanceStore.rejectLeaveRequest(id, 'Rejected by HR');
    }
    triggerToast(`Leave request ${status.toLowerCase()} successfully!`, "success");
    await loadHRLeaves();
  } catch (err) {
    triggerToast(err.response?.data?.message || "Action failed.", "error");
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
    leaveModal.startDate = '';
    leaveModal.endDate = '';
    leaveModal.reason = '';
    leaveModal.attachmentUrl = '';
    uploadedFileName.value = '';
    leaveModal.sessionType = 'FULL_DAY';
    leaveModal.show = true;
  } catch (e) {
    triggerToast('Failed to fetch leave types.', 'error');
  }
};

// XỬ LÝ NỘP ĐƠN NGHỈ PHÉP
const submitLeaveRequest = async () => {
  if (!leaveModal.leaveTypeId) {
    triggerToast('Please select a leave type.', 'error');
    return;
  }
  if (!leaveModal.startDate) {
    triggerToast('Please select a start date.', 'error');
    return;
  }
  if (!leaveModal.endDate) {
    triggerToast('Please select an end date.', 'error');
    return;
  }
  if (leaveModal.startDate > leaveModal.endDate) {
    triggerToast('End date cannot be before start date.', 'error');
    return;
  }
  if (!leaveModal.reason || !leaveModal.reason.trim()) {
    triggerToast('Please enter a reason for leave.', 'error');
    return;
  }

  if (isAttachmentRequired.value && (!leaveModal.attachmentUrl || !leaveModal.attachmentUrl.trim())) {
    triggerToast('This leave type requires a proof document attachment!', 'error');
    return;
  }

  const session = isSingleDayLeave.value ? leaveModal.sessionType : 'FULL_DAY';

  try {
    await attendanceStore.createLeaveRequest({
      leaveTypeId: Number(leaveModal.leaveTypeId),
      startDate: leaveModal.startDate,
      endDate: leaveModal.endDate,
      reason: leaveModal.reason.trim(),
      attachmentUrl: leaveModal.attachmentUrl ? leaveModal.attachmentUrl.trim() : null,
      sessionType: session
    });

    triggerToast('Leave request submitted successfully!', 'success');
    leaveModal.show = false;
    leaveModal.attachmentUrl = '';
    leaveModal.reason = '';
    uploadedFileName.value = '';
    leaveModal.sessionType = 'FULL_DAY';

    await loadMyLeaves();
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

// WATCHER THEO DÕI NÚT CHUYỂN TAB ĐỂ LOAD DỮ LIỆU
watch(activeTab, (newTab) => {
  if (!isHR.value && (newTab === 'hr-attendance' || newTab === 'hr-corrections' || newTab === 'hr-leaves')) {
    activeTab.value = 'my-attendance';
    return;
  }

  if (newTab === 'my-attendance') loadMyAttendances();
  if (newTab === 'my-corrections') loadMyCorrections();
  if (newTab === 'my-leaves') loadMyLeaves();
  if (newTab === 'hr-attendance' && isHR.value) loadHRAttendances();
  if (newTab === 'hr-corrections' && isHR.value) loadHRCorrections();
  if (newTab === 'hr-leaves' && isHR.value) loadHRLeaves();
});

onMounted(() => {
  activeTab.value = 'my-attendance';
  loadMyAttendances();
});
</script>