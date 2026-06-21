<template>
  <MainContent>
    <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans antialiased text-slate-900 relative">
      <ToastMessage :type="toast.type" :message="toast.message" :show="toast.show"></ToastMessage>


      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-start gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-semibold text-slate-900 tracking-tight mb-1">Positions</h1>
          <nav class="flex items-center gap-1.5 text-xs text-slate-400 font-light">
            <span class="hover:text-slate-600 cursor-pointer transition-colors">Organization</span>
            <span>&gt;</span>
            <span class="text-slate-600 font-normal">Positions</span>
          </nav>
        </div>

        <div class="w-auto min-w-[120px]">
          <PrimaryButton :content="'+ Add Position'" @click="openModal" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Total
            Positions</span>
          <span class="text-4xl font-semibold text-slate-900 tracking-tight">{{ totalPositions }}</span>
        </div>

        <div
          class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Open
            Vacancies</span>
          <span class="text-4xl font-semibold text-slate-900 tracking-tight">{{ openVacancies }}</span>
        </div>

        <div
          class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Avg. Tenure</span>
          <span class="text-4xl font-semibold text-slate-900 tracking-tight">2.4y</span>
        </div>
      </div>

      <div class="bg-white border border-slate-200/90 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div class="w-full">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/70 border-b border-slate-200/80">
                <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[35%]">
                  Position Name</th>
                <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[40%]">
                  Description</th>
                <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[15%]">Created
                  At</th>
                <th
                  class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[10%] text-right">
                  Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="positions.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-slate-400 font-light">No positions found.</td>
              </tr>
              <tr v-for="(position, index) in positions" :key="index"
                class="hover:bg-slate-50/40 transition-colors group">
                <td class="py-5 px-6">
                  <span
                    class="font-bold text-slate-900 text-[15px] tracking-tight group-hover:text-black transition-colors">{{
                      position.name }}</span>
                </td>

                <td class="py-5 px-6 text-sm text-slate-400 font-light max-w-xs truncate animate-fade"
                  :title="position.description">
                  {{ position.description || 'No description provided' }}
                </td>

                <td class="py-5 px-6 text-xs md:text-sm text-slate-500 font-light whitespace-nowrap">
                  {{ position.createdAt }}
                </td>

                <td class="py-5 px-6 text-right relative">
                  <button
                    @click.stop="toggleDropdown(position.id)"
                    class="text-slate-400 hover:text-black p-2 rounded-full hover:bg-slate-100 transition-all duration-200 cursor-pointer focus:outline-none flex items-center justify-center"
                    title="Actions">
                    <MoreVertical class="w-5 h-5" />
                  </button>

                  <div v-if="activeDropdownId === position.id"
                    class="absolute right-6 mt-1 w-24 bg-white border border-slate-200/90 rounded-lg shadow-xl z-50 py-1 text-left">
                    <button type="button" @click="viewDetails(position)"
                      class="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer">
                      <Eye class="w-3.5 h-3.5" /> Detail
                    </button>
                    <button type="button" @click="openEditModal(position)"
                      class="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer">
                      <Pencil class="w-3.5 h-3.5" /> Edit
                    </button>
                    <button type="button" @click="confirmDelete(position.id)"
                      class="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer">
                      <Trash2 class="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-6">
        <PaginationSection
          :current-page="currentPage + 1"
          :total-items="totalPositions"
          :total-page="totalPages"
          :page-size="pageSize"
          :item-label="'positions'"
          @changePage="(page) => loadPositions(page - 1)"
        />
      </div>

    </div>
  </MainContent>

  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[999] grid place-items-center p-4 overflow-y-auto">

      <div class="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm transition-opacity duration-300" @click="closeModal">
      </div>


      <div
        class="bg-white border border-slate-200 rounded-xl custom-modal-card relative z-[1000] overflow-hidden shadow-xl transform transition-all duration-300 scale-100 flex flex-col my-8">


        <div class="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white">
          <h2 class="text-[17px] font-semibold text-slate-900 tracking-tight">
            {{ modalMode === 'create' ? 'Add New Position' : (modalMode === 'edit' ? 'Update Position' : 'Position Details') }}
          </h2>
          <button @click="closeModal" class="text-slate-400 hover:text-black p-1 rounded-md transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
              stroke="currentColor" class="w-4.5 h-4.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleSubmit" class="bg-white">
          <div class="p-6 space-y-6">
            <div>
              <label for="position_name"
                class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Position Name</label>
              <input type="text" id="position_name" v-model="form.name" placeholder="e.g. Senior Frontend Developer"
                class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                :disabled="modalMode === 'view'"
                required />
            </div>

            <div>
              <label for="description"
                class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
              <textarea id="description" v-model="form.description" rows="4"
                placeholder="Briefly describe the key responsibilities..."
                class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                :disabled="modalMode === 'view'"></textarea>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
            <button type="button" @click="closeModal"
              class="px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-md transition-all duration-150">
              {{ modalMode === 'view' ? 'Close' : 'Cancel' }}
            </button>
            <button v-if="modalMode !== 'view'" type="submit"
              class="bg-black hover:bg-slate-900 text-white text-xs font-semibold py-2.5 px-5 rounded-md transition-all duration-200 shadow-sm active:scale-[0.98]">
              {{ modalMode === 'create' ? 'Save Position' : 'Update Position' }}
            </button>
          </div>
        </form>

      </div>
    </div>
  </Teleport>

  <ModalGeneric
    v-model="isDeleteModalOpen"
    title="Confirm Delete"
    width="440px"
  >
    <div class="space-y-3">
      <p class="text-sm text-slate-500 font-light leading-relaxed">
        Are you sure you want to delete this position? This action cannot be undone.
      </p>
    </div>
    <template #footer>
      <button
        type="button"
        @click="isDeleteModalOpen = false"
        class="px-4 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-md transition-all duration-150 cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="button"
        @click="handleConfirmDelete"
        class="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2 px-4 rounded-md transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
      >
        Delete
      </button>
    </template>
  </ModalGeneric>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { MoreVertical, Eye, Pencil, Trash2 } from '@lucide/vue';
