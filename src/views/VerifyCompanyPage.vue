<template>
    <div class="min-h-screen w-full bg-white text-slate-900 font-sans antialiased flex flex-col">
        <header class="fixed top-0 left-0 right-0 z-50 h-14 border-b border-slate-200 backdrop-blur-lg bg-white/80">
            <div class="w-full h-full flex items-center justify-between px-6 md:px-16 lg:px-24">
                <div class="flex items-center">
                    <router-link to="/"
                        class="text-[20px] font-semibold text-black tracking-tight hover:opacity-80 transition-opacity">Humify</router-link>
                </div>
            </div>
        </header>

        <main class="grow flex flex-col md:flex-row min-h-screen w-full">
            <ToastMessage :type="toast.type" :message="toast.message" :show="toast.show"></ToastMessage>
            
            <!-- Left Banner Column -->
            <div
                class="w-full md:w-1/2 bg-[#050b14] flex flex-col items-center justify-center text-center p-10 md:p-20 relative overflow-hidden">
                <div
                    class="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20">
                </div>

                <div class="relative z-10">
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-2">Humify</h1>
                    <p class="text-sm md:text-base text-slate-400 font-light tracking-wide">Workforce. Simplified.</p>
                </div>
            </div>

            <!-- Right Content Column -->
            <div class="w-full md:w-1/2 bg-white flex flex-col p-8 md:p-16 lg:p-24 justify-between">
                <div class="my-auto flex justify-center items-center w-full">
                    
                    <!-- State: Verifying -->
                    <div v-if="status === 'verifying'" class="w-full max-w-[380px] text-center flex flex-col items-center">
                        <LoaderCircle class="w-12 h-12 text-black animate-spin mb-4" />
                        <h2 class="text-3xl font-normal text-black tracking-tight mb-2">Verifying company</h2>
                        <p class="text-[14px] text-slate-500 font-light">Please wait while we verify your company registration...</p>
                    </div>

                    <!-- State: Success -->
                    <div v-else-if="status === 'success'" class="w-full max-w-[380px] text-center flex flex-col items-center">
                        <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 class="w-6 h-6" />
                        </div>
                        <h2 class="text-3xl font-normal text-black tracking-tight mb-2">Verification successful</h2>
                        <p class="text-[14px] text-slate-500 mb-8 font-light">
                            Your company registration has been verified successfully. You can now sign in to your administrator account.
                        </p>
                        <router-link to="/login" class="w-full">
                            <button class="w-full bg-[#09090b] hover:bg-black text-white text-sm font-medium py-3 px-4 rounded-md transition-colors duration-200 cursor-pointer">
                                Sign in
                            </button>
                        </router-link>
                    </div>

                    <!-- State: Error -->
                    <div v-else-if="status === 'error'" class="w-full max-w-[380px] text-center flex flex-col items-center">
                        <div class="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                            <XCircle class="w-6 h-6" />
                        </div>
                        <h2 class="text-3xl font-normal text-black tracking-tight mb-2">Verification failed</h2>
                        <p class="text-[14px] text-slate-500 mb-8 font-light">
                            The verification token is invalid, expired, or the company has already been verified.
                        </p>
                        
                        <button 
                            @click="handleResend" 
                            :disabled="isResending"
                            class="w-full bg-[#09090b] hover:bg-black text-white text-sm font-medium py-3 px-4 rounded-md transition-colors duration-200 mb-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <LoaderCircle v-if="isResending" class="w-4 h-4 animate-spin" />
                            Resend verification link
                        </button>

                        <router-link to="/login" class="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-black transition-colors font-light">
                            <ArrowLeft class="w-4 h-4" />
                            Back to sign in
                        </router-link>
                    </div>

                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LoaderCircle, CheckCircle2, XCircle, ArrowLeft } from '@lucide/vue';
import { useAuthStore } from '../store/authStore.js';
import ToastMessage from '../components/ToastMessage.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const token = ref(route.query.token || '');
const status = ref('verifying'); // 'verifying', 'success', 'error'
const isResending = ref(false);

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

const handleVerify = async () => {
    if (!token.value) {
        status.value = 'error';
        showToast('Verification token is missing.', 'error');
        return;
    }

    try {
        status.value = 'verifying';
        const res = await authStore.verifyCompany(token.value);
        if (res.status === 200 && res.data.success) {
            status.value = 'success';
            showToast('Company verified successfully!', 'success');
        } else {
            status.value = 'error';
            showToast(res.data.message || 'Verification failed.', 'error');
        }
    } catch (error) {
        console.error('Verify error:', error);
        status.value = 'error';
        if (error.response && error.response.data) {
            showToast(error.response.data.message || 'Verification failed.', 'error');
        } else {
            showToast('Cannot connect to server.', 'error');
        }
    }
};

const handleResend = async () => {
    if (!token.value) {
        showToast('Verification token is missing.', 'error');
        return;
    }

    try {
        isResending.value = true;
        const res = await authStore.resendVerifyCompany(token.value);
        if (res.status === 200 && res.data.success) {
            showToast('Verification email resent successfully!', 'success');
        } else {
            showToast(res.data.message || 'Failed to resend email.', 'error');
        }
    } catch (error) {
        console.error('Resend error:', error);
        if (error.response && error.response.data) {
            showToast(error.response.data.message || 'Failed to resend email.', 'error');
        } else {
            showToast('Cannot connect to server.', 'error');
        }
    } finally {
        isResending.value = false;
    }
};

onMounted(() => {
    handleVerify();
});
</script>

<style>
html,
body,
#app {
    margin: 0 !important;
    padding: 0 !important;
    max-width: none !important;
    width: 100% !important;
    min-height: 100vh !important;
}
</style>
