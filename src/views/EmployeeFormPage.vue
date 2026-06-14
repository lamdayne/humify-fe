<template>
    <MainContent>
        <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans antialiased text-slate-900 relative">

            <ToastMessage :message="toast.message" :type="'success'" :show="toast.show"></ToastMessage>

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
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label for="fullName"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Full
                                    Name</label>
                                <input type="text" id="fullName" v-model="form.fullName" placeholder="e.g. Jonathan Ive"
                                    :class="[
                                        errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 hover:border-slate-300 focus:border-black',
                                        'w-full border rounded-lg p-3 text-sm transition-all duration-200 outline-none placeholder:text-slate-400 font-light bg-white'
                                    ]" />
                                <span v-if="errors.fullName" class="text-[11px] text-red-500 font-normal mt-1 block">{{
                                    errors.fullName }}</span>
                            </div>

                            <div>
                                <label for="dob"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Date
                                    of Birth</label>
                                <input type="date" id="dob" v-model="form.dob"
                                    class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-lg p-3 text-sm transition-all duration-200 outline-none font-light bg-white" />
                            </div>
                        </div>

                        <div>
                            <label
                                class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Gender</label>
                            <div class="flex items-center gap-6">
                                <label v-for="gender in ['Male', 'Female', 'Other']" :key="gender"
                                    class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none group">
                                    <input type="radio" :value="gender" v-model="form.gender"
                                        class="w-4.5 h-4.5 text-black border-slate-300 focus:ring-black accent-black cursor-pointer" />
                                    <span class="group-hover:text-black transition-colors font-light text-[14px]">{{
                                        gender }}</span>
                                </label>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label for="email"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                                <input type="email" id="email" v-model="form.email" placeholder="jonathan@humify.co"
                                    :class="[
                                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 hover:border-slate-300 focus:border-black',
                                        'w-full border rounded-lg p-3 text-sm transition-all duration-200 outline-none placeholder:text-slate-400 font-light bg-white'
                                    ]" />
                                <span v-if="errors.email" class="text-[11px] text-red-500 font-normal mt-1 block">{{
                                    errors.email }}</span>
                            </div>

                            <div>
                                <label for="phone"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Phone</label>
                                <input type="text" id="phone" v-model="form.phone" placeholder="+1 (555) 000-0000"
                                    class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-lg p-3 text-sm transition-all duration-200 outline-none placeholder:text-slate-400 font-light bg-white" />
                            </div>
                        </div>

                        <div>
                            <label for="address"
                                class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Address</label>
                            <textarea id="address" v-model="form.address" rows="3"
                                placeholder="Street name, City, Postcode"
                                class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-lg p-3 text-sm transition-all duration-200 outline-none placeholder:text-slate-400 font-light resize-none bg-white"></textarea>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-6 md:gap-8 pb-10 border-b border-slate-100">
                    <div class="w-full md:w-1/3 md:max-w-70 shrink-0">
                        <h3 class="text-base font-bold text-slate-900 tracking-tight mb-1.5">Employment Info</h3>
                        <p class="text-xs text-slate-400 font-light leading-relaxed">
                            Assign administrative parameters and professional positioning.
                        </p>
                    </div>

                    <div class="grow space-y-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label for="employeeCode"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Employee
                                    Code</label>
                                <input type="text" id="employeeCode" v-model="form.employeeCode" disabled
                                    class="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-lg p-3 text-sm cursor-not-allowed font-light outline-none" />
                            </div>

                            <div>
                                <label for="startDate"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Start
                                    Date</label>
                                <input type="date" id="startDate" v-model="form.startDate"
                                    class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-lg p-3 text-sm transition-all duration-200 outline-none font-light bg-white" />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label for="branch"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Branch</label>
                                <div class="relative">
                                    <select id="branch" v-model="form.branch"
                                        class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-lg p-3 text-sm transition-all duration-200 outline-none bg-white font-light appearance-none pr-10">
                                        <option v-for="item in dropdownOptions.branches" :key="item" :value="item">{{
                                            item }}</option>
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

                            <div>
                                <label for="department"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Department</label>
                                <div class="relative">
                                    <select id="department" v-model="form.department"
                                        class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-lg p-3 text-sm transition-all duration-200 outline-none bg-white font-light appearance-none pr-10">
                                        <option v-for="item in dropdownOptions.departments" :key="item" :value="item">{{
                                            item }}</option>
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

                            <div>
                                <label for="position"
                                    class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Position</label>
                                <div class="relative">
                                    <select id="position" v-model="form.position"
                                        class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-lg p-3 text-sm transition-all duration-200 outline-none bg-white font-light appearance-none pr-10">
                                        <option v-for="item in dropdownOptions.positions" :key="item" :value="item">{{
                                            item }}</option>
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

                <div class="flex flex-col md:flex-row gap-6 md:gap-8 pb-4">
                    <div class="w-full md:w-1/3 md:max-w-70 shrink-0">
                        <h3 class="text-base font-bold text-slate-900 tracking-tight mb-1.5">Status</h3>
                        <p class="text-xs text-slate-400 font-light leading-relaxed">
                            Manage the visibility and activity level of this record.
                        </p>
                    </div>

                    <div class="grow">
                        <div
                            class="border border-slate-200/80 rounded-xl p-5 flex items-center justify-between bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-slate-300 transition-colors">
                            <div>
                                <h4 class="text-sm font-semibold text-slate-900 mb-0.5">Active Account</h4>
                                <p class="text-xs text-slate-400 font-light">Enable system access and payroll processing
                                    immediately</p>
                            </div>

                            <button type="button" @click="form.isActive = !form.isActive" :class="[
                                form.isActive ? 'bg-black' : 'bg-slate-200',
                                'relative inline-flex h-6.5 w-11.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none'
                            ]">
                                <span :class="[
                                    form.isActive ? 'translate-x-5' : 'translate-x-0',
                                    'pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out'
                                ]"></span>
                            </button>
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
        </div>

    </MainContent>
