<template>
    <Transition name="fade">
        <div v-if="open" class="fixed inset-0 bg-black/50 z-40 lg:hidden" @click="$emit('close')" />
    </Transition>
    <aside :class="[
        'fixed left-0 top-0 h-full w-60 bg-surface flex flex-col py-xl border-r-2 border-slate-200 z-50',
        'transform transition-transform duration-300 ease-in-out',
        'lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
    ]">
        <div class="mb-4">
            <h1 class="text-[20px] uppercase text-center">Humfiy</h1>
            <p class="text-center text-lg">Dashboard Management</p>
        </div>
        <nav class="flex-1">
            <div class="flex flex-col">
                <router-link v-for="item in visibleMenus" :key="item.name" :to="{ name: item.name }" :class="['flex items-center gap-md px-xl py-md font-bold hover:bg-surface transition-colors opacity-80',
                    isActive(item.name) ? 'border-r-2 border-primary' : '']">
                    <span class="font-bold">
                        <component :is="item.icon"></component>
                    </span>
                    <span class="font-body-md text-body-md">{{ item.label }}</span>
                </router-link>
                <router-link v-if="open"
                    class="flex items-center gap-md px-xl py-md font-bold hover:bg-surface transition-colors opacity-80 text-red-500">
                    <span class="font-bold">
                        <door-open></door-open>
                    </span>
                    <span class="font-body-md text-body-md">Logout</span>
                </router-link>
            </div>
        </nav>
    </aside>
</template>

<script setup>
import { Building2, CalendarCheck, DoorOpen, IdCardLanyard, LayoutDashboard, Network, ShieldCogCorner, UserLock, Users } from '@lucide/vue';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../store/authStore';

const route = useRoute()
const authStore = useAuthStore()

const props = defineProps({
    open: {
        type: Boolean,
        default: false
    }
})

defineEmits(['close'])

const menus = [
    {
        label: 'Overview',
        icon: LayoutDashboard,
        name: 'Dashboard',
        permission: null
    },
    {
        label: 'Attendance',
        icon: CalendarCheck,
        name: 'Attendance',
        permission: 'ATTENDANCE'
    },
    {
        label: 'Branches',
        icon: Building2,
        name: 'Branches',
        permission: 'BRANCH'
    },
    {
        label: 'Department',
        icon: Network,
        name: 'Departments',
        permission: 'DEPARTMENT'
    },
    {
        label: 'Positions',
        icon: IdCardLanyard,
        name: 'Positions',
        permission: 'POSITION'
    },
    {
        label: 'Employees',
        icon: Users,
        name: 'Employees',
        permission: 'EMPLOYEE'
    },
    {
        label: 'Role',
        icon: UserLock,
        name: 'Roles',
        permission: 'ROLE'
    },
    {
        label: 'Permission',
        icon: ShieldCogCorner,
        name: 'Permissions',
        permission: 'PERMISSION'
    }
]

const visibleMenus = computed(() => {
    return menus.filter(item => {
        if (!item.permission) return true
        if (authStore.isSystemAdmin) return true
        return authStore.canView(item.permission)
    })
})

const isActive = (name) => route.name?.toString().startsWith(name)
</script>