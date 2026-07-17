<template>
  <MainContent>
    <div class="p-6 md:p-8 font-sans text-slate-800 w-full max-w-full">
      <ToastMessage :type="toast.type" :message="toast.message" :show="toast.show" />
      
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">Leave Types</h1>
          <div class="text-xs text-gray-500 flex items-center gap-2">
            <span>Organization</span>
            <span class="text-gray-300">></span>
            <span class="text-gray-900 font-medium">Leave Types</span>
          </div>
        </div>
        <button 
          @click="isAddModalOpen = true"
          class="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Add Leave Type
        </button>
      </div>

      <div class="border border-gray-200 rounded-lg bg-white overflow-x-auto shadow-sm">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-[#f9fafb] border-b border-gray-200 text-[11px] text-gray-500 uppercase tracking-wider font-bold">
              <th class="py-4 px-6 w-1/4">LEAVE TYPE NAME</th>
              <th class="py-4 px-6 w-1/6">PAYMENT TYPE</th>
              <th class="py-4 px-6 w-1/3">DESCRIPTION</th>
              <th class="py-4 px-6 w-1/6">CREATED AT</th>
              <th class="py-4 px-6 text-center w-32">ACTIONS</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr 
              v-for="leave in (leaveTypes || [])" 
              :key="leave.id" 
              class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors last:border-b-0"
            >
              <td class="py-4 px-6 font-bold text-gray-900">{{ leave.name }}</td>
              <td class="py-4 px-6 text-gray-700">
                <span :class="leave.isPaid ? 'bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-semibold' : 'bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-semibold'">
                  {{ leave.isPaid ? 'Paid' : 'Unpaid' }}
                </span>
              </td>
              <td class="py-4 px-6 text-gray-400 truncate max-w-[250px]">{{ leave.description }}</td>
              <td class="py-4 px-6 text-gray-500">{{ leave.createdAt || 'N/A' }}</td>
              <td class="py-4 px-6 text-center flex justify-center gap-2 mt-2">
                <button @click="openEditModal(leave)" class="text-gray-400 hover:text-black transition-colors cursor-pointer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                </button>
                <button @click="confirmDelete(leave.id)" class="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </td>
            </tr>
            <tr v-if="!leaveTypes || leaveTypes.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">
                No leave types found.
              </td>
            </tr>
          </tbody>
        </table>

        <div class="bg-[#f9fafb] px-6 py-4 border-t border-gray-200 flex justify-between items-center rounded-b-lg">
          <span class="text-xs text-gray-500 font-medium">Showing {{ leaveTypes ? leaveTypes.length : 0 }} leave types</span>
          <div class="flex gap-2">
            <button class="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors shadow-sm cursor-pointer disabled:opacity-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button class="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors shadow-sm cursor-pointer disabled:opacity-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
      
    </div>

    <div v-if="isAddModalOpen" class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      
      <div class="bg-white w-full max-w-[500px] rounded-xl shadow-2xl overflow-hidden transform transition-all">
        
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-bold text-gray-900">{{ isEdit ? 'Edit Leave Type' : 'Add Leave Type' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-black cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form @submit.prevent="submitLeaveType" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div class="col-span-2">
              <label class="block text-xs font-bold text-gray-600 tracking-wide mb-1">NAME <span class="text-red-500">*</span></label>
              <input v-model="formData.name" type="text" maxlength="100" required placeholder="e.g. Annual Leave" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm" />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-600 tracking-wide mb-1">CODE <span class="text-red-500">*</span></label>
              <input v-model="formData.code" @input="formData.code = formData.code.toUpperCase()" type="text" pattern="^[A-Z_]+$" required placeholder="e.g. ANNUAL_LEAVE" title="Chỉ cho phép chữ hoa và dấu gạch dưới"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm uppercase" />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-600 tracking-wide mb-1">MAX DAYS</label>
              <input v-model="formData.maxDays" type="number" step="0.5" min="0" placeholder="0.0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm" />
            </div>

            <div class="flex items-center gap-2 mt-2">
              <input v-model="formData.isPaid" type="checkbox" id="isPaid" class="w-4 h-4 text-black rounded border-gray-300 focus:ring-black cursor-pointer" />
              <label for="isPaid" class="text-sm font-medium text-gray-700 cursor-pointer">Paid Leave</label>
            </div>

            <div class="flex items-center gap-2 mt-2">
              <input v-model="formData.requiresAttachment" type="checkbox" id="reqAttach" class="w-4 h-4 text-black rounded border-gray-300 focus:ring-black cursor-pointer" />
              <label for="reqAttach" class="text-sm font-medium text-gray-700 cursor-pointer">Requires Attachment</label>
            </div>

            <div class="col-span-2">
              <label class="block text-xs font-bold text-gray-600 tracking-wide mb-1">DESCRIPTION</label>
              <textarea v-model="formData.description" rows="3" placeholder="Enter description..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm resize-none"></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer disabled:bg-gray-400">
              {{ isSubmitting ? 'Saving...' : (isEdit ? 'Update Leave Type' : 'Save Leave Type') }}
            </button>
          </div>
        </form>

      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white w-full max-w-[400px] rounded-xl shadow-2xl overflow-hidden transform transition-all p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
        <p class="text-sm text-gray-500 mb-6">Are you sure you want to delete this leave type? This action cannot be undone.</p>
        <div class="flex justify-end gap-3">
          <button type="button" @click="closeDeleteModal" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="button" @click="executeDelete" :disabled="isDeleting" class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer disabled:bg-red-400">
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

  </MainContent>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import MainContent from '../components/MainContent.vue';
import ToastMessage from '../components/ToastMessage.vue';
import { useLeaveTypeStore } from '../store/leaveTypeStore'; 
import { storeToRefs } from 'pinia';

// 1. Khởi tạo store
const leaveTypeStore = useLeaveTypeStore();

// 2. Lấy dữ liệu từ store
const { leaveTypes } = storeToRefs(leaveTypeStore);

// --- State Quản lý Toast ---
const toast = reactive({
  type: 'success',
  message: '',
  show: false
});

const showToast = (message, type = 'success') => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
    toast.message = '';
  }, 3000);
};

