<template>
    <header class="fixed top-0 left-0 right-0 z-50 h-14 border-b border-slate-300 backdrop-blur-lg bg-white/70">
        <div class="w-full mx-auto h-full flex items-center justify-between px-4 md:px-16 lg:px-36">
            <div class="flex items-center gap-xl">
                <router-link to="/" class="text-[20px] font-semibold text-primary tracking-tight">Humify</router-link>
            </div>
        </div>
    </header>

    <main>
        <section id="home" class="w-full mx-auto h-full flex items-center justify-between min-h-200">
            <div class="flex flex-col justify-center items-center w-full gap-xl">
                <div class="text-center">
                    <h2 class="font-bold text-2xl">Welcome to website</h2>
                    <p>Register account for human resources manager</p>
                </div>
                <div class="flex flex-col min-w-90 gap-2">
                    <div class="flex flex-col">
                        <label for="companyName" class="font-medium">Company Name</label>
                        <input type="text" id="companyName" v-model="companyInfo.name"
                            class="py-2 px-sm text-lg border-2 border-gray-300 rounded-lg">
                    </div>
                    <div class="flex flex-col">
                        <label for="" class="font-medium">Field</label>
                        <div class="relative">
                            <select v-model="companyInfo.field"
                                class="w-full appearance-none border-2 border-gray-300 px-md py-3 rounded-lg focus:border-primary focus:ring-0 outline-none bg-white">
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
                            class="py-2 px-sm text-lg border-2 border-gray-300 rounded-lg">
                    </div>
                    <div class="flex flex-col">
                        <label for="taxCode" class="font-medium">Tax Code</label>
                        <input type="text" v-model="companyInfo.taxCode" id="taxCode"
                            class="py-2 px-sm text-lg border-2 border-gray-300 rounded-lg">
                    </div>
                    <div class="flex flex-col">
                        <label for="phone" class="font-medium">Phone</label>
                        <input type="text" v-model="companyInfo.phone" id="phone"
                            class="py-2 px-sm text-lg border-2 border-gray-300 rounded-lg">
                    </div>
                    <div class="flex flex-col">
                        <label for="email" class="font-medium">Email</label>
                        <input type="email" v-model="companyInfo.email" id="email"
                            class="py-2 px-sm text-lg border-2 border-gray-300 rounded-lg">
                    </div>
                    <div class="">
                        <PrimaryButton @click="register" class="h-12" :content="'Register'"></PrimaryButton>
                    </div>
                </div>
                <RouterLink to="/login" class="flex items-center gap-1 font-medium text-lg">
                    Go to login
                    <MoveRight></MoveRight>
                </RouterLink>
            </div>
        </section>
    </main>
</template>

<script setup>
import { ChevronDown, MoveRight } from '@lucide/vue';
import MenuDropdown from '../components/MenuDropdown.vue'
import PrimaryButton from '../components/PrimaryButton.vue';
import { ref } from 'vue';

const companyInfo = ref({
    name: null,
    field: null,
    website: null,
    taxCode: null,
    phone: null,
    email: null
})

const register = () => {
    console.log(companyInfo.value)
}

</script>