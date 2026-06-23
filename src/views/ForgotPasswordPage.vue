<template>
  <div class="min-h-screen w-full bg-white text-slate-900 font-sans antialiased flex flex-col">
    <header class="fixed top-0 left-0 right-0 z-50 h-14 border-b border-slate-200 backdrop-blur-lg bg-white/80">
        <div class="w-full h-full flex items-center justify-between px-6 md:px-16 lg:px-24">
            <div class="flex items-center">
                <router-link to="/" class="text-[20px] font-semibold text-black tracking-tight hover:opacity-80 transition-opacity">Humify</router-link>
            </div>
            <div class="flex items-center">
                <PrimaryButton :content="'Get started'"></PrimaryButton>
            </div>
        </div>
    </header>

    <!-- Hộp thông báo nổi Toast báo lỗi -->
    <Transition name="slide-fade">
        <div v-if="toast.show"
            class="fixed top-20 right-6 z-[9999] flex items-center gap-3 bg-red-600 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="w-5 h-5 text-red-200">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
    </Transition>

    <main class="flex-grow flex flex-col md:flex-row min-h-screen w-full pt-14">
        <div class="w-full md:w-1/2 bg-[#050b14] flex flex-col items-center justify-center text-center p-10 md:p-20 relative overflow-hidden">
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
            
            <div class="relative z-10">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-2">Humify</h1>
                <p class="text-sm md:text-base text-slate-400 font-light tracking-wide">Workforce. Simplified.</p>
            </div>
        </div>

        <div class="w-full md:w-1/2 bg-white flex flex-col p-8 md:p-16 lg:p-24 justify-between">
            <div class="my-auto flex justify-center items-center w-full">
                
                <div v-if="!isEmailSent" class="w-full max-w-[380px]">
                    <h2 class="text-3xl font-normal text-black tracking-tight mb-2">Forgot password?</h2>
                    <p class="text-[14px] text-slate-500 mb-8 font-light">No worries, we'll send you reset instructions.</p>

                    <form @submit.prevent="handleForgotPassword">
                        <div class="mb-5">
                            <label for="forgot_email" class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                            <input 
                                type="email" 
                                id="forgot_email" 
                                v-model="email"
                                placeholder="name@company.com" 
                                class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light"
                                required
                            >
                        </div>

                        <button 
                            type="submit" 
                            :disabled="isSubmitting"
                            class="w-full bg-[#09090b] hover:bg-black disabled:opacity-50 text-white text-sm font-medium py-3 px-4 rounded-md transition-colors duration-200 mb-6 flex items-center justify-center gap-2"
                        >
                            <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Reset password
                        </button>

                        <div class="text-center">
                            <router-link to="/login" class="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-black transition-colors font-light">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                                Back to sign in
                            </router-link>
                        </div>
                    </form>
                </div>

                <div v-else class="w-full max-w-[380px] text-center">
                    <div class="mx-auto w-12 h-12 bg-slate-100 text-black rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                    </div>
                    
                    <h2 class="text-3xl font-normal text-black tracking-tight mb-2">Check your email</h2>
                    <p class="text-[14px] text-slate-500 mb-6 font-light">
                        We sent a password reset link to <br><strong class="font-medium text-slate-800">{{ email }}</strong>
                    </p>

                    <a href="https://mail.google.com" target="_blank" class="block w-full text-center bg-[#09090b] hover:bg-black text-white text-sm font-medium py-3 px-4 rounded-md transition-colors duration-200 mb-6">
                        Open email app
                    </a>

        
                </div>

            </div>
            
            
        </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axiosInstance from '../axios/axios.js';
import PrimaryButton from '../components/PrimaryButton.vue';

const email = ref('');
const isEmailSent = ref(false);
const isSubmitting = ref(false);

const toast = reactive({
    show: false,
    message: ''
});

const showToast = (message) => {
    toast.message = message;
    toast.show = true;
    setTimeout(() => {
        toast.show = false;
    }, 4000);
};

const handleForgotPassword = async () => {
    if (!email.value.trim()) return;

    isSubmitting.value = true;
    try {
        await axiosInstance.post('/auth/forgot-password', {
            email: email.value
        });
        isEmailSent.value = true;
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu khôi phục mật khẩu.';
        showToast(errorMsg);
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style>
html, body, #app {
  margin: 0 !important;
  padding: 0 !important;
  max-width: none !important;
  width: 100% !important;
  min-height: 100vh !important;
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