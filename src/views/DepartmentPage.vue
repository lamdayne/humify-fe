<template>
  <MainContent>
    <div class="p-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-semibold">
            Department Management
          </h1>
          <p class="text-gray-500 mt-1">
            Manage departments across branches
          </p>
        </div>

        <div class="w-44">
          <PrimaryButton content="Add Department" @click="openModal">
            <template #icon>
              <Plus class="w-5"></Plus>
            </template>
          </PrimaryButton>
        </div>
      </div>

      <!-- branch filter -->

      <div class="bg-white border border-gray-100 rounded-lg shadow-sm mb-6">
        <div class="p-6">

          <label class="block text-sm font-medium mb-2">
            Branch
          </label>

          <select v-model="selectedBranchId" @change="handleBranchChange" class="w-full h-11 border border-slate-200 rounded-lg px-3
           focus:ring-2 focus:ring-black outline-none">
            <option :value="null">
              Select Branch
            </option>

            <option v-for="branch in branches" :key="branch.id" :value="branch.id">
              {{ branch.name }}
            </option>
          </select>

        </div>
      </div>

      <div class="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/70 border-b border-slate-200/80">
                <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[20%]">
                  Name
                </th>
                <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[30%]">
                  Description
                </th>
                <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[30%]">
                  Branch
                </th>

                <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[30%]">
                  Created
                </th>
                <th
                  class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[10%] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="department in departments" :key="department.id" class="hover:bg-slate-50">
                <td class="px-6 py-4">
                  <div class="font-medium">
                    {{ department.name }}
                  </div>
                </td>

                <td class="px-6 py-4 text-slate-500 max-w-sm">
                  <div class="truncate">
                    {{ department.description || '-' }}
                  </div>

                </td>

                <td class="px-6 py-4">
                  {{ getBranchName(department.branchId) }}
                </td>

                <td class="px-6 py-4 text-slate-500">
                  {{ formatDate(department.createdAt) }}
                </td>

                <td class="px-6 py-4">
                  <div class="flex justify-end gap-2">
                    <SecondaryButton content="View" @click="handleViewDepartment(department)" />
                    <PrimaryButton content="Edit" @click="openEditModal(department)" />
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-if="loading">
              <tr>
                <td colspan="5" class="text-center py-10">
                  Loading departments...
                </td>
              </tr>
            </tbody>
            <tbody v-else-if="
              selectedBranchId &&
              departments &&
              departments.length === 0
            ">
              <tr>
                <td colspan="5" class="text-center py-10 text-slate-500">
                  No departments found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <PaginationSection v-model:currentPage="currentPage" :totalItems="totalItems" :totalPage="totalPages"
        :pageSize="pageSize" itemLabel="departments" @changePage="handlePageChange">
      </PaginationSection>
      <ModalGeneric v-model="isOpen" :title="'Add New Department'">
        <div class="space-y-6">
          <div>
            <label for="position_name" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Department Name
            </label>
            <input v-model="createForm.name" type="text" id="position_name" placeholder="Department Name"
              class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light"
              required />
          </div>

          <div>
            <label for="position_name" class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Branch
            </label>
            <select v-model.number="createForm.branchId"
              class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
              <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                {{ branch.name }}
              </option>

            </select>
          </div>

          <div>
            <label for="description"
              class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <textarea v-model="createForm.description" id="description" rows="4"
              placeholder="Briefly describe the key responsibilities..."
              class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light resize-none"></textarea>
          </div>
        </div>
        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton :content="'Cancel'" @click="isOpen = false"></SecondaryButton>
            <PrimaryButton :content="'Create'" @click="handleCreateDepartment"></PrimaryButton>
          </div>
        </template>

      </ModalGeneric>
      <!--view-->
      <ModalGeneric v-model="isViewOpen" title="Department Details">
        <div class="space-y-5">

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-1">
              Name
            </label>
            <div class="text-sm">
              {{ selectedDepartment.name }}
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-1">
              Description
            </label>
            <div class="text-sm text-slate-500">
              {{ selectedDepartment.description || '-' }}
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-1">
              Branch
            </label>
            <div class="text-sm">
              {{ getBranchName(selectedDepartment.branchId) }}
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-1">
              Created At
            </label>
            <div class="text-sm text-slate-500">
              {{ formatDate(selectedDepartment.createdAt) }}
            </div>
          </div>

        </div>

        <template #footer>
          <SecondaryButton content="Close" @click="isViewOpen = false" />
        </template>
      </ModalGeneric>
      <!--// edit-->
      <ModalGeneric v-model="isEditOpen" title="Edit Department">

        <div class="space-y-6">

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-2">
              Department Name
            </label>
            <input v-model="editForm.name" class="w-full border rounded-md p-3">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-2">
              Branch
            </label>

            <select v-model="editForm.branchId" class="w-full border rounded-md p-3">
              <option :value="null" disabled>
                Select Branch
              </option>
              <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                {{ branch.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-2">
              Description
            </label>

            <textarea rows="4" v-model="editForm.description" class="w-full border rounded-md p-3"></textarea>
          </div>

        </div>

        <template #footer>
          <div class="flex gap-2">
            <SecondaryButton content="Cancel" @click="isEditOpen = false" />

            <PrimaryButton content="Save" @click="handleUpdateDepartment" />
          </div>
        </template>

      </ModalGeneric>
    </div>
  </MainContent>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MainContent from "../components/MainContent.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import { Plus } from "@lucide/vue";
import SecondaryButton from "../components/SecondaryButton.vue";
import PaginationSection from "../components/PaginationSection.vue";
import ModalGeneric from "../components/ModalGeneric.vue";
import { useDepartmentStore } from "../store/departmentStore.js";
import { useBranchStore } from "../store/branchStore.js";

const branchStore = useBranchStore();
const departmentStore = useDepartmentStore();

const isOpen = ref(false);
// edit
const isEditOpen = ref(false);

const editForm = ref({
  id: null,
  branchId: null,
  name: "",
  description: ""
});

const openEditModal = (department) => {
  console.log(department);
  selectedDepartment.value = department;
  editForm.value = {
    id: department.id,
    branchId: department.branchId,
    name: department.name,
    description: department.description
  };
  isEditOpen.value = true;
};

const handleUpdateDepartment = async () => {

  try {

    await departmentStore.updateDepartment(
      editForm.value.id,
      {
        branchId: editForm.value.branchId,
        name: editForm.value.name,
        description: editForm.value.description
      }
    );

    isEditOpen.value = false;

    await loadDepartments();

  } catch (error) {

    console.log(
      "UPDATE ERROR:",
      error?.response?.data || error
    );

  }

};
//view
const openModal = () => {
  isOpen.value = true
}
const isViewOpen = ref(false);

const selectedDepartment = ref({
  id: null,
  name: "",
  description: "",
  branchId: null,
  createdAt: ""
});

const handleViewDepartment = (department) => {
  selectedDepartment.value = department;
  isViewOpen.value = true;
};

const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(0);
const totalItems = ref(0);

const branches = ref([]);
const departments = ref([]);

const selectedBranchId = ref(null);

const loading = ref(false);

const getBranchName = (branchId) => {
  const branch = branches.value.find(
    b => b.id === branchId
  );

  return branch?.name || `Branch #${branchId}`;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB");
};

const createForm = ref({
  branchId: null,
  name: "",
  description: ""
});

// goi API
const loadDepartments = async () => {
  console.log("Calling API with branchId =", selectedBranchId.value);
  if (!selectedBranchId.value) {
    departments.value = [];
    return;
  }

  loading.value = true;

  try {
    const res = await departmentStore.getDepartmentsByBranch(
      selectedBranchId.value,
      currentPage.value - 1, // backend bắt đầu từ 0
      pageSize.value
    );
    const data = res.data.data;
    departments.value = data || [];
    totalItems.value = data.length;
    totalPages.value = Math.ceil(data.length / pageSize.value);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
const handlePageChange = async (page) => {
  currentPage.value = page;
  await loadDepartments();
};

const loadBranches = async () => {
  try {
    const res = await branchStore.fetchBranches(0, 100, "id:asc");
    branches.value = branchStore.branches;
    if (branches.value.length > 0) {
      selectedBranchId.value = branches.value[0].id;
      createForm.value.branchId = branches.value[0].id;
      await handleBranchChange();
    }

  } catch (error) {
    console.log(error);
  }
};

const handleBranchChange = async () => {
  currentPage.value = 1;
  await loadDepartments();
};

onMounted(async () => {
  await loadBranches();
});

const handleCreateDepartment = async () => {
  console.log(createForm.value);


  if (!createForm.value.branchId) {
    console.log("Branch is required");
    return;
  }

  if (!createForm.value.name.trim()) {
    console.log("Name is required");
    return;
  }
  try {
    await departmentStore.createDepartment(
      createForm.value
    );

    isOpen.value = false;

    createForm.value = {
      branchId: null,
      name: "",
      description: ""
    };

    await handleBranchChange();
  } catch (error) {
    console.log("CREATE ERROR:", error?.response?.data || error);
  }
};
</script>