import { storeToRefs } from 'pinia';
import MainContent from "../components/MainContent.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import ToastMessage from "../components/ToastMessage.vue";
import PaginationSection from "../components/PaginationSection.vue";
import ModalGeneric from "../components/ModalGeneric.vue";
import { usePositionStore } from "../store/positionStore.js";

// 1. Khởi tạo store
const positionStore = usePositionStore();

// 2. Kéo dữ liệu từ Store ra để hiển thị lên giao diện
// Dùng storeToRefs để đảm bảo tính react (dữ liệu thay đổi thì giao diện đổi theo)
const { positions, totalPositions, openVacancies } = storeToRefs(positionStore);

const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const positionIdToDelete = ref(null);
const modalMode = ref('create'); // 'create', 'edit', 'view'

const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(1);

const activeDropdownId = ref(null);

const toast = reactive({
  show: false,
  message: '',
  type: 'success'
});

const showToast = (message, type = 'success') => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 3000);
};

const loadPositions = async (page = 0) => {
  try {
    const res = await positionStore.fetchPositions(page, pageSize.value);
    currentPage.value = res.data.pageNo;
    totalPages.value = res.data.totalPages;
  } catch (error) {
    console.error("Error loading positions:", error);
  }
};

const toggleDropdown = (id) => {
  activeDropdownId.value = activeDropdownId.value === id ? null : id;
};

const closeDropdown = () => {
  activeDropdownId.value = null;
};

onMounted(async () => {
  await loadPositions(0);
  window.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  window.removeEventListener('click', closeDropdown);
});

const form = ref({
  id: null,
  name: '',
  description: ''
});

const openModal = () => {
  modalMode.value = 'create';
  form.value = {
    id: null,
    name: '',
    description: ''
  };
  isModalOpen.value = true;
};

const openEditModal = (position) => {
  modalMode.value = 'edit';
  form.value = {
    id: position.id,
    name: position.name,
    description: position.description
  };
  isModalOpen.value = true;
};

const viewDetails = (position) => {
  modalMode.value = 'view';
  form.value = {
    id: position.id,
    name: position.name,
    description: position.description
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  form.value = { 
    id: null,
    name: '', 
    description: '' 
  };
};

const confirmDelete = (id) => {
  positionIdToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = async () => {
  if (!positionIdToDelete.value) return;
  const result = await positionStore.deletePosition(positionIdToDelete.value);
  if (result.success) {
    showToast("Position deleted successfully!", "success");
    await loadPositions(currentPage.value);
  } else {
    showToast("Error: " + result.message, "error");
  }
  isDeleteModalOpen.value = false;
  positionIdToDelete.value = null;
};

// 3. Hàm gọi API thông qua Store
const handleSubmit = async () => {
  if (!form.value.name || !form.value.description) {
    showToast("Please fill in all required fields!", "error");
    return;
  }

  if (modalMode.value === 'create') {
    const result = await positionStore.createPosition({
      name: form.value.name,
      description: form.value.description
    });

    if (result.success) {
      showToast("Position created successfully!", "success");
      closeModal();
      await loadPositions(currentPage.value);
    } else {
      showToast("Error: " + result.message, "error");
    }
  } else if (modalMode.value === 'edit') {
    const result = await positionStore.updatePosition(form.value.id, {
      name: form.value.name,
      description: form.value.description
    });

    if (result.success) {
      showToast("Position updated successfully!", "success");
      closeModal();
      await loadPositions(currentPage.value);
    } else {
      showToast("Error: " + result.message, "error");
    }
  }
};
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-modal-card {
  width: 100% !important;
  max-width: 520px !important;
  min-width: 280px !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>