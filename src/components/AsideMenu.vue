<template>
    <Transition name="fade">
        <div v-if="open" class="fixed inset-0 bg-black/60 z-40 lg:hidden" @click="$emit('close')" />
    </Transition>
    <aside :class="[
        'fixed left-0 top-0 h-full w-60 flex flex-col z-50',
        'transform transition-transform duration-300 ease-in-out',
        'lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
    ]" style="background: var(--sidebar-bg); border-right: 1px solid rgba(255,255,255,0.06);">

        <!-- Logo -->
        <div class="flex items-center justify-center px-2 h-14 border-b shrink-0 overflow-hidden"
            style="border-color: rgba(255,255,255,0.07);">
            <img class="h-13 w-auto object-contain max-h-14 scale-110" :src="logoImg" alt="Humify">
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-3 hide-scrollbar">
            <div class="flex flex-col gap-0.5 px-2">
                <template v-for="item in visibleMenus" :key="item.id || item.name">

                    <!-- Single nav item -->
                    <router-link v-if="!item.children" :to="{ name: item.name }" :class="[
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150',
                        isActive(item.name)
                            ? 'text-white'
                            : 'hover:text-slate-200'
                    ]" :style="isActive(item.name)
                        ? 'background: var(--sidebar-item-active); color: var(--sidebar-text-active);'
                        : 'color: var(--sidebar-text);'"
                        @mouseover="e => !isActive(item.name) && (e.currentTarget.style.background = 'var(--sidebar-item-hover)')"
                        @mouseleave="e => !isActive(item.name) && (e.currentTarget.style.background = 'transparent')">
                        <span class="w-4 h-4 shrink-0 flex items-center justify-center"
                            :style="isActive(item.name) ? 'color: var(--sidebar-accent)' : ''">
                            <component :is="item.icon" class="w-4 h-4" />
                        </span>
                        <span>{{ item.label }}</span>
                        <span v-if="isActive(item.name)" class="ml-auto w-1 h-4 rounded-full shrink-0"
                            style="background: var(--sidebar-accent);">
                        </span>
                    </router-link>

                    <!-- Expandable nav item -->
                    <div v-else>
                        <button @click="toggleMenu(item.id)" :class="[
                            'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer',
                        ]" :style="isParentActive(item)
                            ? 'background: var(--sidebar-item-active); color: var(--sidebar-text-active);'
                            : 'color: var(--sidebar-text);'"
                            @mouseover="e => !isParentActive(item) && (e.currentTarget.style.background = 'var(--sidebar-item-hover)')"
                            @mouseleave="e => !isParentActive(item) && (e.currentTarget.style.background = 'transparent')">
                            <span class="w-4 h-4 shrink-0 flex items-center justify-center"
                                :style="isParentActive(item) ? 'color: var(--sidebar-accent)' : ''">
                                <component :is="item.icon" class="w-4 h-4" />
                            </span>
                            <span class="flex-1 text-left">{{ item.label }}</span>
                            <ChevronDown class="w-3.5 h-3.5 shrink-0 transition-transform duration-150"
                                :class="openMenus === item.id ? 'rotate-180' : ''"
                                style="color: var(--sidebar-text);" />
                        </button>

                        <!-- Children -->
                        <div v-show="openMenus === item.id" class="mt-0.5 ml-3 pl-4 flex flex-col gap-0.5"
                            style="border-left: 1px solid rgba(255,255,255,0.08);">
                            <router-link v-for="child in visibleChildren(item)" :key="child.name"
                                :to="{ name: child.name }" :class="[
                                    'flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors duration-150',
                                    isActive(child.name) ? 'font-medium' : 'font-normal'
                                ]" :style="isActive(child.name)
                                    ? 'color: white; background: var(--sidebar-item-active);'
                                    : 'color: var(--sidebar-text);'"
                                @mouseover="e => !isActive(child.name) && (e.currentTarget.style.background = 'var(--sidebar-item-hover)') && (e.currentTarget.style.color = 'var(--sidebar-text-hover)')"
                                @mouseleave="e => !isActive(child.name) && (e.currentTarget.style.background = 'transparent') && (e.currentTarget.style.color = 'var(--sidebar-text)')">
                                <component v-if="child.icon" :is="child.icon" class="w-3.5 h-3.5 shrink-0"
                                    :style="isActive(child.name) ? 'color: var(--sidebar-accent)' : ''" />
                                <span>{{ child.label }}</span>
                            </router-link>
                        </div>
                    </div>

                </template>
            </div>
        </nav>

        <!-- Bottom: version or branding -->
        <div class="px-5 py-3 shrink-0" style="border-top: 1px solid rgba(255,255,255,0.06);">
            <p class="text-xs" style="color: rgba(148,163,184,0.5);">Humify HRM</p>
        </div>
    </aside>
