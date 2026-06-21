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

        <!-- Hộp thông báo nổi Toast báo thành công -->
        <Transition name="slide-fade">
            <div v-if="toast.show"
                class="fixed top-20 right-6 z-[9999] flex items-center gap-3 bg-black text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-5 h-5 text-emerald-400">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span class="text-sm font-medium">{{ toast.message }}</span>
            </div>
        </Transition>

        <!-- Thân trang chia đôi màn hình hoàn hảo (Có padding top 14 để không bị Header đè) -->
        <main class="flex-grow flex flex-col md:flex-row min-h-screen w-full pt-14">

            <!-- Cột trái: Thương hiệu (Nền tối chiếm 50% chiều rộng - Khớp 100% ảnh image_55512b) -->
            <div
                class="w-full md:w-1/2 bg-[#050b14] flex flex-col items-center justify-center text-center p-10 md:p-20 relative overflow-hidden">
                <!-- Hiệu ứng lưới tinh tế phía sau logo -->
                <div
                    class="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20">
                </div>

                <div class="relative z-10">
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-2">Humify
                    </h1>
                    <p class="text-sm md:text-base text-slate-400 font-light tracking-wide">Workforce. Simplified.</p>
                </div>
            </div>

            <!-- Cột phải: Form Xử lý Đặt lại mật khẩu (Nền trắng tinh tế) -->
            <div class="w-full md:w-1/2 bg-white flex flex-col p-8 md:p-16 lg:p-24 justify-between">
                <!-- Căn giữa form theo chiều dọc -->
                <div class="my-auto flex justify-center items-center w-full">

                    <div class="w-full max-w-[380px]">
                        <h2 class="text-3xl font-normal text-black tracking-tight mb-2">Reset your password</h2>
                        <p class="text-[14px] text-slate-500 mb-8 font-light">Please enter your new password below to
                            regain access.</p>

                        <form @submit.prevent="handleResetPassword" class="space-y-5">

                            <!-- Mật khẩu mới (New Password) -->
                            <div>
                                <label for="newPassword"
                                    class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">New
                                    Password</label>
                                <div class="relative">
                                    <input :type="isNewPasswordVisible ? 'text' : 'password'" id="newPassword"
                                        v-model="newPassword" @input="checkPasswordRequirements" placeholder="••••••••"
                                        class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none pr-10 font-light bg-white"
                                        required />
                                    <button type="button" @click="isNewPasswordVisible = !isNewPasswordVisible"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-black transition-colors">
                                        <!-- Icon mắt thay đổi trạng thái ẩn/hiện -->
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
                                    class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Confirm
                                    Password</label>
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



                            <!-- Nút Đặt lại mật khẩu (RESET PASSWORD) -->
                            <button type="submit"
                                class="w-full bg-[#09090b] hover:bg-black text-white text-xs font-semibold py-3.5 px-4 rounded-md transition-all duration-200 active:scale-[0.99]">
                                Reset Password
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import PrimaryButton from '../components/PrimaryButton.vue';

const router = useRouter();

// Quản lý các biến dữ liệu password
const newPassword = ref('');
const confirmPassword = ref('');

// Trạng thái ẩn/hiện mật khẩu
const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);

// Bộ kiểm soát các yêu cầu bảo mật đầu vào
const requirements = reactive({
    length: false,
    uppercase: false,
    number: false
});

// Trạng thái thông báo Toast
const toast = reactive({
    show: false,
    message: ''
});

// Hàm kiểm soát điều kiện mật khẩu real-time
const checkPasswordRequirements = () => {
    const val = newPassword.value;
    requirements.length = val.length >= 8;
    requirements.uppercase = /[A-Z]/.test(val);
    requirements.number = /[0-9]/.test(val);
};

// Xử lý khi nhấn nút Đặt lại mật khẩu
const handleResetPassword = () => {
    // 1. Kiểm tra xem mật khẩu đã đáp ứng đủ 3 tiêu chuẩn bảo mật chưa
    if (!requirements.length || !requirements.uppercase || !requirements.number) {
        alert('Mật khẩu chưa đáp ứng đủ 3 tiêu chuẩn bảo mật!');
        return;
    }

    // 2. Kiểm tra xem 2 mật khẩu đã trùng khớp chưa
    if (newPassword.value !== confirmPassword.value) {
        alert('Mật khẩu xác nhận không trùng khớp!');
        return;
    }

    // 3. Giả lập đổi mật khẩu thành công và hiển thị Toast đẹp đẽ
    toast.message = "Mật khẩu của bạn đã được cập nhật thành công! Đang chuyển hướng về trang đăng nhập...";
    toast.show = true;

    // Tự động chuyển trang về Login sau 2.5 giây
    setTimeout(() => {
        toast.show = false;
        router.push('/login');
    }, 2500);
};
</script>

<style>
/* Đảm bảo nền trắng phủ kín vùng làm việc chính */
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

/* Hiệu ứng trượt và mờ cực kỳ tự nhiên cho hộp Toast */
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