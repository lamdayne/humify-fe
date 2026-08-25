<template>
  <MainContent>
    <div class="w-full space-y-6 pt-4 px-6 text-slate-700 relative">

      <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show" />

      <!-- Delete Confirm Modal -->
      <ModalGeneric
          v-model="deleteModal.show"
          title="Delete Work Shift"
          width="440px"
          :closeOnBackdrop="true"
      >
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
            <HelpCircle class="w-5 h-5" />
          </div>
          <div class="space-y-1">
            <p class="text-sm text-slate-600 font-normal leading-relaxed">
              Are you sure you want to delete this work shift?
            </p>
            <p class="text-xs text-slate-400 font-light">
              This action cannot be undone. Employees assigned to this shift may be affected.
            </p>
          </div>
        </div>
        <template #footer>
          <button
              @click="handleCancelDelete"
              class="px-4 py-2 border border-slate-200 text-xs font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
          >Cancel</button>
          <button
              @click="handleConfirmDelete"
              class="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >Delete Shift</button>
        </template>
      </ModalGeneric>

      <!-- Create / Edit Modal -->
      <Teleport to="body">
        <div v-if="shiftModal.show" class="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6">
          <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px]" @click="closeShiftModal" />
          <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-[680px] z-10 max-h-[calc(100vh-3rem)] flex flex-col overflow-hidden">

            <!-- Modal Header -->
            <div class="px-6 py-5 border-b border-slate-100 shrink-0">
              <div class="flex items-start justify-between">
                <div>
                  <h2 class="text-lg font-bold text-slate-900">
                    {{ shiftModal.mode === 'create' ? 'Create New WorkShift' : 'Edit WorkShift' }}
                  </h2>
                  <p class="text-xs text-slate-400 mt-0.5">Define schedule parameters for a new shift type.</p>
                </div>
                <button @click="closeShiftModal" class="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="px-6 py-5 space-y-6 overflow-y-auto flex-1">

              <!-- Basic Details -->
              <div>
                <h3 class="text-sm font-bold text-slate-800 mb-4">Basic Details</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1.5">
                    <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Shift Code</label>
                    <input
                        v-model="form.shiftCode"
                        type="text"
                        placeholder="e.g., WS-NIGHT"
                        class="w-full border border-slate-200 px-3 py-2.5 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 text-sm transition-all placeholder:text-slate-300"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Shift Name</label>
                    <input
                        v-model="form.shiftName"
                        type="text"
                        placeholder="e.g., Night Support Shift"
                        class="w-full border border-slate-200 px-3 py-2.5 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 text-sm transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>

              <!-- Schedule & Timing -->
              <div>
                <h3 class="text-sm font-bold text-slate-800 mb-4">Schedule &amp; Timing</h3>
                <div class="grid grid-cols-2 gap-4">
                  <!-- Working Hours -->
                  <div class="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 space-y-3">
                    <div class="flex items-center gap-2">
                      <Clock class="w-4 h-4 text-indigo-600" />
                      <span class="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Working Hours</span>
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-xs text-slate-500 font-medium">Check-in Time</label>
                      <select
                          v-model="form.checkInTime"
                          class="w-full border border-slate-200 bg-white px-3 py-2 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 text-sm transition-all"
                      >
                        <option v-for="t in timeOptions" :key="t" :value="t">{{ t }}</option>
                      </select>
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-xs text-slate-500 font-medium">Check-out Time</label>
                      <select
                          v-model="form.checkOutTime"
                          class="w-full border border-slate-200 bg-white px-3 py-2 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 text-sm transition-all"
                      >
                        <option v-for="t in timeOptions" :key="t" :value="t">{{ t }}</option>
                      </select>
                    </div>
                  </div>

                  <!-- Break Time -->
                  <div class="bg-purple-50/60 border border-purple-100 rounded-xl p-4 space-y-3">
                    <div class="flex items-center gap-2">
                      <Utensils class="w-4 h-4 text-purple-600" />
                      <span class="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Break Time</span>
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-xs text-slate-500 font-medium">Lunch Break Start</label>
                      <select
                          v-model="form.breakStart"
                          class="w-full border border-slate-200 bg-white px-3 py-2 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 text-sm transition-all"
                      >
                        <option v-for="t in timeOptions" :key="t" :value="t">{{ t }}</option>
                      </select>
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-xs text-slate-500 font-medium">Lunch Break End</label>
                      <select
                          v-model="form.breakEnd"
                          class="w-full border border-slate-200 bg-white px-3 py-2 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 text-sm transition-all"
                      >
                        <option v-for="t in timeOptions" :key="t" :value="t">{{ t }}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Grace + Status row -->
                <div class="grid grid-cols-2 gap-4 mt-4">
                  <div class="space-y-1.5">
                    <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      Grace Period (Minutes)
                      <span class="inline-flex w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-500 text-[9px] items-center justify-center font-bold cursor-help" title="Allowed late check-in window">?</span>
                    </label>
                    <input
                        v-model.number="form.gracePeriod"
                        type="number"
                        min="0"
                        max="60"
                        placeholder="15"
                        class="w-full border border-slate-200 px-3 py-2.5 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 text-sm transition-all"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</label>
                    <select
                        v-model="form.status"
                        class="w-full border border-slate-200 bg-white px-3 py-2.5 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 text-sm transition-all font-medium"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Timeline Preview -->
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <Eye class="w-4 h-4 text-indigo-600" />
                  <h3 class="text-sm font-bold text-slate-800">Timeline Preview</h3>
                </div>
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <!-- Labels row -->
                  <div class="relative h-4 mb-1">
                    <span
                        v-for="label in timelineLabels"
                        :key="label.time"
                        class="absolute text-[10px] text-slate-400 font-medium -translate-x-1/2"
                        :style="{ left: label.pct + '%' }"
                    >{{ label.time }}</span>
                  </div>
                  <!-- Bar -->
                  <div class="relative h-8 rounded-lg overflow-hidden" style="background:#dde0ec;">
                    <!-- Working block -->
                    <div
                        v-if="timelineBlocks.working"
                        class="absolute top-0 h-full"
                        style="background: #4f46e5; opacity:0.9;"
                        :style="{ left: timelineBlocks.working.left + '%', width: timelineBlocks.working.width + '%' }"
                    />
                    <!-- Break block -->
                    <div
                        v-if="timelineBlocks.breakBlock"
                        class="absolute top-0 h-full flex items-center justify-center"
                        style="background: #a5b4fc;"
                        :style="{ left: timelineBlocks.breakBlock.left + '%', width: timelineBlocks.breakBlock.width + '%' }"
                    >
                      <Utensils class="w-3 h-3 text-white" v-if="timelineBlocks.breakBlock.width > 3" />
                    </div>
                    <!-- Grace indicator -->
                    <div
                        v-if="timelineBlocks.grace && form.gracePeriod > 0"
                        class="absolute top-0 w-0.5 h-full"
                        style="background: #ef4444;"
                        :style="{ left: timelineBlocks.grace.left + '%' }"
                    />
                  </div>

                  <!-- Legend -->
                  <div class="flex items-center gap-5 mt-3 justify-center">
                    <div class="flex items-center gap-1.5">
                      <span class="w-3 h-3 rounded-sm inline-block" style="background:#4f46e5;" />
                      <span class="text-xs text-slate-500 font-medium">Working</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span class="w-3 h-3 rounded-sm inline-block" style="background:#a5b4fc;" />
                      <span class="text-xs text-slate-500 font-medium">Break</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span class="w-0.5 h-3 inline-block" style="background:#ef4444;" />
                      <span class="text-xs text-slate-500 font-medium">Grace Limit</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-white">
              <button
                  @click="closeShiftModal"
                  class="px-5 py-2.5 border border-slate-200 text-sm font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
              >Cancel</button>
              <button
                  @click="handleSave"
                  :disabled="isSaving"
                  class="px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition-all cursor-pointer active:scale-[0.98] flex items-center gap-2 disabled:opacity-60"
                  style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);"
              >
                <Save class="w-4 h-4" />
                {{ isSaving ? 'Saving...' : 'Save WorkShift' }}
              </button>
            </div>

          </div>
        </div>
      </Teleport>

      <!-- Action Dropdown Menu Teleported to Body -->
      <Teleport to="body">
        <div
            v-if="activeActionShift"
            class="fixed w-36 bg-white border border-slate-200 rounded-lg shadow-xl z-[9999] py-1 overflow-hidden"
            :style="{ top: menuPos.top, left: menuPos.left }"
            @click.stop
        >
          <button
              @click="openShiftModal('edit', activeActionShift); closeActionMenu()"
              class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Pencil class="w-3.5 h-3.5" /> Edit
          </button>
          <button
              @click="handleToggleStatus(activeActionShift); closeActionMenu()"
              class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Power class="w-3.5 h-3.5 text-slate-400" />
            {{ activeActionShift.status === true || activeActionShift.status === 'ACTIVE' ? 'Set Inactive' : 'Set Active' }}
          </button>
          <button
              @click="handleDelete(activeActionShift.id); closeActionMenu()"
              class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 class="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </Teleport>

      <!-- ============================== PAGE HEADER ============================== -->
      <div class="flex justify-between items-start gap-6">
        <div class="min-w-0">
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Work Shift Management</h1>
          <p class="text-sm text-slate-400 font-light mt-1">
            Configure working hours, break times, and grace periods for company employees.
          </p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <!-- Chỉ HR / Company Admin mới thấy nút Create -->
          <button
              v-if="canManageShift"
              @click="openShiftModal('create')"
              class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);"
          >
            <Plus class="w-4 h-4" />
            Create New Shift
          </button>
          <!-- Badge chỉ đọc cho Employee -->
          <span v-else class="text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg font-medium">View Only</span>
        </div>
      </div>

      <!-- ============================== STATS CARDS ============================== -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Total Active -->
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Active Shifts</span>
            <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Clock class="w-4 h-4 text-indigo-500" />
            </div>
          </div>
          <p class="text-3xl font-bold text-slate-900">{{ stats.total }}</p>
        </div>

        <!-- Standard Day Shifts -->
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Standard Day Shifts</span>
            <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Sun class="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <p class="text-3xl font-bold text-slate-900">{{ stats.day }}</p>
        </div>
      </div>

      <!-- ============================== TABLE SECTION ============================== -->
      <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <!-- Search & Filter Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100 bg-white">
          <div class="relative w-72 sm:w-80 shrink-0">
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name or code..."
                class="w-full h-9 bg-slate-50 border border-slate-200 pl-9 pr-3 rounded-lg text-xs outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Filter class="w-3.5 h-3.5 text-slate-400" />
              <span>Status:</span>
            </div>
            <select
                v-model="statusFilter"
                class="h-9 bg-slate-50 border border-slate-200 px-3 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 transition-all cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="bg-slate-50/70 border-b border-slate-200 text-xs uppercase font-semibold tracking-wider text-slate-400">
              <th class="px-5 py-3.5">Code</th>
              <th class="px-5 py-3.5">Shift Name</th>
              <th class="px-5 py-3.5">Timeline (24h) &amp; Working Time</th>
              <th class="px-5 py-3.5">Break Time</th>
              <th class="px-5 py-3.5">Grace</th>
              <th class="px-5 py-3.5">Pts</th>
              <th class="px-5 py-3.5">Status</th>
              <!-- Chỉ hiển thị cột Actions cho HR/Admin -->
              <th v-if="canManageShift" class="px-5 py-3.5 text-right">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm text-slate-700">

            <tr v-if="isLoading">
              <td colspan="8" class="px-6 py-12 text-center text-slate-400 font-light animate-pulse">Loading shift data...</td>
            </tr>

            <tr v-else-if="filteredShifts.length === 0">
              <td :colspan="canManageShift ? 8 : 7" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center gap-2">
                  <Clock class="w-8 h-8 text-slate-200" />
                  <p class="text-slate-400 font-light text-sm">No work shifts found.</p>
                  <button v-if="canManageShift" @click="openShiftModal('create')" class="text-indigo-600 text-xs font-medium hover:underline cursor-pointer">
                    + Create your first shift
                  </button>
                </div>
              </td>
            </tr>

            <tr
                v-else
                v-for="shift in filteredShifts"
                :key="shift.id"
                class="hover:bg-slate-50/60 transition-colors"
            >
              <!-- Code -->
              <td class="px-5 py-4">
                <span class="font-mono text-indigo-600 font-semibold text-xs bg-indigo-50 px-2 py-0.5 rounded-md">{{ shift.shiftCode }}</span>
              </td>

              <!-- Name -->
              <td class="px-5 py-4 font-medium text-slate-800">
                <div class="flex items-center gap-1.5">
                  {{ shift.name || shift.shiftName }}
                  <Moon v-if="shift.isOvernight" class="w-3.5 h-3.5 text-indigo-400" />
                </div>
              </td>

              <!-- Timeline bar -->
              <td class="px-5 py-4">
                <div class="text-xs text-slate-500 mb-1.5 font-medium">
                  {{ formatTime(isoToTime(shift.startTime || shift.checkInTime)) }} – {{ formatTime(isoToTime(shift.endTime || shift.checkOutTime)) }}
                </div>
                <div class="relative h-2 rounded-full w-44 overflow-hidden" style="background:#e8eaf0;">
                  <div
                      class="absolute top-0 h-full rounded-full"
                      style="background: linear-gradient(90deg, #4f46e5, #818cf8);"
                      :style="getBarStyle(shift)"
                  />
                  <div
                      v-if="getBreakBarStyle(shift)"
                      class="absolute top-0 h-full rounded-full"
                      style="background: #a5b4fc;"
                      :style="getBreakBarStyle(shift)"
                  />
                </div>
              </td>

              <!-- Break Time -->
              <td class="px-5 py-4 text-xs text-slate-500">
                {{ (shift.breakStartTime || shift.breakStart) ? (formatTime(isoToTime(shift.breakStartTime || shift.breakStart)) + ' – ' + formatTime(isoToTime(shift.breakEndTime || shift.breakEnd))) : '—' }}
              </td>

              <!-- Grace -->
              <td class="px-5 py-4 text-xs text-slate-500">
                {{ (shift.gracePeriodMinutes ?? shift.gracePeriod) != null ? (shift.gracePeriodMinutes ?? shift.gracePeriod) + ' mins' : '—' }}
              </td>

              <!-- Pts -->
              <td class="px-5 py-4 text-xs text-slate-500">
                {{ shift.workingPoints ? shift.workingPoints + ' Day' : '1.0 Day' }}
                <span v-if="shift.isOvernight" class="ml-1 text-[10px] bg-indigo-50 text-indigo-500 px-1 py-0.5 rounded font-medium">+0.5</span>
              </td>

              <!-- Status -->
              <td class="px-5 py-4">
                <StatusBadge :content="shift.status === true || shift.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'" :type="shift.status === true || shift.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'">
                  <template #icon>
                    <span class="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                  </template>
                </StatusBadge>
              </td>

              <!-- Actions: chỉ HR/Admin mới thấy -->
              <td v-if="canManageShift" class="px-5 py-4 text-right">
                <div class="inline-block">
                  <button
                      @click.stop="toggleActionMenu(shift, $event)"
                      class="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <MoreVertical class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination outside table card -->
      <PaginationSection
          v-if="filteredShifts.length > 0 && !isLoading"
          :page-size="pagination.pageSize"
          :current-page="pagination.pageNo"
          :item-label="'Shifts'"
          :total-items="pagination.totalElements"
          :total-page="pagination.totalPages"
          @changePage="handlePageChange"
      />

    </div>
  </MainContent>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue';
