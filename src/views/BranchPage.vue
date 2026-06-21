<template>
  <MainContent>
    <div class="w-full space-y-6 pt-4 px-6 text-slate-700 relative">

      <!-- TOAST THÔNG BÁO THƯỜNG (Thành công / Thất bại) -->
      <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show"></ToastMessage>

      <!-- ĐÃ THAY THẾ: Sử dụng ModelGeneric xịn sò làm Dialog xác nhận xóa chính giữa màn hình -->
      <ModalGeneric
          v-model="deleteModal.show"
          title="Delete Branch"
          width="440px"
          :closeOnBackdrop="true"
      >
        <!-- Phần Body lọt vào default slot -->
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
            <HelpCircle class="w-5 h-5" />
          </div>
          <div class="space-y-1">
            <p class="text-sm text-slate-600 font-normal leading-relaxed">
              Are you sure you want to delete this branch?
            </p>
            <p class="text-xs text-slate-400 font-light">
              This action cannot be undone and all associated employee assignments might be affected.
            </p>
          </div>
        </div>

        <!-- Phần nút bấm lọt vào slot name="footer" -->
        <template #footer>
          <button
              @click="handleCancelDelete"
              class="px-4 py-2 border border-slate-200 text-xs font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
              @click="handleConfirmDelete"
              class="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            Delete Branch
          </button>
        </template>
      </ModalGeneric>

      <!-- THANH TIÊU ĐỀ -->
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Branches</h1>
          <span class="bg-slate-100 text-slate-700 px-2 py-0.5 text-xs font-bold rounded-md border border-slate-200 shadow-sm">
            {{ pagination.totalElements }}
          </span>
        </div>

        <div class="flex items-center gap-4 sm:ml-auto">
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-500 font-light">Status:</span>
            <select
                v-model="statusFilter"
                class="bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-black cursor-pointer shadow-sm min-w-36"
            >
              <option value="ALL">All Branches</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div class="w-36">
            <PrimaryButton @click="openDrawer('create')" content="+ Add Branch" />
          </div>
        </div>
      </div>

      <!-- THANH TÌM KIẾM -->
      <div class="relative w-100 flex items-center">
        <span class="absolute left-3 text-slate-400 select-none text-sm"> <Search class="w-4 h-4" /> </span>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Filter branches..."
            class="w-full h-10 bg-white border border-slate-200 pl-10 pr-4 rounded-lg outline-none focus:border-black text-sm transition-colors placeholder:text-slate-400 shadow-sm block"
        />
      </div>

      <!-- BẢNG DỮ LIỆU -->
      <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden w-full">
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="bg-slate-50/70 border-b border-slate-200 text-xs uppercase font-semibold tracking-wider text-slate-500">
              <th class="px-6 py-4">Branch Code</th>
              <th class="px-6 py-4">Name</th>
              <th class="px-6 py-4">Field</th>
              <th class="px-6 py-4">Website</th>
              <th class="px-6 py-4">Location</th>
              <th class="px-6 py-4 text-center">Hours/Day</th>
              <th class="px-6 py-4 text-center">Status</th>
              <th class="px-6 py-4 text-center">Actions</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-sm text-slate-700">
            <tr v-if="isLoading">
              <td colspan="8" class="px-6 py-12 text-center text-slate-400 font-light animate-pulse">Loading branches data...</td>
            </tr>
            <tr v-else-if="filteredBranches.length === 0">
              <td colspan="8" class="px-6 py-12 text-center text-slate-400 font-light">No branches found.</td>
            </tr>
            <tr
                v-else
                v-for="branch in filteredBranches"
                :key="branch.id"
                class="hover:bg-slate-50/60 transition-colors"
            >
              <td class="px-6 py-4 font-mono text-blue-600 font-medium text-xs">
                {{ branch.branchCode }}
              </td>
              <td class="px-6 py-4 font-semibold text-slate-900">{{ branch.name }}</td>
              <td class="px-6 py-4 text-slate-500 font-light">{{ branch.field }}</td>
              <td class="px-6 py-4 text-blue-500 font-light truncate max-w-xs">
                <a :href="branch.website" target="_blank" class="hover:underline">{{ branch.website || '—' }}</a>
              </td>
              <td class="px-6 py-4 text-slate-500 font-light max-w-md truncate" :title="branch.address">
                {{ branch.address || '—' }}
              </td>
              <td class="px-6 py-4 text-center font-mono text-slate-600">
                {{ branch.standardHoursPerDay }}
              </td>
              <td class="px-6 py-4 text-center">
                <StatusBadge :content="branch.status" :type="branch.status" />
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-4">
                  <button
                      @click="openDrawer('edit', branch)"
                      class="text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                      title="Edit Details"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                      @click="handleDelete(branch.id)"
                      class="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- PHÂN TRANG -->
      <PaginationSection
          :page-size="pagination.pageSize"
          :current-page="pagination.pageNo"
          :item-label="'Branches'"
          :total-items="pagination.totalElements"
          :total-page="pagination.totalPages"
          @changePage="handlePageChange"
      />

      <!-- DRAWER OVERLAY -->
      <div v-if="isDrawerOpen" class="fixed inset-0 z-[100] overflow-hidden flex justify-end">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity" @click="closeDrawer"></div>

        <div class="relative w-96 max-w-full bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-2xl h-full z-10 animate-in slide-in-from-right">

          <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h3 class="text-lg font-semibold text-slate-900">
              {{ drawerMode === 'create' ? 'Create Branch' : 'Edit Branch' }}
            </h3>
            <button @click="closeDrawer" class="text-slate-400 hover:text-slate-900 text-xl font-light cursor-pointer transition-colors">&times;</button>
          </div>

          <div class="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
            <div class="space-y-1">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Branch Name</label>
              <input
                  v-model="form.name"
                  type="text"
                  placeholder="London Central"
                  class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Field</label>
                <input
                    v-model="form.field"
                    type="text"
                    placeholder="Logistics"
                    class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm"
                />
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Standard Hours</label>
                <input
                    v-model.number="form.standardHoursPerDay"
                    type="number"
                    placeholder="8"
                    class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Website</label>
              <input
                  v-model="form.website"
                  type="text"
                  placeholder="https://domixi.com"
                  class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm"
              />
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location Address</label>
              <textarea
                  v-model="form.address"
                  rows="4"
                  placeholder="Enter full address..."
                  class="w-full border border-slate-200 px-3 py-2 rounded-lg outline-none focus:border-black text-sm resize-none"
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operational Status</label>
              <div class="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    @click="form.status = 'ACTIVE'"
                    :class="[
                        'py-2 text-sm font-medium border rounded-lg transition-all text-center cursor-pointer',
                        form.status === 'ACTIVE'
                            ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-sm font-semibold'
                            : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    ]"
                >
                  Active
                </button>
                <button
                    type="button"
                    @click="form.status = 'CLOSED'"
                    :class="[
                        'py-2 text-sm font-medium border rounded-lg transition-all text-center cursor-pointer',
                        form.status === 'CLOSED'
                            ? 'bg-red-50 border-red-600 text-red-600 shadow-sm font-semibold'
                            : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    ]"
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          <div class="border-t border-slate-100 pt-4 mt-4 space-y-2">
            <PrimaryButton
                @click="handleSave"
                :content="drawerMode === 'create' ? 'Create Branch' : 'Save Changes'"
            />
            <SecondaryButton
                @click="closeDrawer"
                content="Cancel"
            />
          </div>

        </div>
      </div>

    </div>
  </MainContent>
