<template>
    <div class="min-h-screen w-full bg-white text-slate-900 font-sans antialiased flex flex-col">

        <!-- Header chạy ngang phía trên đồng bộ với LoginPage và ForgotPasswordPage -->
        <header class="fixed top-0 left-0 right-0 z-50 h-14 border-b border-slate-200 backdrop-blur-lg bg-white/80">
            <div class="w-full h-full flex items-center justify-between px-6 md:px-16 lg:px-24">
                <div class="flex items-center">
                    <router-link to="/"
                        class="text-[20px] font-semibold text-black tracking-tight hover:opacity-80 transition-opacity">Humify</router-link>
                </div>
                <div class="flex items-center">
                    <PrimaryButton :content="'Get started'"></PrimaryButton>
                </div>
            </div>
        </header>

        <!-- Hộp thông báo nổi Toast báo trạng thái -->
        <Transition name="slide-fade">
            <div v-if="toast.show"
                :class="[
                    toast.type === 'success' ? 'bg-black border-slate-800' : 'bg-red-600 border-red-700',
                    'fixed top-20 right-6 z-[9999] flex items-center gap-3 text-white px-5 py-3.5 rounded-xl shadow-2xl border'
                ]">
                <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-5 h-5 text-emerald-400">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-5 h-5 text-red-200">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <span class="text-sm font-medium">{{ toast.message }}</span>
            </div>
        </Transition>

        <!-- Thân trang chia đôi màn hình hoàn hảo -->
        <main class="flex-grow flex flex-col md:flex-row min-h-screen w-full pt-14">

            <!-- Cột trái: Thương hiệu (Nền tối chiếm 50% chiều rộng) -->
            <div
                class="w-full md:w-1/2 bg-[#050b14] flex flex-col items-center justify-center text-center p-10 md:p-20 relative overflow-hidden">
                <!-- Hiệu ứng lưới tinh tế phía sau logo -->
                <div
                    class="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20">
                </div>

                <div class="relative z-10">
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-2">Humify</h1>
                    <p class="text-sm md:text-base text-slate-400 font-light tracking-wide">Workforce. Simplified.</p>
                </div>
            </div>

            <!-- Cột phải: Form Xử lý Thiết lập mật khẩu (Nền trắng tinh tế) -->
            <div class="w-full md:w-1/2 bg-white flex flex-col p-8 md:p-16 lg:p-24 justify-between">
                <!-- Căn giữa form theo chiều dọc -->
                <div class="my-auto flex justify-center items-center w-full">

                    <div class="w-full max-w-[380px]">
                        <h2 class="text-3xl font-normal text-black tracking-tight mb-2">Set up your password</h2>
                        <p class="text-[14px] text-slate-500 mb-8 font-light">
                            Welcome to Humify! Please choose a secure password to complete your account setup.
                        </p>

                        <!-- Cảnh báo nếu thiếu Token kích hoạt -->
                        <div v-if="!token" class="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-light leading-relaxed">
                            <span class="font-semibold block mb-1">Activation token is missing</span>
                            The link you followed is invalid or has expired. Please check your invitation email or contact your administrator.
                        </div>

                        <form v-else @submit.prevent="handleSetPassword" class="space-y-5">

                            <!-- Mật khẩu mới (New Password) -->
                            <div>
                                <label for="newPassword"
                                    class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                                <div class="relative">
                                    <input :type="isNewPasswordVisible ? 'text' : 'password'" id="newPassword"
                                        v-model="newPassword" placeholder="••••••••"
                                        class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none pr-10 font-light bg-white"
                                        required />
                                    <button type="button" @click="isNewPasswordVisible = !isNewPasswordVisible"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-black transition-colors">
                                        <svg v-if="!isNewPasswordVisible" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor"
                                            class="w-5 h-5">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.2" stroke="currentColor" class="w-5 h-5">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    </button>
                                </div>
                            </div>


                            <!-- Xác nhận mật khẩu (Confirm Password) -->
                            <div>
                                <label for="confirmPassword"
                                    class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Confirm Password</label>
                                <div class="relative">
                                    <input :type="isConfirmPasswordVisible ? 'text' : 'password'" id="confirmPassword"
                                        v-model="confirmPassword" placeholder="••••••••"
                                        class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none pr-10 font-light bg-white"
                                        required />
                                    <button type="button" @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-black transition-colors">
                                        <svg v-if="!isConfirmPasswordVisible" xmlns="http://www.w3.org/2000/svg"
                                            fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor"
                                            class="w-5 h-5">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.2" stroke="currentColor" class="w-5 h-5">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Nút Xác nhận mật khẩu -->
                            <button type="submit" :disabled="isSubmitting"
                                class="w-full bg-[#09090b] hover:bg-black disabled:opacity-50 text-white text-xs font-semibold py-3.5 px-4 rounded-md transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2">
                                <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Complete Activation
                            </button>

                            <!-- Liên kết quay lại trang Đăng nhập -->
                            <div class="text-center pt-2">
                                <router-link to="/login"
                                    class="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-black transition-colors font-light">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.8" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                    </svg>
                                    Back to sign in
                                </router-link>
                            </div>
                        </form>

                    </div>
                </div>

            </div>

        </main>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosInstance from '../axios/axios.js';
import PrimaryButton from '../components/PrimaryButton.vue';

const route = useRoute();
const router = useRouter();

const token = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isSubmitting = ref(false);

const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);


// Quản lý thông báo toast
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
    }, 4000);
};

onMounted(() => {
    // Lấy token từ query params: /set-password?token=XYZ
    token.value = route.query.token || '';
});

const handleSetPassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
        showToast('Passwords do not match.', 'error');
        return;
    }

    isSubmitting.value = true;
    try {
        await axiosInstance.post('/auth/set-password', {
            token: token.value,
            newPassword: newPassword.value,
            confirmNewPassword: confirmPassword.value
        });

        showToast('Your account password has been set successfully! Redirecting to login...', 'success');
        
        setTimeout(() => {
            router.push('/login');
        }, 2500);
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to set password. The token may be expired or invalid.';
        showToast(errorMsg, 'error');
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style>
/* Reset/Override background style for this full page layout */
html,
body,
#app {
    margin: 0 !important;
    padding: 0 !important;
    max-width: none !important;
    width: 100% !important;
    min-height: 100vh !important;
    background-color: white !important;
}

/* Toast animation support */
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-12px);
    opacity: 0;
}
</style>