import MainContent from '../components/MainContent.vue';
import ToastMessage from '../components/ToastMessage.vue';
import ModalGeneric from '../components/ModalGeneric.vue';
import StatusBadge from '../components/StatusBadge.vue';
import PaginationSection from '../components/PaginationSection.vue';
import { useWorkShiftStore } from '../store/workShiftStore';
import { useAuthStore } from '../store/authStore';
import {
  Clock, Sun, Moon, Plus, Search, Filter,
  Pencil, Trash2, MoreVertical, HelpCircle, Utensils, Eye, X, Save, Power
} from '@lucide/vue';

const workShiftStore = useWorkShiftStore();
const authStore = useAuthStore();

// ─── Phân quyền: chỉ HR / Company Admin mới được thao tác ─────────────────────
const canManageShift = computed(() => {
  if (authStore.isSystemAdmin) return true;

  const user = authStore.user || {};
  const userRoles = user.roles || [];
  const userPerms = authStore.permissions || user.permissions || [];

  const roleNames = userRoles.map(r => (typeof r === 'string' ? r : r.name || '').toUpperCase());
  const permNames = userPerms.map(p => (typeof p === 'string' ? p : p.name || '').toUpperCase());

  // Kiểm tra roles HR / Company Admin
  const hrRoles = ['HR', 'ADMIN', 'HR_MANAGER', 'ROLE_HR', 'ROLE_ADMIN', 'COMPANY_ADMIN', 'SYSTEM_ADMIN'];
  if (roleNames.some(r => hrRoles.includes(r))) return true;

  // Kiểm tra permissions liên quan đến WORK_SHIFT
  const shiftPerms = ['FULL_ACCESS', 'WORK_SHIFT_FULL', 'WORK_SHIFT_CREATE', 'WORK_SHIFT_UPDATE', 'WORK_SHIFT_DELETE', 'WORK_SHIFT_WRITE'];
  return permNames.some(p => shiftPerms.includes(p));
});

