<template>
    <div class="min-h-screen w-full bg-white text-slate-900 font-sans antialiased flex flex-col">
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

        <main class="grow flex flex-col md:flex-row min-h-screen w-full">
            <ToastMessage :type="toast.type" :message="toast.message" :show="toast.show"></ToastMessage>
            <div
                class="w-full md:w-1/2 bg-[#050b14] flex flex-col items-center justify-center text-center p-10 md:p-20 relative overflow-hidden">
                <div
                    class="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20">
                </div>

                <div class="relative z-10">
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-2">Humify
                    </h1>
                    <p class="text-sm md:text-base text-slate-400 font-light tracking-wide">Workforce. Simplified.</p>
                </div>
            </div>

            <div class="w-full md:w-1/2 bg-white flex flex-col p-8 md:p-16 lg:p-24 justify-between">
                <div class="my-auto flex justify-center items-center w-full">
                    <form class="w-full max-w-95" @submit.prevent="handleLogin">
                        <h2 class="text-3xl font-normal text-black tracking-tight mb-2">Welcome back</h2>
                        <p class="text-[14px] text-slate-500 mb-8 font-light">Sign in to your account to continue.</p>
                        <div class="mb-5">
                            <label for="email"
                                class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Email
                                Address</label>
                            <input type="email" id="email" placeholder="name@company.com" v-model="user.email"
                                class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                        </div>
                        <div class="mb-5">
                            <label for="password"
                                class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                            <div class="relative">
                                <input :type="isPasswordVisible ? 'text' : 'password'" id="password"
                                    placeholder="••••••••" v-model="user.password"
                                    class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 pr-10 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                                <button type="button" @click="isPasswordVisible = !isPasswordVisible"
                                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-black transition-colors">
                                    <svg v-if="!isPasswordVisible" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="w-5 h-5">
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
                        <div class="flex items-center mb-6">
                            <input type="checkbox" id="remember_me"
                                class="w-4 h-4 text-black border-slate-300 rounded focus:ring-black accent-black cursor-pointer">
                            <label for="remember_me"
                                class="ml-2 text-sm text-slate-500 font-light cursor-pointer select-none">Remember
                                me</label>
                        </div>
                        <button type="submit" :disabled="isLoading" :class="['gap-lg w-full bg-[#09090b] hover:bg-black text-white text-sm font-medium py-3 px-4 rounded-md transition-colors duration-200 mb-6 cursor-pointer',
                            isLoading ? 'flex justify-center items-center opacity-70' : '']">
                            <LoaderCircle v-if="isLoading" class="animate-spin"></LoaderCircle>
                            Sign in
                        </button>
                        <div class="flex flex-col items-center gap-2">
                            <router-link to="/forgot-password"
                                class="text-xs text-slate-500 hover:text-black underline underline-offset-4 transition-colors font-light">
                                Forgot password?
                            </router-link>
                            <router-link to="/register"
                                class="text-xs text-slate-500 hover:text-black underline underline-offset-4 transition-colors font-light">
                                Đăng ký tài khoản
                            </router-link>
                        </div>
                    </form>
                </div>
                <!-- <div class="text-[11px] text-slate-400 text-right font-light mt-8">
                    © 2025 Humify
                </div> -->
            </div>
            <ModalGeneric v-model="isOpen" :title="'Company Code'">
                <div class="">
                    <label for=" companyCode"
                        class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Company Code
                    </label>
                    <input type="text" id="companyCode" placeholder="aSk87sb" v-model="user.companyCode"
                        class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                </div>
                <template #footer>
                    <PrimaryButton @click="handleContinue" :content="'Continue'"></PrimaryButton>
                </template>
            </ModalGeneric>
        </main>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import ToastMessage from '../components/ToastMessage.vue';
import { useAuthStore } from '../store/authStore.js';
import { LoaderCircle } from '@lucide/vue';
import ModalGeneric from '../components/ModalGeneric.vue';
import { useRoute, useRouter } from 'vue-router';

const isPasswordVisible = ref(false);
const isLoading = ref(false)
const isOpen = ref(false)

const user = reactive({
    email: '',
    password: '',
    companyCode: ''
})

const toast = reactive({
    type: 'success',
    message: '',
    show: false
})

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const handleLogin = async () => {
    isLoading.value = true
    if (!validateForm()) {
        showToast(toast.message, toast.type)
        isLoading.value = false
        return
    }

    const companyCode = route.query.companyCode || user.companyCode
    if (!companyCode) {
        isOpen.value = true
        isLoading.value = false
        return
    }

    user.companyCode = companyCode

    try {
        const res = await authStore.login({ ...user })
        if (res.status === 200 && res.data.success) {
            showToast(res.data.message || 'Login successfully', 'success')
            clearForm()
            router.push(route.query.redirect || { name: 'Dashboard' })
        } else {
            showToast(res.data.message || 'Login failed', 'error')
        }
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data
            const errorStatus = error.status

            showToast(errorData.message || 'Invalid information', 'error')
        } else {
            showToast('Cannot connect to server', 'error')
        }
    }
    isLoading.value = false
};

const handleContinue = () => {
    if (!user.companyCode || !user.companyCode.trim()) {
        showToast('Please input company code', 'error')
        return
    }

    isOpen.value = false

    handleLogin()
}

const validateForm = () => {
    toast.type = 'error'

    if (!user.email || !user.email.trim()) {
        toast.message = 'Please input your email'
        return false
    }

    if (!user.password || !user.password.trim()) {
        toast.message = 'Please input your password'
        return false
    }

    toast.type = 'success'
    toast.message = 'Login successfully'
    return true
}

const showToast = (message, type = 'success') => {
    toast.message = message
    toast.type = type
    toast.show = true
    setTimeout(() => {
        toast.show = false
        toast.message = ''
    }, 3000)
}

const clearForm = () => {
    isLoading.value = false
    user.email = ''
    user.password = ''
}

onMounted(() => {
    if (authStore.isAuthenticated) {
        router.push(route.query.redirect || { name: 'Dashboard' })
    }
})

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