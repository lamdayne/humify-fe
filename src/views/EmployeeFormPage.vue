<template>
    <MainContent>
        <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans antialiased text-slate-900 relative">

            <ToastMessage :message="toast.message" :type="toast.type" :show="toast.show"></ToastMessage>

            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-start gap-4 mb-8">
                <div>
                    <h1 class="text-3xl font-semibold text-slate-900 tracking-tight mb-1">Add Employee</h1>
                    <nav class="flex items-center gap-1.5 text-xs text-slate-400 font-light">
                        <span class="hover:text-slate-600 cursor-pointer transition-colors">Organization</span>
                        <span>&gt;</span>
                        <span class="text-slate-600 font-normal">Employee</span>
                    </nav>
                </div>
            </div>

            <form @submit.prevent="handleSave"
                class="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] p-6 md:p-10 space-y-10">

                <div class="flex flex-col md:flex-row gap-6 md:gap-8 pb-10 border-b border-slate-100">
                    <div class="w-full md:w-1/3 md:max-w-70 shrink-0">
                        <h3 class="text-base font-bold text-slate-900 tracking-tight mb-1.5">Personal Info</h3>
                        <p class="text-xs text-slate-400 font-light leading-relaxed">
                            Basic identification and contact details for the new employee record.
                        </p>
                    </div>

                    <div class="grow space-y-6">
                        <!-- Avatar Upload Section -->
                        <div class="flex items-center gap-6 pb-6 border-b border-slate-100">
                            <div class="relative w-20 h-20 rounded-full border border-slate-200/80 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                                <img v-if="form.avatarUrl" :src="form.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
                                <svg v-else class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <div v-if="isUploading" class="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Avatar Image</label>
                                <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="hidden" />
                                <div class="flex items-center gap-2">
                                    <button type="button" @click="$refs.fileInput.click()"
                                        class="px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white transition-all duration-200 shadow-sm active:scale-[0.98]">
                                        Choose File
                                    </button>
                                    <span class="text-slate-400 text-xs font-light">Max size 2MB</span>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label for="fullName"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                                <input type="text" id="fullName" v-model="form.fullName" placeholder="e.g. Jonathan Ive"
                                    :class="[
                                        errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 hover:border-slate-300 focus:border-black',
                                        'w-full border rounded-lg p-3 text-sm transition-all duration-200 outline-none placeholder:text-slate-400 font-light bg-white'
                                    ]" />
                                <span v-if="errors.fullName" class="text-[11px] text-red-500 font-normal mt-1 block">{{ errors.fullName }}</span>
                            </div>

                            <div>
                                <label for="dob"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Date
                                    of Birth</label>
                                <input type="date" id="dob" v-model="form.dob"
                                    class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-lg p-3 text-sm transition-all duration-200 outline-none font-light bg-white" />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Gender</label>
                                <div class="flex items-center gap-4">
                                    <label v-for="g in [{label: 'Male', value: 'MALE'}, {label: 'Female', value: 'FEMALE'}, {label: 'Other', value: 'OTHER'}]" :key="g.value"
                                        class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none group">
                                        <input type="radio" :value="g.value" v-model="form.gender"
                                            class="w-4.5 h-4.5 text-black border-slate-300 focus:ring-black accent-black cursor-pointer" />
                                        <span class="group-hover:text-black transition-colors font-light text-[14px]">{{
                                            g.label }}</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label for="email"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email
                                    Address</label>
                                <input type="email" id="email" v-model="form.email"
                                    placeholder="e.g. j.ive@apple.com" :class="[
                                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 hover:border-slate-300 focus:border-black',
                                        'w-full border rounded-lg p-3 text-sm transition-all duration-200 outline-none placeholder:text-slate-400 font-light bg-white'
                                    ]" />
                                <span v-if="errors.email" class="text-[11px] text-red-500 font-normal mt-1 block">{{
                                    errors.email }}</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label for="phone"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Phone
                                    Number</label>
                                <input type="text" id="phone" v-model="form.phone" placeholder="+1 (555) 000-0000"
                                    class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-lg p-3 text-sm transition-all duration-200 outline-none placeholder:text-slate-400 font-light bg-white" />
                            </div>

                            <div>
                                <label for="address"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Address</label>
                                <input type="text" id="address" v-model="form.address"
                                    placeholder="e.g. 1 Infinite Loop, Cupertino, CA"
                                    class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-lg p-3 text-sm transition-all duration-200 outline-none placeholder:text-slate-400 font-light bg-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6 md:gap-8 pb-10 border-b border-slate-100">
                    <div class="w-full md:w-1/3 md:max-w-70 shrink-0">
                        <h3 class="text-base font-bold text-slate-900 tracking-tight mb-1.5">Employment Info</h3>
                        <p class="text-xs text-slate-400 font-light leading-relaxed">
                            Specify the branch, department, position, and start date details for the employee.
                        </p>
                    </div>

                    <div class="grow space-y-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label for="employeeCode"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Employee
                                    Code</label>
                                <input type="text" id="employeeCode" v-model="form.employeeCode" readonly
                                    class="w-full border border-slate-100 bg-slate-50 text-slate-400 rounded-lg p-3 text-sm cursor-not-allowed outline-none font-medium" />
                            </div>

                            <div>
                                <label for="startDate"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Start
                                    Date</label>
                                <input type="date" id="startDate" v-model="form.startDate"
                                    class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-lg p-3 text-sm transition-all duration-200 outline-none font-light bg-white" />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label for="branch"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Branch</label>
                                <div class="relative">
                                    <select id="branch" v-model="form.branchId"
                                        :class="[
                                            errors.branchId ? 'border-red-500 focus:border-red-500' : 'border-slate-200 hover:border-slate-300 focus:border-black',
                                            'w-full border rounded-lg p-3 text-sm transition-all duration-200 outline-none bg-white font-light appearance-none pr-10'
                                        ]">
                                        <option v-for="b in branchStore.branches" :key="b.id" :value="b.id">{{ b.name }}
                                        </option>
                                    </select>
                                    <div
                                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20">
                                            <path
                                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                                <span v-if="errors.branchId" class="text-[11px] text-red-500 font-normal mt-1 block">{{
                                    errors.branchId }}</span>
                            </div>

                            <div>
                                <label for="department"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Department</label>
                                <div class="relative">
                                    <select id="department" v-model="form.departmentId"
                                        :class="[
                                            errors.departmentId ? 'border-red-500 focus:border-red-500' : 'border-slate-200 hover:border-slate-300 focus:border-black',
                                            'w-full border rounded-lg p-3 text-sm transition-all duration-200 outline-none bg-white font-light appearance-none pr-10'
                                        ]">
                                        <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
                                    </select>
                                    <div
                                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20">
                                            <path
                                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                                <span v-if="errors.departmentId"
                                    class="text-[11px] text-red-500 font-normal mt-1 block">{{ errors.departmentId }}</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label for="position"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Position</label>
                                <div class="relative">
                                    <select id="position" v-model="form.positionId"
                                        :class="[
                                            errors.positionId ? 'border-red-500 focus:border-red-500' : 'border-slate-200 hover:border-slate-300 focus:border-black',
                                            'w-full border rounded-lg p-3 text-sm transition-all duration-200 outline-none bg-white font-light appearance-none pr-10'
                                        ]">
                                        <option v-for="p in positionStore.positions" :key="p.id" :value="p.id">{{
                                            p.name }}</option>
                                    </select>
                                    <div
                                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20">
                                            <path
                                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                                <span v-if="errors.positionId" class="text-[11px] text-red-500 font-normal mt-1 block">{{ errors.positionId }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6 md:gap-8 pb-4">
                    <div class="w-full md:w-1/3 md:max-w-70 shrink-0">
                        <h3 class="text-base font-bold text-slate-900 tracking-tight mb-1.5">Status</h3>
                        <p class="text-xs text-slate-400 font-light leading-relaxed">
                            Specify the initial employment status of this record.
                        </p>
                    </div>

                    <div class="grow space-y-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label for="status"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Employment Status</label>
                                <div class="relative">
                                    <select id="status" v-model="form.status"
                                        class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-lg p-3 text-sm transition-all duration-200 outline-none bg-white font-light appearance-none pr-10">
                                        <option value="ACTIVE">Active (Làm việc chính thức)</option>
                                        <option value="PROBATION">Probation (Thử việc)</option>
                                    </select>
                                    <div
                                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20">
                                            <path
                                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
                    <button type="button" @click="handleCancel"
                        class="px-5 py-2.5 text-xs font-medium text-slate-600 hover:text-black hover:bg-slate-50 rounded-md transition-all duration-150">
                        Cancel
                    </button>
                    <button type="submit"
                        class="bg-black hover:bg-slate-900 text-white text-xs font-semibold py-2.5 px-6 rounded-md transition-all duration-200 shadow-sm active:scale-[0.98]">
                        Save Employee
                    </button>
                </div>

            </form>

            <!-- Modal Assign Role -->
            <ModalGeneric v-model="showRoleModal" title="Assign Roles for New Employee" width="500px">
                <div class="space-y-4">
                    <p class="text-xs text-slate-400 font-light leading-relaxed mb-4">
                        Please select one or more security roles to assign to this user. This determines their system access level.
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1">
                        <label v-for="role in roleStore.roles" :key="role.id"
                            class="flex items-center gap-3 text-sm text-slate-700 cursor-pointer select-none group border border-slate-200/80 rounded-xl p-3.5 bg-white hover:border-slate-300 transition-colors">
                            <input type="checkbox" :value="role.id" v-model="form.roleIds"
                                class="w-4 h-4 text-black border-slate-300 focus:ring-black accent-black cursor-pointer rounded" />
                            <span class="group-hover:text-black transition-colors font-medium text-slate-800">{{ role.name }}</span>
                        </label>
                    </div>
                </div>
                <template #footer>
                    <button type="button" @click="showRoleModal = false"
                        class="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white transition-all duration-200">
                        Cancel
                    </button>
                    <button type="button" @click="submitEmployeeCreation" :disabled="isSubmitting"
                        class="bg-black hover:bg-slate-900 text-white text-xs font-semibold py-2.5 px-6 rounded-md transition-all duration-200 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        <svg v-if="isSubmitting" class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Confirm & Create
                    </button>
                </template>
            </ModalGeneric>

        </div>

    </MainContent>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import MainContent from '../components/MainContent.vue';
import ToastMessage from '../components/ToastMessage.vue';
import ModalGeneric from '../components/ModalGeneric.vue';
import { useBranchStore } from '../store/branchStore.js';
import { useDepartmentStore } from '../store/departmentStore.js';
import { usePositionStore } from '../store/positionStore.js';
import { useRoleStore } from '../store/roleStore.js';
import { useEmployeeStore } from '../store/employeeStore.js';
import axiosInstance from '../axios/axios.js';

const router = useRouter();
const branchStore = useBranchStore();
const departmentStore = useDepartmentStore();
const positionStore = usePositionStore();
const roleStore = useRoleStore();
const employeeStore = useEmployeeStore();

const departments = ref([]);
const fileInput = ref(null);
const isUploading = ref(false);
const showRoleModal = ref(false);
const isSubmitting = ref(false);

// Dữ liệu Form
const form = reactive({
    fullName: '',
    dob: '',
    gender: 'MALE',
    email: '',
    phone: '',
    address: '',
    employeeCode: 'Hệ thống tự sinh', // Read-only placeholder
    startDate: new Date().toISOString().split('T')[0], // Mặc định là ngày hôm nay
    branchId: null,
    departmentId: null,
    positionId: null,
    roleIds: [],
    avatarUrl: '',
    status: 'ACTIVE'
});

// Trạng thái kiểm lỗi (Validation)
const errors = reactive({
    fullName: '',
    email: '',
    branchId: '',
    departmentId: '',
    positionId: ''
});

// Trạng thái thông báo nổi (Toast)
const toast = reactive({
    show: false,
    message: '',
    type: 'success'
});

// Hàm hiển thị Toast thông minh
const showToast = (message, type = 'success') => {
    toast.message = message;
    toast.type = type;
    toast.show = true;
    setTimeout(() => {
        toast.show = false;
    }, 4000);
};

// Handle file upload to backend
const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file.', 'error');
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        showToast('File size must not exceed 2MB.', 'error');
        return;
    }

    isUploading.value = true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subfolder', 'avatars');

    try {
        const res = await axiosInstance.post('/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        form.avatarUrl = res.data.data.url;
        showToast('Avatar uploaded successfully.', 'success');
    } catch (error) {
        console.error("Upload avatar error:", error);
        showToast('Failed to upload image. Please try again.', 'error');
    } finally {
        isUploading.value = false;
    }
};