// ─── State ───────────────────────────────────────────────────────────────────
const searchQuery       = ref('');
const statusFilter      = ref('ALL');
const isLoading         = ref(false);
const isSaving          = ref(false);
const activeActionShift = ref(null);
const menuPos           = reactive({ top: '0px', left: '0px' });

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  totalElements: 0,
  totalPages: 1,
});

const toast       = reactive({ show: false, message: '', type: 'success' });
const deleteModal = reactive({ show: false, targetId: null });
const shiftModal  = reactive({ show: false, mode: 'create' });

const defaultForm = () => ({
  id: null,
  shiftCode: '',
  shiftName: '',
  checkInTime: '08:00',
  checkOutTime: '17:00',
  breakStart: '12:00',
  breakEnd: '13:00',
  gracePeriod: 15,
  isOvernight: false,
  status: 'ACTIVE',
  workingPoints: 1.0,
});

// Time options: 00:00 → 23:30 in 30-min steps
const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

const form = ref(defaultForm());

// ─── Computed ─────────────────────────────────────────────────────────────────
const shifts = computed(() => workShiftStore.shifts);

const filteredShifts = computed(() => {
  let list = shifts.value || [];
  const q = searchQuery.value.toLowerCase().trim();
  if (q) {
    list = list.filter(s =>
        (s.name || s.shiftName)?.toLowerCase().includes(q) ||
        s.shiftCode?.toLowerCase().includes(q)
    );
  }
  if (statusFilter.value !== 'ALL') {
    list = list.filter(s => {
      const isActive = s.status === true || s.status === 'ACTIVE';
      return statusFilter.value === 'ACTIVE' ? isActive : !isActive;
    });
  }
  return list;
});