</template>

<script setup>
import MainContent from '../components/MainContent.vue'
import { ref, computed, onMounted, reactive } from 'vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import StatusBadge from '../components/StatusBadge.vue';
import PaginationSection from "../components/PaginationSection.vue";
import ToastMessage from '../components/ToastMessage.vue';
import ModalGeneric from '../components/ModalGeneric.vue';
import { useBranchStore } from '../store/branchStore.js';
import { Pencil, Trash2, HelpCircle, Search } from '@lucide/vue';

const branchStore = useBranchStore()

const searchQuery = ref('');
const statusFilter = ref('ALL');
const isDrawerOpen = ref(false);
const drawerMode = ref('create');
const isLoading = ref(false);

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  totalElements: 0,
  totalPages: 1
})

const toast = reactive({
  show: false,
  message: '',
  type: 'success'
});

// Cấu hình lại biến kiểm soát trạng thái Modal xác nhận xóa
const deleteModal = reactive({
  show: false,
  targetId: null
});

const triggerToast = (message, type = 'success') => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 3500);
};

const branches = computed(() => branchStore.branches)

const form = ref({
  name: '',
  field: '',
  website: '',
  address: '',
  standardHoursPerDay: 8,
  status: 'ACTIVE'
});

const loadBranchesData = async (page = 0) => {
  isLoading.value = true
  try {
    const res = await branchStore.fetchBranches(page, pagination.pageSize)
    pagination.pageNo = res.data.pageNo + 1
    pagination.pageSize = res.data.pageSize
    pagination.totalElements = res.data.totalElements
    pagination.totalPages = res.data.totalPages
  } catch (err) {
    triggerToast("Failed to load branches from system.", "error");
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadBranchesData(0);
});

