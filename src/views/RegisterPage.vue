<template>
    <header class="fixed top-0 left-0 right-0 z-50 h-14 border-b border-slate-300 backdrop-blur-lg bg-white/70">
        <div class="w-full mx-auto h-full flex items-center justify-between px-4 md:px-16 lg:px-36">
            <div class="flex items-center gap-xl">
                <router-link to="/" class="text-[20px] font-semibold text-primary tracking-tight">Humify</router-link>
            </div>
        </div>
    </header>

    <main>
        <ToastMessage :type="toast.type" :message="toast.message" :show="toast.show"></ToastMessage>
        <section id="home" class="w-full mx-auto h-full flex items-center justify-between min-h-200">
            <div class="flex flex-col justify-center items-center w-full gap-xl">
                <div class="text-center">
                    <h2 class="font-bold text-2xl">Welcome to website</h2>
                    <p>Register account for human resources manager</p>
                </div>
                <div class="flex flex-col min-w-90 gap-2">
                    <div class="flex flex-col">
                        <label for="website" class="font-medium">Company Name</label>
                        <input type="text" id="website" placeholder="https://example.com" v-model="companyInfo.name"
                            class="py-2 px-sm text-[17px] border-2 border-slate-200 outline-none rounded-lg">
                    </div>
                    <div class="flex flex-col">
                        <label for="website" class="font-medium">Field</label>
                        <div class="relative">
                            <select v-model="companyInfo.field"
                                class="w-full appearance-none text-[17px] border border-slate-200 outline-none px-md py-2 rounded-lg focus:border-primary focus:ring-0 bg-white">
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
                            <span
                                class="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown></ChevronDown>
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <label for="website" class="font-medium">Website</label>
                        <input type="text" id="website" placeholder="https://example.com" v-model="companyInfo.website"
                            class="py-2 px-sm text-[17px] border-2 border-slate-200 outline-none rounded-lg">
                    </div>
                    <div class="flex flex-col">
                        <label for="taxCode" class="font-medium">Tax Code</label>
                        <input type="text" v-model="companyInfo.taxCode" id="taxCode"
                            class="py-2 px-sm text-[17px] border-2 border-slate-200 outline-none rounded-lg">
                    </div>
                    <div class="flex flex-col">
                        <label for="phone" class="font-medium">Phone</label>
                        <input type="text" v-model="companyInfo.phone" id="phone"
                            class="py-2 px-sm text-[17px] border-2 border-slate-200 outline-none rounded-lg">
                    </div>
                    <div class="flex flex-col">
                        <label for="email" class="font-medium">Email</label>
                        <input type="email" v-model="companyInfo.email" id="email" required
                            class="py-2 px-sm text-[17px] border-2 border-slate-200 outline-none rounded-lg">
                    </div>
                    <div class="">
                        <PrimaryButton @click="register" class="h-12" :content="'Register'"></PrimaryButton>
                    </div>
                </div>
                <RouterLink to="/login" class="flex items-center gap-1 font-medium text-[14px]">
                    Go to login
                    <MoveRight class="w-3"></MoveRight>
                </RouterLink>
            </div>
        </section>
    </main>
</template>

<script setup>
import { ChevronDown, CircleX, MoveRight } from '@lucide/vue';
import MenuDropdown from '../components/MenuDropdown.vue'
import PrimaryButton from '../components/PrimaryButton.vue';
import ModalGeneric from "../components/ModalGeneric.vue";
import ToastMessage from "../components/ToastMessage.vue";
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
    companyInfo.name = '',
        companyInfo.field = null,
        companyInfo.website = null,
        companyInfo.taxCode = '',
        companyInfo.phone = '',
        companyInfo.email = ''
}

const validateForm = () => {
    toast.type = 'error'

    if (!companyInfo.name || !companyInfo.name.trim()) {
        toast.message = 'Please input company name'
        return false
    }

    if (!companyInfo.field || !companyInfo.field) {
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