const stats = computed(() => {
  const list       = shifts.value || [];
  const activeList = list.filter(s => s.status === true || s.status === 'ACTIVE');
  const nightList  = activeList.filter(s => s.isOvernight);
  return {
    total:        activeList.length,
    day:          activeList.length - nightList.length,
    night:        nightList.length,
    defaultShift: list[0] || null,
  };
});

// ─── Timeline helpers ─────────────────────────────────────────────────────────
const toMinutes = (t) => {
  if (!t) return null;
  const timeOnly = isoToTime(t);
  if (!timeOnly) return null;
  const [h, m] = timeOnly.split(':').map(Number);
  return h * 60 + (m || 0);
};

const resolveMinutes = (timeStr, checkIn, isOvernight) => {
  const raw = toMinutes(timeStr);
  if (raw === null) return null;
  if (isOvernight && raw < checkIn) return raw + 1440;
  return raw;
};

const pctCalc = (val, rangeStart, rangeSpan) =>
    Math.max(0, Math.min(100, ((val - rangeStart) / rangeSpan) * 100));

const getBarStyle = (shift) => {
  const ci = toMinutes(shift.startTime || shift.checkInTime);
  const co = resolveMinutes(shift.endTime || shift.checkOutTime, ci, shift.isOvernight);
  if (ci === null || co === null) return {};
  const rangeStart = Math.max(0, ci - 60);
  const rangeEnd   = co + 60;
  const rangeSpan  = rangeEnd - rangeStart;
  return {
    left:  pctCalc(ci, rangeStart, rangeSpan) + '%',
    width: Math.max(2, pctCalc(co, rangeStart, rangeSpan) - pctCalc(ci, rangeStart, rangeSpan)) + '%',
  };
};

