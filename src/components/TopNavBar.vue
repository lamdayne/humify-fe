<template>
    <header
        class="fixed top-0 left-0 lg:left-60 right-0 h-14 bg-white flex items-center justify-between px-6 border-b border-slate-200 z-40">

        <!-- Mobile menu toggle -->
        <button class="lg:hidden p-1.5 hover:bg-slate-100 rounded-md transition-colors"
            @click="$emit('toggle-sidebar')">
            <Menu class="w-5 h-5 text-slate-600" />
        </button>

        <!-- Desktop spacer -->
        <div class="hidden lg:block"></div>

        <!-- Right side actions -->
        <div class="flex items-center gap-1.5">

            <!-- Notification bell -->
            <button class="relative p-1.5 hover:bg-slate-100 rounded-md transition-colors">
                <Bell class="w-4.5 h-4.5 text-slate-500" />
                <span class="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            </button>

            <!-- Divider -->
            <div class="w-px h-5 bg-slate-200 mx-1"></div>

            <!-- User avatar + dropdown -->
            <div class="relative group">
                <button class="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors">
                    <img alt="User Profile" class="w-7 h-7 rounded-md object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfBHrYzRqN2XQOXwA5s9Qsx-IJY967pbMleFyPqAsNMaATqtG77zohyRgdmSdRk0X6FBZVn__e52CoRw1m-HxJ0SK3HNpZ-OmLivwdmi1rwpJ1LhFjuba7-6lAzFsgquJWevKeTWva0hQMgcxfWFQkdoQYJ35POblleC9TrSr5BZW7Hkugtc_VhVTiMQ6TIpgRplxyZNrY0T44Rvo2iv3sW5HkV9MjcJiAdRzUqeYf-XQqaS4OjeAxLZ-htQ9SX1fR84G8XOAVPKk" />
                    <ChevronDown class="w-3 h-3 text-slate-400" />
                </button>

                <!-- Dropdown -->
                <div class="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-lg shadow-[0_4px_12px_rgba(15,23,42,0.10)] opacity-0 invisible
                            group-hover:opacity-100 group-hover:visible
                            transition-all duration-150 z-50 py-1">

                    <!-- User info -->
                    <div class="px-3 py-2.5 border-b border-slate-100">
                        <p class="text-xs font-semibold text-slate-900 truncate">{{ userInfo?.fullName || userInfo?.email }}</p>
                        <p class="text-[11px] text-slate-400 mt-0.5 truncate">{{ userInfo?.email }}</p>
                    </div>

                    <!-- My Profile -->
                    <RouterLink to="/profile"
                        class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 mt-1">
                        <CircleUser class="w-3.5 h-3.5 text-slate-400" />
                        My Profile
                    </RouterLink>

                    <div class="border-t border-slate-100 mt-1"></div>

                    <!-- Sign out -->
                    <button @click="handleLogout"
                        class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                        <LogOut class="w-3.5 h-3.5" />
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>


<script setup>
import { Bell, Menu, ChevronDown, LogOut, CircleUser } from '@lucide/vue'
import { RouterLink } from 'vue-router'
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