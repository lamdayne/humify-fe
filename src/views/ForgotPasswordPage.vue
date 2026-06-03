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
                            class="w-full bg-[#09090b] hover:bg-black text-white text-sm font-medium py-3 px-4 rounded-md transition-colors duration-200 mb-6"
                        >
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

                    <p class="text-xs text-slate-500 font-light">
                        Didn't receive the email? 
                        <button type="button" @click="handleResend" class="text-black underline underline-offset-2 hover:opacity-80 transition-opacity font-medium ml-1">
                            Click to resend
                        </button>
                    </p>
                </div>

            </div>
            
            <div class="text-[11px] text-slate-400 text-right font-light mt-8">
                © 2025 Humify
            </div>
        </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PrimaryButton from '../components/PrimaryButton.vue';

const email = ref('');
const isEmailSent = ref(false);

const handleForgotPassword = () => {
    if (email.value.trim() !== '') {
        isEmailSent.value = true;
    }
};

const handleResend = () => {
    alert(`Đã gửi lại liên kết khôi phục tới: ${email.value}`);
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
</style>