const getBreakBarStyle = (shift) => {
  const bsVal = shift.breakStartTime || shift.breakStart;
  const beVal = shift.breakEndTime || shift.breakEnd;
  if (!bsVal || !beVal) return null;
  const ci = toMinutes(shift.startTime || shift.checkInTime);
  const co = resolveMinutes(shift.endTime || shift.checkOutTime, ci, shift.isOvernight);
  const bs = resolveMinutes(bsVal, ci, shift.isOvernight);
  const be = resolveMinutes(beVal, ci, shift.isOvernight);
  if (ci === null || co === null || bs === null || be === null) return null;
  const rangeStart = Math.max(0, ci - 60);
  const rangeEnd   = co + 60;
  const rangeSpan  = rangeEnd - rangeStart;
  return {
    left:  pctCalc(bs, rangeStart, rangeSpan) + '%',
    width: Math.max(1, pctCalc(be, rangeStart, rangeSpan) - pctCalc(bs, rangeStart, rangeSpan)) + '%',
  };
};

const PREVIEW_SPAN = 24 * 60; // 1440 mins (24 hours)

const timelineLabels = computed(() => {
  const labels = [];
  for (let i = 0; i <= PREVIEW_SPAN; i += 4 * 60) {
    const h = Math.floor(i / 60);
    const timeStr = h === 24 ? '24:00' : h.toString().padStart(2, '0') + ':00';
    labels.push({ time: timeStr, pct: (i / PREVIEW_SPAN) * 100 });
  }
  return labels;
});

