<template>
    <aside class="fixed left-0 top-0 h-full w-60 bg-surface flex flex-col py-xl border-r-2 border-slate-200 z-50">
        <div class="mb-4">
            <h1 class="text-[20px] uppercase text-center">Humfiy</h1>
            <p class="text-center text-lg">Dashboard Management</p>
        </div>
        <nav class="flex-1">
            <div class="flex flex-col">
                <router-link v-for="item in menus" :key="item.name" :to="{ name: item.name }" :class="['flex items-center gap-md px-xl py-md font-bold hover:bg-surface transition-colors opacity-80',
                    isActive(item.name) ? 'border-r-2 border-primary' : '']">
                    <span class="font-bold">
                        <component :is="item.icon"></component>
                    </span>
                    <span class="font-body-md text-body-md">{{ item.label }}</span>
                </router-link>
            </div>
        </nav>
    </aside>
</template>

<script setup>
import { Building2, CalendarCheck, IdCardLanyard, LayoutDashboard, Network, ShieldCogCorner, UserLock, Users } from '@lucide/vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const menus = [
    {
        label: 'Overview',
        icon: LayoutDashboard,
        name: 'Dashboard'
    },
    {
        label: 'Attendance',
        icon: CalendarCheck,
        name: 'Attendance'
    },
    {
        label: 'Branches',
        icon: Building2,
        name: 'Branches'
    },
    {
        label: 'Department',
        icon: Network,
        name: 'Departments'
    },
    {
        label: 'Positions',
        icon: IdCardLanyard,
        name: 'Positions'
    },
    {
        label: 'Employees',
        icon: Users,
        name: 'Employees'
    },
    {
        label: 'Role',
        icon: UserLock,
        name: 'Roles'
    },
    {
        label: 'Permission',
        icon: ShieldCogCorner,
        name: 'Permissions'
    }
]

const isActive = (name) => route.name?.toString().startsWith(name)
</script>