const handlePageChange = (targetPage) => {
  pagination.pageNo = targetPage
  loadBranchesData(targetPage - 1)
}

// Bấm nút xóa: Kích hoạt hiện ModelGeneric chính giữa màn hình
const handleDelete = (id) => {
  deleteModal.targetId = id;
  deleteModal.show = true;
};

// Người dùng bấm nút đỏ "Delete Branch" bên trong ModelGeneric
const handleConfirmDelete = async () => {
  if (deleteModal.targetId) {
    try {
      await branchStore.deleteBranchLocal(deleteModal.targetId)
      pagination.totalElements = Math.max(0, pagination.totalElements - 1)
      pagination.totalPages = Math.ceil(pagination.totalElements / pagination.pageSize) || 1

      handleCancelDelete(); // Đóng Modal

      // Hiện thông báo đen thành công chuẩn chỉ của dự án
      triggerToast("Branch info deleted successfully!", "success");

      if (filteredBranches.value.length === 0 && pagination.pageNo > 1) {
        handlePageChange(pagination.pageNo - 1)
      }
    } catch (error) {
      handleCancelDelete();
      triggerToast("Error deleting branch resources.", "error");
    }
  }
};

// Hủy bỏ thao tác xóa
const handleCancelDelete = () => {
  deleteModal.show = false;
  deleteModal.targetId = null;
};

const filteredBranches = computed(() => {
  let list = branches.value;

  if (statusFilter.value !== 'ALL') {
    const mappedStatus = statusFilter.value === 'INACTIVE' ? 'CLOSED' : 'ACTIVE';
    list = list.filter(b => b.status === mappedStatus);
  }

  if (!searchQuery.value.trim()) {
    return list;
  }
  const query = searchQuery.value.toLowerCase();
  return list.filter(b =>
      b.name?.toLowerCase().includes(query) ||
      b.field?.toLowerCase().includes(query) ||
      b.branchCode?.toLowerCase().includes(query)
  );
});

const openDrawer = (mode, branchData = null) => {
  drawerMode.value = mode;
  if (mode === 'edit' && branchData) {
    form.value = { ...branchData };
  } else {
    form.value = {
      name: '',
      field: '',
      website: '',
      address: '',
      standardHoursPerDay: 8,
      status: 'ACTIVE'
    };
  }
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const handleSave = async () => {
  if (!form.value.name || !form.value.field) {
    triggerToast("Please enter a Branch Name and Field.", "error");
    return;
  }

  try {
    if (drawerMode.value === 'create') {
      await branchStore.createBranch({
        name: form.value.name,
        field: form.value.field,
        website: form.value.website,
        address: form.value.address,
        standardHoursPerDay: form.value.standardHoursPerDay || 8
      });
      triggerToast("Branch created successfully!", "success");
    } else if (drawerMode.value === 'edit') {
      await branchStore.updateBranch(form.value.id, {
        name: form.value.name,
        field: form.value.field,
        website: form.value.website,
        address: form.value.address,
        standardHoursPerDay: form.value.standardHoursPerDay,
        status: form.value.status
      });
      triggerToast("Branch info updated successfully!", "success");
    }
    closeDrawer();
    loadBranchesData(pagination.pageNo - 1);
  } catch (error) {
    triggerToast(error.response?.data?.message || "Error saving branch resources.", "error");
  }
};
</script>

<style scoped>
.animate-in {
  animation-duration: 220ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-fill-mode: forwards;
}
.slide-in-from-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>