const timelineBlocks = computed(() => {
  const f  = form.value;
  const ci = toMinutes(f.checkInTime);
  const co = resolveMinutes(f.checkOutTime, ci, f.isOvernight);
  const bs = resolveMinutes(f.breakStart, ci, f.isOvernight);
  const be = resolveMinutes(f.breakEnd, ci, f.isOvernight);

  const p = (v) => Math.max(0, Math.min(100, (v / PREVIEW_SPAN) * 100));

  return {
    working:    ci !== null && co !== null ? { left: p(ci), width: Math.max(1, p(co) - p(ci)) } : null,
    breakBlock: bs !== null && be !== null ? { left: p(bs), width: Math.max(1, p(be) - p(bs)) } : null,
    grace:      ci !== null && f.gracePeriod ? { left: p(ci + Number(f.gracePeriod)) } : null,
  };
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const timeToIso = (timeStr) => {
  if (!timeStr) return null;
  const parts = timeStr.split(':');
  const h = (parts[0] || '00').padStart(2, '0');
  const m = (parts[1] || '00').padStart(2, '0');
  return `2000-01-01T${h}:${m}:00Z`;
};

const isoToTime = (isoStr) => {
  if (!isoStr) return '';
  if (typeof isoStr === 'string' && isoStr.includes('T')) {
    const timePart = isoStr.split('T')[1];
    const parts = timePart.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  return isoStr;
};

const formatTime = (t) => {
  if (!t) return '—';
  const timeOnly = isoToTime(t);
  if (!timeOnly) return '—';
  const [h, m] = timeOnly.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12    = h % 12 === 0 ? 12 : h % 12;
  return `${h12.toString().padStart(2, '0')}:${(m || 0).toString().padStart(2, '0')} ${period}`;
};

const triggerToast = (message, type = 'success') => {
  Object.assign(toast, { message, type, show: true });
  setTimeout(() => { toast.show = false; }, 3500);
};

const toggleActionMenu = (shift, event) => {
  if (activeActionShift.value?.id === shift.id) {
    activeActionShift.value = null;
    return;
  }
  const rect = event.currentTarget.getBoundingClientRect();
  const menuWidth = 144; // 144px corresponds to w-36
  const menuHeight = 125; // approx height of menu dropdown

  // If opening downwards overflows the viewport, pop upwards above the button
  if (rect.bottom + menuHeight + 8 > window.innerHeight) {
    menuPos.top = `${Math.max(8, rect.top - menuHeight - 4)}px`;
  } else {
    menuPos.top = `${rect.bottom + 4}px`;
  }

  menuPos.left = `${rect.right - menuWidth}px`;
  activeActionShift.value = shift;
};

const closeActionMenu = () => {
  activeActionShift.value = null;
};

const handleWindowEvents = () => {
  if (activeActionShift.value) {
    closeActionMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleWindowEvents);
  window.addEventListener('scroll', handleWindowEvents, true);
  window.addEventListener('resize', handleWindowEvents);
  loadShifts(0);
});

onUnmounted(() => {
  document.removeEventListener('click', handleWindowEvents);
  window.removeEventListener('scroll', handleWindowEvents, true);
  window.removeEventListener('resize', handleWindowEvents);
});

// ─── Data loading ─────────────────────────────────────────────────────────────
const loadShifts = async (page = 0) => {
  isLoading.value = true;
  try {
    const res = await workShiftStore.fetchShifts(page, pagination.pageSize);
    pagination.pageNo        = res.data.pageNo + 1;
    pagination.pageSize      = res.data.pageSize;
    pagination.totalElements = res.data.totalElements;
    pagination.totalPages    = res.data.totalPages;
  } catch {
    triggerToast('Failed to load work shift data.', 'error');
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (page) => {
  pagination.pageNo = page;
  loadShifts(page - 1);
};

// ─── Modal ────────────────────────────────────────────────────────────────────
const openShiftModal = (mode, shiftData = null) => {
  shiftModal.mode = mode;
  if (shiftData) {
    form.value = {
      id: shiftData.id,
      shiftCode: shiftData.shiftCode || '',
      shiftName: shiftData.name || shiftData.shiftName || '',
      checkInTime: isoToTime(shiftData.startTime || shiftData.checkInTime) || '08:00',
      checkOutTime: isoToTime(shiftData.endTime || shiftData.checkOutTime) || '17:00',
      breakStart: isoToTime(shiftData.breakStartTime || shiftData.breakStart) || '12:00',
      breakEnd: isoToTime(shiftData.breakEndTime || shiftData.breakEnd) || '13:00',
      gracePeriod: shiftData.gracePeriodMinutes ?? shiftData.gracePeriod ?? 15,
      isOvernight: false,
      status: shiftData.status === true || shiftData.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
      workingPoints: 1.0,
    };
  } else {
    form.value = defaultForm();
  }
  shiftModal.show = true;
};

const closeShiftModal = () => {
  shiftModal.show = false;
  form.value      = defaultForm();
};

const handleSave = async () => {
  if (!form.value.shiftCode || !form.value.shiftName) {
    triggerToast('Please fill in Shift Code and Shift Name.', 'error'); return;
  }
  if (!form.value.checkInTime || !form.value.checkOutTime) {
    triggerToast('Please set Check-in and Check-out times.', 'error'); return;
  }
  isSaving.value = true;
  try {
    if (shiftModal.mode === 'create') {
      const payload = {
        shiftCode:          form.value.shiftCode,
        name:               form.value.shiftName,
        startTime:          timeToIso(form.value.checkInTime),
        endTime:            timeToIso(form.value.checkOutTime),
        breakStartTime:     timeToIso(form.value.breakStart),
        breakEndTime:       timeToIso(form.value.breakEnd),
        gracePeriodMinutes: form.value.gracePeriod ?? 5,
      };
      await workShiftStore.createShift(payload);
      triggerToast('Work shift created successfully!', 'success');
    } else {
      const payload = {
        name:               form.value.shiftName,
        startTime:          timeToIso(form.value.checkInTime),
        endTime:            timeToIso(form.value.checkOutTime),
        breakStartTime:     timeToIso(form.value.breakStart),
        breakEndTime:       timeToIso(form.value.breakEnd),
        gracePeriodMinutes: form.value.gracePeriod ?? 5,
        status:             form.value.status === 'ACTIVE',
      };
      await workShiftStore.updateShift(form.value.id, payload);
      triggerToast('Work shift updated successfully!', 'success');
    }
    closeShiftModal();
    loadShifts(pagination.pageNo - 1);
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Error saving work shift.', 'error');
  } finally {
    isSaving.value = false;
  }
};

const handleToggleStatus = async (shift) => {
  try {
    const isCurrentlyActive = shift.status === true || shift.status === 'ACTIVE';
    const payload = {
      name:               shift.name || shift.shiftName,
      startTime:          shift.startTime || timeToIso(shift.checkInTime),
      endTime:            shift.endTime || timeToIso(shift.checkOutTime),
      breakStartTime:     shift.breakStartTime || timeToIso(shift.breakStart),
      breakEndTime:       shift.breakEndTime || timeToIso(shift.breakEnd),
      gracePeriodMinutes: shift.gracePeriodMinutes ?? shift.gracePeriod ?? 5,
      status:             !isCurrentlyActive
    };
    await workShiftStore.updateShift(shift.id, payload);
    triggerToast(`Shift status updated to ${!isCurrentlyActive ? 'ACTIVE' : 'INACTIVE'}`, 'success');
    loadShifts(pagination.pageNo - 1);
  } catch (err) {
    triggerToast(err.response?.data?.message || 'Failed to update status.', 'error');
  }
};

// ─── Delete ───────────────────────────────────────────────────────────────────
const handleDelete = (id) => {
  deleteModal.targetId = id;
  deleteModal.show     = true;
};

const handleCancelDelete = () => {
  deleteModal.show     = false;
  deleteModal.targetId = null;
};

const handleConfirmDelete = async () => {
  if (!deleteModal.targetId) return;
  try {
    await workShiftStore.deleteShift(deleteModal.targetId);
    handleCancelDelete();
    triggerToast('Work shift deleted successfully!', 'success');
    loadShifts(pagination.pageNo - 1);
  } catch (err) {
    handleCancelDelete();
    triggerToast(err.response?.data?.message || 'Error deleting work shift.', 'error');
  }
};
</script>

