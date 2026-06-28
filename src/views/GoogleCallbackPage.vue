<template>
    <div class="min-h-screen w-full bg-white text-slate-900 font-sans antialiased flex flex-col">
        <!-- Header -->
        <header class="fixed top-0 left-0 right-0 z-50 h-14 border-b border-slate-200 backdrop-blur-lg bg-white/80">
            <div class="w-full h-full flex items-center px-6 md:px-16 lg:px-24">
                <router-link to="/"
                    class="text-[20px] font-semibold text-black tracking-tight hover:opacity-80 transition-opacity">Humify</router-link>
            </div>
        </header>

        <main class="grow flex flex-col md:flex-row min-h-screen w-full">
            <!-- Left Banner Column -->
            <div class="w-full md:w-1/2 bg-[#050b14] flex flex-col items-center justify-center text-center p-10 md:p-20 relative overflow-hidden">
                <div class="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20"></div>
                <div class="relative z-10">
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-2">Humify</h1>
                    <p class="text-sm md:text-base text-slate-400 font-light tracking-wide">Workforce. Simplified.</p>
                </div>
            </div>

            <!-- Right Column -->
            <div class="w-full md:w-1/2 bg-white flex flex-col p-8 md:p-16 lg:p-24 justify-between pt-20 md:pt-24 lg:pt-32">
                <div class="my-auto flex justify-center items-center w-full">
                    <div class="w-full max-w-95 text-center">
                        <div class="my-8 flex justify-center">
                            <!-- Glowing Spinner -->
                            <div v-if="status === 'loading'" class="relative w-16 h-16">
                                <div class="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                                <div class="absolute inset-0 rounded-full border-4 border-t-black border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                            </div>

                            <!-- Error Icon -->
                            <div v-else-if="status === 'error'" class="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                </svg>
                            </div>

                            <!-- Success Icon -->
                            <div v-else class="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                        </div>

                        <!-- Status Text -->
                        <h2 v-if="status === 'loading'" class="text-2xl font-normal text-black tracking-tight mb-2">
                            Sign in with Google
                        </h2>
                        <h2 v-else-if="status === 'error'" class="text-2xl font-normal text-black tracking-tight mb-2">
                            Authentication Failed
                        </h2>
                        <h2 v-else class="text-2xl font-normal text-black tracking-tight mb-2">
                            Authenticated
                        </h2>

                        <p v-if="status === 'loading'" class="text-sm text-slate-500 font-light tracking-wide animate-pulse">
                            Verifying Google authentication...
                        </p>
                        <p v-else-if="status === 'error'" class="text-sm text-slate-500 font-light tracking-wide">
                            {{ errorMessage }}
                        </p>
                        <p v-else class="text-sm text-slate-500 font-light tracking-wide">
                            Authentication successful! Redirecting...
                        </p>

                        <!-- Actions -->
                        <div v-if="status === 'error'" class="mt-8">
                            <router-link to="/login" class="w-full inline-block bg-[#09090b] hover:bg-black text-white text-sm font-medium py-3 px-4 rounded-md transition-colors duration-200 text-center">
                                Back to Login
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const status = ref('loading') // 'loading' | 'success' | 'error'
const errorMessage = ref('')

onMounted(async () => {
    const code = route.query.code
    
    if (!code) {
        status.value = 'error'
        errorMessage.value = 'Authorization code not found from Google.'
        return
    }

    const pendingCompanyCode = sessionStorage.getItem('pendingCompanyCode')
    if (pendingCompanyCode) {
        sessionStorage.removeItem('pendingCompanyCode')
    }

    try {
        await authStore.socialLoginCallback(code, 'google', pendingCompanyCode)
        status.value = 'success'
        
        // Check for pending invitation token
        const pendingInviteToken = sessionStorage.getItem('pendingInviteToken')
        setTimeout(() => {
            if (pendingInviteToken) {
                sessionStorage.removeItem('pendingInviteToken')
                router.push({ path: '/invite', query: { token: pendingInviteToken } })
            } else {
                router.push('/dashboard')
            }
        }, 1000)
    } catch (error) {
        status.value = 'error'
        console.error('Google callback login error:', error)
        if (error.response && error.response.data) {
            errorMessage.value = error.response.data.message || 'Authentication with Google failed.'
        } else {
            errorMessage.value = 'Unable to connect to the authentication server.'
        }
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

.bg-size-\[4rem_4rem\] {
    background-size: 4rem 4rem;
}
</style>