// Theo dõi thay đổi của Branch để load danh sách Department tương ứng
watch(() => form.branchId, async (newBranchId) => {
    if (newBranchId) {
        try {
            const res = await departmentStore.getDepartmentsByBranch(newBranchId, 0, 100);
            departments.value = res.data.data.items;
            // Tự động chọn department đầu tiên nếu có
            if (departments.value.length > 0) {
                form.departmentId = departments.value[0].id;
            } else {
                form.departmentId = null;
            }
        } catch (error) {
            console.error("Lỗi khi tải phòng ban:", error);
            departments.value = [];
            form.departmentId = null;
        }
    } else {
        departments.value = [];
        form.departmentId = null;
    }
});

onMounted(async () => {
    try {
        // Tải danh sách chi nhánh, chức vụ, vai trò
        await Promise.all([
            branchStore.fetchBranches(0, 100),
            positionStore.fetchPositions(0, 100),
            roleStore.fetchRoles(0, 100)
        ]);

        // Gán giá trị mặc định đầu tiên nếu có dữ liệu
        if (branchStore.branches.length > 0) {
            form.branchId = branchStore.branches[0].id;
        }
        if (positionStore.positions.length > 0) {
            form.positionId = positionStore.positions[0].id;
        }
        if (roleStore.roles.length > 0) {
            // Ưu tiên tìm role tên là "EMPLOYEE"
            const defaultRole = roleStore.roles.find(r => r.name === 'EMPLOYEE');
            form.roleIds = defaultRole ? [defaultRole.id] : [roleStore.roles[0].id];
        }
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu ban đầu:", error);
        showToast("Failed to fetch initial configuration from system.", "error");
    }
});

