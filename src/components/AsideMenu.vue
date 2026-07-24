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
        <div class="flex justify-center">
            <img class="w-30" src="https://res.cloudinary.com/dmzsletu0/image/upload/v1782044819/logo_lgugm5.png"
                alt="">
        </div>
        <nav class="flex-1 overflow-auto scrollbar-none">
            <div class="flex flex-col">
                <template v-for="item in visibleMenus" :key="item.id || item.name">
                    <router-link v-if="!item.children" :to="{ name: item.name }" :class="['flex items-center gap-md px-xl py-md font-bold hover:bg-surface transition-colors opacity-80',
                        isActive(item.name) ? 'border-r-2 border-primary' : '']">
                        <span class="font-bold">
                            <component :is="item.icon"></component>
                        </span>
                        <span class="font-body-md text-body-md">{{ item.label }}</span>
                    </router-link>
                    <div v-else>
                        <button @click="toggleMenu(item.id)" :class="['w-full flex items-center justify-between gap-md px-xl py-md font-bold hover:bg-surface transition-colors opacity-80 cursor-pointer',
                            isParentActive(item) ? 'border-r-2 border-primary' : '']">
                            <span class="flex items-center gap-md">
                                <span class="font-bold">
                                    <component :is="item.icon"></component>
                                </span>
                                <span class="font-body-md text-body-md">{{ item.label }}</span>
                            </span>
                            <ChevronDown class="w-4 h4 duration-75" :class="openMenus === item.id ? 'rotate-180' : ''">
                            </ChevronDown>
                        </button>
                        <div v-show="openMenus === item.id" class="flex flex-col">
                            <router-link v-for="child in visibleChildren(item)" :key="child.name"
                                :to="{ name: child.name }" :class="['flex items-center gap-md pl-12 pr-xl py-sm font-body-md font-medium transition-colors opacity-80',
                                    isActive(child.name) ? 'border-r-2 border-primary text-primary' : '']">
                                <component v-if="child.icon" :is="child.icon" class="w-5 h-5"></component>
                                <span class="text-[16px]">{{ child.label }}</span>
                            </router-link>
                        </div>
                    </div>
                </template>
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
import { Building2, HandCoins, CalendarCheck, DoorOpen, DoorClosed, FolderKanban, IdCardLanyard, LayoutDashboard, Network, ShieldCogCorner, UserLock, Users, ChevronDown, ShieldUser, CircleUser, Building, FileText } from '@lucide/vue';
import { computed, onMounted, ref, watch } from 'vue';
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

const openMenus = ref(null)

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
        label: 'Payroll',
        icon: HandCoins,
        name: 'Payroll',
        permission: 'PAYROLL'
    },
    {
        id: 'organization',
        label: 'Organization',
        icon: Building,
        name: 'Branches',
        children: [
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
        ]
    },
    {
        id: 'people',
        label: 'People',
        icon: Users,
        children: [
            {
                label: 'Employees',
                icon: Users,
                name: 'Employees',
                permission: 'EMPLOYEE'
            },
            {
                label: 'Positions',
                icon: IdCardLanyard,
                name: 'Positions',
                permission: 'POSITION'
            },
            {
                label: 'Contract',
                icon: FileText,
                name: 'Contracts',
                permission: null
            }
        ]
    },
    {
        label: 'Project',
        icon: FolderKanban,
        name: 'Project',
        permission: null
    },
    {
        label: 'LeaveType',
        icon: DoorClosed,
        name: 'LeaveTypes',
        permission: null
    },
    {
        label: 'Payroll Admin',
        icon: HandCoins,
        name: 'PayrollAdmin',
        permission: null
    },
    {
        id: 'security',
        label: 'Security',
        icon: ShieldUser,
        children: [
            {
                label: 'Account',
                icon: CircleUser,
                name: 'AccountManager',
                permission: null
            },
            {
                label: 'Role',
                icon: UserLock,
                name: 'Roles',
                permission: 'ROLE',
                isSystemAdmin: false
            },
            {
                label: 'Permission',
                icon: ShieldCogCorner,
                name: 'Permissions',
                permission: 'PERMISSION',
                isSystemAdmin: true
            },
        ]
    }
]

const visibleMenus = computed(() => {
    return menus
        .filter(item => canSeeItem(item))
        .map(item => {
            if (!item.children) return item
            const children = item.children.filter(child => canSeeItem(child))
            return children.length ? { ...item, children } : null
        })
})

const visibleChildren = (item) => item.children?.filter(child => canSeeItem(child));

const canSeeItem = (item) => {
    if (!item.permission) return true
    if (authStore.isSystemAdmin) return true
    if (item?.isSystemAdmin) return authStore.isSystemAdmin
    return authStore.canView(item.permission)
}

const toggleMenu = (id) => {
    openMenus.value = openMenus.value === id ? null : id
}

const isActive = (name) => route.name?.toString().startsWith(name)

const isParentActive = (item) => item.children?.some(child => isActive(child.name))

watch(() => route.name, (name) => {
    const parent = visibleMenus.value.find(menu =>
        menu.children?.some(child => child.name === name)
    )

    if (parent) {
        openMenus.value = parent.id
    }
}, { immediate: true })

</script>