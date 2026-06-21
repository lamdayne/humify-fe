<template>
    <header
        class="fixed top-0 left-0 lg:left-60 right-0 h-14 bg-surface flex items-center justify-between px-xl border-b-2 border-slate-200 z-40">

        <button class="lg:hidden p-xs hover:bg-surface-container-high rounded-lg transition-colors"
            @click="$emit('toggle-sidebar')">
            <Menu :size="22" />
        </button>

        <div class="hidden lg:block"></div>

        <div class="flex items-center gap-xs">
            <button class="relative p-xs hover:bg-surface-container-high rounded-lg transition-colors">
                <Bell />
                <span class="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full"></span>
            </button>

            <div class="h-6 w-px bg-outline-variant mx-sm"></div>

            <div class="relative group">
                <img alt="User Profile" class="w-8 h-8 rounded-lg object-cover cursor-pointer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfBHrYzRqN2XQOXwA5s9Qsx-IJY967pbMleFyPqAsNMaATqtG77zohyRgdmSdRk0X6FBZVn__e52CoRw1m-HxJ0SK3HNpZ-OmLivwdmi1rwpJ1LhFjuba7-6lAzFsgquJWevKeTWva0hQMgcxfWFQkdoQYJ35POblleC9TrSr5BZW7Hkugtc_VhVTiMQ6TIpgRplxyZNrY0T44Rvo2iv3sW5HkV9MjcJiAdRzUqeYf-XQqaS4OjeAxLZ-htQ9SX1fR84G8XOAVPKk" />
                <div class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md opacity-0 invisible
                            group-hover:opacity-100 group-hover:visible
                            transition-all duration-200 z-50">
                    <ul class="py-2 text-sm text-gray-700">
                        <li class="px-4 py-2 hover:bg-gray-100">{{ userInfo.email }}</li>
                        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
                            <button @click="handleLogout">
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { Bell, Menu } from '@lucide/vue'
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';
import { computed } from "vue";

defineEmits(['toggle-sidebar'])

const router = useRouter()
const authStore = useAuthStore()

const userInfo = computed(() => authStore.user)

const handleLogout = async () => {
    authStore.logout()
    router.push("/login")
}
</script>