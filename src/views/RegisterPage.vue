<template>
    <div class="min-h-screen w-full bg-white text-slate-900 font-sans antialiased flex flex-col">
        <header class="fixed top-0 left-0 right-0 z-50 h-14 border-b border-slate-200 backdrop-blur-lg bg-white/80">
            <div class="w-full h-full flex items-center justify-between px-6 md:px-16 lg:px-24">
                <div class="flex items-center">
                    <router-link to="/"
                        class="text-[20px] font-semibold text-black tracking-tight hover:opacity-80 transition-opacity">Humify</router-link>
                </div>
                <div class="flex items-center">
                    <router-link to="/login">
                        <PrimaryButton :content="'Sign in'"></PrimaryButton>
                    </router-link>
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
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-2">Humify
                    </h1>
                    <p class="text-sm md:text-base text-slate-400 font-light tracking-wide">Workforce. Simplified.</p>
                </div>
            </div>

            <!-- Right Form Column -->
            <div class="w-full md:w-1/2 bg-white flex flex-col p-8 md:p-16 lg:p-24 justify-between pt-20 md:pt-24 lg:pt-32">
                <div class="my-auto flex justify-center items-center w-full">
                    <form class="w-full max-w-95" @submit.prevent="register">
                        <h2 class="text-3xl font-normal text-black tracking-tight mb-2">Create an account</h2>
                        <p class="text-[14px] text-slate-500 mb-8 font-light">Register a new company and administrator account.</p>
                        
                        <div class="mb-5">
                            <label for="companyName"
                                class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Company Name</label>
                            <input type="text" id="companyName" placeholder="Acme Corporation" v-model="companyInfo.name"
                                class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                        </div>

                        <div class="mb-5">
                            <label for="field"
                                class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Field</label>
                            <div class="relative">
                                <select id="field" v-model="companyInfo.field"
                                    class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 pr-10 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light appearance-none bg-white">
                                    <option :value="null" disabled>Select field...</option>
                                    <option value="other">Other</option>
                                    <option value="energy">Energy</option>
                                    <option value="materials">Materials</option>
                                    <option value="industrials">Industrials</option>
                                    <option value="consumer_discretionary">Consumer Discretionary</option>
                                    <option value="consumer_staples">Consumer Staples</option>
                                    <option value="healthcare">Health Care</option>
                                    <option value="financials">Financials</option>
                                    <option value="it">Information Technology</option>
                                    <option value="communication_services">Communication Services</option>
                                    <option value="utilities">Utilities</option>
                                    <option value="real_estate">Real Estate</option>
                                </select>
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                    <ChevronDown class="w-4 h-4"></ChevronDown>
                                </div>
                            </div>
                        </div>

                        <div class="mb-5">
                            <label for="website"
                                class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Website</label>
                            <input type="text" id="website" placeholder="https://example.com" v-model="companyInfo.website"
                                class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                        </div>

                        <div class="mb-5">
                            <label for="taxCode"
                                class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Tax Code</label>
                            <input type="text" id="taxCode" placeholder="Enter tax code" v-model="companyInfo.taxCode"
                                class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                        </div>

                        <div class="mb-5">
                            <label for="phone"
                                class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone</label>
                            <input type="text" id="phone" placeholder="Enter phone number" v-model="companyInfo.phone"
                                class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                        </div>

                        <div class="mb-6">
                            <label for="email"
                                class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                            <input type="email" id="email" placeholder="name@company.com" v-model="companyInfo.email" required
                                class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                        </div>

                        <button type="submit"
                            class="w-full bg-[#09090b] hover:bg-black text-white text-sm font-medium py-3 px-4 rounded-md transition-colors duration-200 mb-6 cursor-pointer">
                            Register
                        </button>

                        <div class="flex flex-col items-center gap-2">
                            <router-link to="/login"
                                class="text-xs text-slate-500 hover:text-black underline underline-offset-4 transition-colors font-light">
                                Already have an account? Sign in
                            </router-link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ChevronDown } from '@lucide/vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import ToastMessage from '../components/ToastMessage.vue';
import { reactive } from 'vue';
import { useCompanyStore } from '../store/companyStore.js';

const toast = reactive({
    type: 'success',
    message: 'Message',
    show: false
})

const companyInfo = reactive({
    name: '',
    field: null,
    website: null,
    taxCode: '',
    phone: '',
    email: ''
})

const companyStore = useCompanyStore()

const register = async () => {
    if (validateForm()) {
        try {
            const res = await companyStore.register({ ...companyInfo })
            if (res.status === 201 && res.data.success) {
                showToast(toast.message, toast.type)
                clearForm()
            } else {
                showToast(res.data.message || 'Đăng ký không thành công', 'error')
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                const errorData = error.response.data
                const errorStatus = error.status
                showToast(errorData.message || "Invalid data", 'error')
            } else {
                showToast("Cannot connect to server", 'error')
            }
        }
    } else {
        showToast(toast.message, toast.type)
    }
}

const clearForm = () => {
    companyInfo.name = ''
    companyInfo.field = null
    companyInfo.website = null
    companyInfo.taxCode = ''
    companyInfo.phone = ''
    companyInfo.email = ''
}

const validateForm = () => {
    toast.type = 'error'

    if (!companyInfo.name || !companyInfo.name.trim()) {
        toast.message = 'Please input company name'
        return false
    }

    if (!companyInfo.field) {
        toast.message = 'Please select field of company'
        return false
    }

    if (!companyInfo.taxCode || !companyInfo.taxCode.trim() || companyInfo.taxCode.trim().length > 20) {
        toast.message = 'Please input company tax code and less than 20 character'
        return false
    }

    if (!companyInfo.phone || !companyInfo.phone.trim() || companyInfo.phone.trim().length > 20) {
        toast.message = 'Please input company phone'
        return false
    }

    if (!companyInfo.email || !companyInfo.email.trim()) {
        toast.message = 'Please input company email'
        return false
    }

    toast.message = 'Register account successfully'
    toast.type = 'success'
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