// --- State Quản lý Modal ---
const isAddModalOpen = ref(false);
const isSubmitting = ref(false);
const isEdit = ref(false);
const editId = ref(null);

// --- State Quản lý Delete Modal ---
const isDeleteModalOpen = ref(false);
const deleteId = ref(null);
const isDeleting = ref(false);

const formData = ref({
  name: '',
  code: '',
  maxDays: null,
  isPaid: false,
  requiresAttachment: false,
  description: ''
});

const openEditModal = (leave) => {
  isEdit.value = true;
  editId.value = leave.id;
  formData.value = {
    name: leave.name,
    code: leave.code,
    maxDays: leave.maxDays,
    isPaid: leave.isPaid || false,
    requiresAttachment: leave.requiresAttachment || false,
    description: leave.description || ''
  };
  isAddModalOpen.value = true;
};

const closeModal = () => {
  isAddModalOpen.value = false;
  isEdit.value = false;
  editId.value = null;
  formData.value = { name: '', code: '', maxDays: null, isPaid: false, requiresAttachment: false, description: '' };
};

// Hàm submit form (Add / Edit)
const submitLeaveType = async () => {
  // Validate name
  if (!formData.value.name || !formData.value.name.trim()) {
    showToast('Tên Leave Type không được để trống!', 'failed');
    return;
  }
  
  // Validate code
  if (!formData.value.code || !formData.value.code.trim()) {
    showToast('Mã CODE không được để trống!', 'failed');
    return;
  }
  
  const codePattern = /^[A-Z_]+$/;
  if (!codePattern.test(formData.value.code)) {
    showToast('Mã CODE chỉ được chứa chữ in hoa và dấu gạch dưới (VD: ANNUAL_LEAVE)!', 'failed');
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      ...formData.value,
      maxDays: (formData.value.maxDays !== null && formData.value.maxDays !== '') ? parseFloat(formData.value.maxDays) : null
    };

    if (isEdit.value) {
      await leaveTypeStore.updateLeaveType(editId.value, payload);
      showToast('Cập nhật Leave Type thành công!', 'success');
    } else {
      await leaveTypeStore.createLeaveType(payload);
      showToast('Thêm Leave Type thành công!', 'success');
    }
    
    closeModal();
    // Tải lại dữ liệu
    await leaveTypeStore.fetchLeaveTypes(0, 10); 
  } catch (error) {
    console.error('Lỗi khi lưu Leave Type:', error);
    showToast(error.response?.data?.message || 'Có lỗi xảy ra khi lưu!', 'failed');
  } finally {
    isSubmitting.value = false;
  }
};

// --- Logic Xoá Leave Type ---
const confirmDelete = (id) => {
  deleteId.value = id;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  deleteId.value = null;
};

const executeDelete = async () => {
  isDeleting.value = true;
  try {
    await leaveTypeStore.deleteLeaveTypeAPI(deleteId.value);
    await leaveTypeStore.deleteLeaveTypeLocal(deleteId.value);
    showToast('Xóa Leave Type thành công!', 'success');
    closeDeleteModal();
    // Tải lại dữ liệu
    await leaveTypeStore.fetchLeaveTypes(0, 10);
  } catch (error) {
    console.error('Lỗi khi xóa Leave Type:', error);
    showToast(error.response?.data?.message || 'Có lỗi xảy ra khi xóa!', 'failed');
  } finally {
    isDeleting.value = false;
  }
};

// Gọi dữ liệu lần đầu khi vào trang
onMounted(async () => {
  try {
    // Đã thêm try-catch ở đây để chống sập giao diện khi API lỗi
    await leaveTypeStore.fetchLeaveTypes(0, 10);
  } catch (error) {
    console.error("Lỗi API khi tải dữ liệu ban đầu (Có thể do chưa có Token đăng nhập):", error);
    // Nếu API lỗi, giao diện vẫn sống bình thường, bạn vẫn có thể bấm nút Add
  }
});
</script>

<style scoped>
/* Hiệu ứng trượt nhẹ lên cho Modal */
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>