</template>

<script setup>
import { ref, reactive } from 'vue';
import MainContent from '../components/MainContent.vue';
import ToastMessage from '../components/ToastMessage.vue';

// Danh sách dữ liệu Select Options
const dropdownOptions = {
    branches: ['Headquarters', 'Branch A', 'Branch B'],
    departments: ['Product Design', 'Engineering', 'HR Operations', 'Finance'],
    positions: ['Senior Designer', 'Product Designer', 'Backend Developer', 'Engineering Manager']
};

// Dữ liệu Form
const form = reactive({
    fullName: '',
    dob: '',
    gender: 'Male', // Default chọn Male giống ảnh mẫu
    email: '',
    phone: '',
    address: '',
    employeeCode: 'EMP-084', // Tự tạo mã mặc định (Read-only)
    startDate: '2026-06-09', // Thời gian mặc định
    branch: 'Headquarters',
    department: 'Product Design',
    position: 'Senior Designer',
    isActive: true
});

// Trạng thái kiểm lỗi (Validation)
const errors = reactive({
    fullName: '',
    email: ''
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

// Xử lý nút hủy (Cancel)
const handleCancel = () => {
    showToast('Đã hủy thao tác và hoàn tác thay đổi.', 'error');
    // Reset form
    form.fullName = '';
    form.dob = '';
    form.gender = 'Male';
    form.email = '';
    form.phone = '';
    form.address = '';
    form.isActive = true;
    errors.fullName = '';
    errors.email = '';
};

// Kiểm định dữ liệu trước khi gửi (Validation logic)
const validateForm = () => {
    let isValid = true;
    errors.fullName = '';
    errors.email = '';

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

    return isValid;
};

// Xử lý Lưu (Save Employee)
const handleSave = () => {
    if (validateForm()) {
        // Giả lập lưu thành công
        showToast(`Đã lưu thành công nhân viên: ${form.fullName} (${form.employeeCode})`, 'success');
    } else {
        showToast('Lưu thất bại. Vui lòng kiểm tra lại các trường thông tin!', 'error');
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