// Xử lý nút hủy (Cancel)
const handleCancel = () => {
    router.push('/employees');
};

// Kiểm định dữ liệu trước khi gửi (Validation logic)
const validateForm = () => {
    let isValid = true;
    errors.fullName = '';
    errors.email = '';
    errors.branchId = '';
    errors.departmentId = '';
    errors.positionId = '';

    if (!form.fullName.trim()) {
        errors.fullName = 'Full Name is required.';
        isValid = false;
    }

    if (!form.email.trim()) {
        errors.email = 'Email address is required.';
        isValid = false;
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(form.email)) {
            errors.email = 'Please enter a valid email address.';
            isValid = false;
        }
    }

    if (!form.branchId) {
        errors.branchId = 'Branch is required.';
        isValid = false;
    }
    if (!form.departmentId) {
        errors.departmentId = 'Department is required.';
        isValid = false;
    }
    if (!form.positionId) {
        errors.positionId = 'Position is required.';
        isValid = false;
    }

    return isValid;
};

// Xử lý Lưu (Save Employee) - Mở modal chọn role
const handleSave = () => {
    if (!validateForm()) {
        showToast('Validation failed. Please check the fields.', 'error');
        return;
    }
    showRoleModal.value = true;
};

// Thực hiện submit tạo employee sau khi chọn role
const submitEmployeeCreation = async () => {
    if (!form.roleIds || form.roleIds.length === 0) {
        showToast('Please select at least one role.', 'error');
        return;
    }

    isSubmitting.value = true;
    try {
        const payload = {
            fullName: form.fullName,
            dateOfBirth: form.dob || null,
            gender: form.gender,
            email: form.email,
            phone: form.phone || null,
            address: form.address || null,
            startDate: form.startDate,
            status: form.status,
            branchId: form.branchId,
            departmentId: form.departmentId,
            positionId: form.positionId,
            roleIds: form.roleIds,
            avatarUrl: form.avatarUrl || null
        };

        await employeeStore.createEmployee(payload);
        showToast('Employee created and setup password email sent successfully!', 'success');
        showRoleModal.value = false;

        setTimeout(() => {
            router.push('/employees');
        }, 2000);
    } catch (error) {
        console.error("Lỗi khi thêm nhân viên:", error);
        const errorMsg = error.response?.data?.message || 'Failed to save employee. Please try again.';
        showToast(errorMsg, 'error');
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style scoped>
/* Hiệu ứng trượt và mờ mượt mà của Toast */
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}
</style>