</template>


<script setup>
import { Building2, HandCoins, CalendarCheck, DoorOpen, DoorClosed, FolderKanban, IdCardLanyard, LayoutDashboard, Network, ShieldCogCorner, UserLock, Users, ChevronDown, ShieldUser, CircleUser, Building, FileText, TrendingUp, Timer } from '@lucide/vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import logoImg from '../assets/logo-through.jpg';

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
        permission: null
    },
    {
        label: 'Payslip',
        icon: HandCoins,
        name: 'Payroll',
        permission: 'PAYSLIP'
    },
    {
        label: 'Project',
        icon: FolderKanban,
        name: 'Project',
        permission: 'PROJECT'
    },
    {
        id: 'organization',
        label: 'Organization',
        icon: Building,
        children: [
            {
                label: 'Branches',
                icon: Building2,
                name: 'Branches',
                permission: 'BRANCH'
            },
            {
                label: 'Departments',
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
                label: 'Contracts',
                icon: FileText,
                name: 'Contracts',
                permission: 'CONTRACT'
            }
        ]
    },
    {
        label: 'Work Shifts',
        icon: Timer,
        name: 'WorkShifts',
        permission: 'WORK_SHIFT'
    },
    {
        label: 'Leave Types',
        icon: DoorClosed,
        name: 'LeaveTypes',
        permission: 'LEAVE'
    },
    {
        label: 'Payroll',
        icon: HandCoins,
        name: 'PayrollAdmin',
        permission: 'PAYROLL'
    },
    {
        id: 'security',
        label: 'Security',
        icon: ShieldUser,
        children: [
            {
                label: 'Accounts',
                icon: CircleUser,
                name: 'AccountManager',
                permission: 'USER'
            },
            {
                label: 'Roles',
                icon: UserLock,
                name: 'Roles',
                permission: 'ROLE'
            },
            {
                label: 'Permissions',
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
        .map(item => {
            if (!canSeeItem(item)) return null
            if (!item.children) return item
            const children = item.children.filter(child => canSeeItem(child))
            return children.length ? { ...item, children } : null
        })
        .filter(Boolean)
})

const visibleChildren = (item) => item?.children?.filter(child => canSeeItem(child)) || [];

const canSeeItem = (item) => {
    if (!item) return false
    // Không yêu cầu permission → mọi người đăng nhập đều thấy
    if (!item.permission) return true
    // SystemAdmin thấy tất cả
    if (authStore.isSystemAdmin) return true
    // isSystemAdmin flag → chỉ SystemAdmin mới thấy
    if (item?.isSystemAdmin) return false
    // Kiểm tra quyền READ hoặc FULL
    return authStore.canView(item.permission)
}

const toggleMenu = (id) => {
    openMenus.value = openMenus.value === id ? null : id
}

const isActive = (name) => route.name?.toString().startsWith(name)

const isParentActive = (item) => item?.children?.some(child => isActive(child.name))

watch(() => route.name, (name) => {
    const parent = visibleMenus.value.find(menu =>
        menu?.children?.some(child => child.name === name)
    )

    if (parent) {
        openMenus.value = parent.id
    }
}, { immediate: true })

</script>