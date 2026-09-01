<template>
    <div class="relative inline-flex items-center gap-1.5">
        <!-- Filter Toggle Button -->
        <button @click="togglePopover"
            class="inline-flex items-center gap-1.5 px-3 h-8 text-[13px] font-medium rounded transition cursor-pointer"
            :class="[
                hasActiveFilters
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-800'
            ]">
            <ListFilter class="w-4 h-4" />
            <span>Filter</span>
            <span v-if="activeFilterCount > 0"
                class="ml-0.5 px-1.5 py-0.5 text-[11px] font-bold bg-white/20 text-white rounded-full leading-none">
                {{ activeFilterCount }}
            </span>
        </button>

        <!-- Clear filters button (only visible when filters are applied) -->
        <button v-if="hasActiveFilters" @click.stop="clearAllFilters"
            class="inline-flex items-center gap-1 px-2.5 h-8 text-[12px] font-medium text-slate-600 hover:text-red-600 hover:bg-slate-200/60 rounded transition cursor-pointer"
            title="Clear all filters">
            <X class="w-3.5 h-3.5" />
            <span>Clear filters</span>
        </button>

        <!-- Backdrop -->
        <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-40"></div>

        <!-- Jira-style Two Panel Dropdown -->
        <Transition name="filter-panel">
            <div v-if="isOpen"
                class="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 flex overflow-hidden"
                style="width: 520px; max-height: 380px;">

                <!-- Left Panel: Categories -->
                <div class="w-44 border-r border-slate-200 flex flex-col bg-slate-50/50">
                    <div class="flex-1 py-1.5">
                        <button v-for="cat in categories" :key="cat.key" @click="selectedCategory = cat.key"
                            class="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition cursor-pointer text-left"
                            :class="[
                                selectedCategory === cat.key
                                    ? 'bg-white text-blue-600 font-semibold border-l-2 border-blue-600 shadow-sm'
                                    : 'text-slate-700 hover:bg-slate-100 border-l-2 border-transparent'
                            ]">
                            <component :is="cat.icon" class="w-4 h-4 shrink-0"
                                :class="selectedCategory === cat.key ? 'text-blue-600' : 'text-slate-400'" />
                            <span>{{ cat.label }}</span>
                            <span v-if="getFilterCount(cat.key) > 0"
                                class="ml-auto text-[10px] font-bold bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center">
                                {{ getFilterCount(cat.key) }}
                            </span>
                        </button>
                    </div>

                    <!-- Left Panel Footer -->
                    <div class="border-t border-slate-200 px-4 py-2.5">
                        <button @click="clearAllFilters"
                            class="text-[12px] text-slate-400 hover:text-red-600 cursor-pointer transition"
                            :class="{ 'text-red-500! font-medium': hasActiveFilters }">
                            Clear all
                        </button>
                    </div>
                </div>

                <!-- Right Panel: Options -->
                <div class="flex-1 flex flex-col min-w-0">
                    <!-- Search Box -->
                    <div class="px-3 pt-3 pb-2">
                        <div class="relative">
                            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input v-model="searchKeyword" type="text"
                                :placeholder="`Search ${currentCategoryLabel.toLowerCase()}`"
                                class="w-full pl-8 pr-3 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-400 focus:bg-white transition placeholder:text-slate-400" />
                        </div>
                    </div>

                    <!-- Options List -->
                    <div class="flex-1 overflow-y-auto px-1">
                        <!-- Type Options -->
                        <template v-if="selectedCategory === 'type'">
                            <label v-for="opt in filteredTypeOptions" :key="opt.value"
                                class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer transition mx-1">
                                <input type="checkbox" :checked="isSelected('type', opt.value)"
                                    @change="toggleFilter('type', opt.value)"
                                    class="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600" />
                                <span class="w-3 h-3 rounded-sm shrink-0"
                                    :style="{ backgroundColor: opt.color }"></span>
                                <span class="text-[13px] text-slate-700">{{ opt.label }}</span>
                            </label>
                        </template>

                        <!-- Priority Options -->
                        <template v-if="selectedCategory === 'priority'">
                            <label v-for="opt in filteredPriorityOptions" :key="opt.value"
                                class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer transition mx-1">
                                <input type="checkbox" :checked="isSelected('priority', opt.value)"
                                    @change="toggleFilter('priority', opt.value)"
                                    class="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600" />
                                <span class="w-3 h-3 rounded-full shrink-0"
                                    :style="{ backgroundColor: opt.color }"></span>
                                <span class="text-[13px] text-slate-700">{{ opt.label }}</span>
                            </label>
                        </template>

                        <!-- Category Options -->
                        <template v-if="selectedCategory === 'column.category'">
                            <label v-for="opt in filteredCategoryOptions" :key="opt.value"
                                class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer transition mx-1">
                                <input type="checkbox" :checked="isSelected('column.category', opt.value)"
                                    @change="toggleFilter('column.category', opt.value)"
                                    class="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600" />
                                <span class="w-2.5 h-2.5 rounded-full shrink-0"
                                    :style="{ backgroundColor: opt.color }"></span>
                                <span class="text-[13px] text-slate-700">{{ opt.label }}</span>
                            </label>
                        </template>

                        <!-- Assignee Options -->
                        <template v-if="selectedCategory === 'assignee.id'">
                            <!-- Unassigned Option -->
                            <label v-if="showUnassignedOption"
                                class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer transition mx-1">
                                <input type="checkbox" :checked="isSelected('assignee.id', '__unassigned__')"
                                    @change="toggleFilter('assignee.id', '__unassigned__')"
                                    class="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600" />
                                <div
                                    class="w-6 h-6 rounded-full flex items-center justify-center bg-slate-200 shrink-0">
                                    <Users class="w-3.5 h-3.5 text-slate-400" />
                                </div>
                                <span class="text-[13px] text-slate-700">Unassigned</span>
                            </label>
                            <!-- Member Options -->
                            <label v-for="member in filteredAssigneeOptions" :key="member.user.id"
                                class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer transition mx-1">
                                <input type="checkbox" :checked="isSelected('assignee.id', String(member.user.id))"
                                    @change="toggleFilter('assignee.id', String(member.user.id))"
                                    class="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600" />
                                <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0"
                                    :style="{ backgroundColor: getAvatarColor(member.user.email) }">
                                    {{ getInitials(member.user.email) }}
                                </div>
                                <span class="text-[13px] text-slate-700 truncate">{{ member.user.email }}</span>
                            </label>
                        </template>

                        <!-- Empty State -->
                        <div v-if="currentOptionsEmpty"
                            class="flex flex-col items-center justify-center py-8 text-slate-400">
                            <SearchX class="w-6 h-6 mb-1.5" />
                            <span class="text-xs">No results found</span>
                        </div>
                    </div>

                    <!-- Right Panel Footer -->
                    <div class="border-t border-slate-200 px-4 py-2.5 flex items-center justify-between">
                        <button @click="clearCategoryFilter" class="text-[12px] cursor-pointer transition" :class="[
                            getFilterCount(selectedCategory) > 0
                                ? 'text-blue-600 hover:text-blue-800 font-medium'
                                : 'text-slate-300 cursor-default'
                        ]" :disabled="getFilterCount(selectedCategory) === 0">
                            Clear
                        </button>
                        <span class="text-[12px] text-slate-400">
                            {{ getFilterCount(selectedCategory) }} of {{ getTotalOptions(selectedCategory) }}
                        </span>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ListFilter, X, Search, SearchX, Tag, Signal, Columns3, Users } from '@lucide/vue'

const props = defineProps({
    members: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['filter-change'])

const isOpen = ref(false)
const searchKeyword = ref('')
const selectedCategory = ref('type')

// Filter state: { 'type': ['TASK', 'BUG'], 'priority': ['HIGH'], ... }
const activeFilters = ref({})

/* ── Categories ── */
const categories = [
    { key: 'type', label: 'Type', icon: Tag },
    { key: 'priority', label: 'Priority', icon: Signal },
    { key: 'column.category', label: 'Status', icon: Columns3 },
    { key: 'assignee.id', label: 'Assignee', icon: Users }
]

/* ── Filter Options ── */
const typeOptions = [
    { value: 'STORY', label: 'Story', color: '#16a34a' },
    { value: 'TASK', label: 'Task', color: '#2563eb' },
    { value: 'BUG', label: 'Bug', color: '#dc2626' },
    { value: 'EPIC', label: 'Epic', color: '#9333ea' }
]

const priorityOptions = [
    { value: 'LOW', label: 'Low', color: '#16a34a' },
    { value: 'MEDIUM', label: 'Medium', color: '#d97706' },
    { value: 'HIGH', label: 'High', color: '#dc2626' },
    { value: 'URGENT', label: 'Urgent', color: '#991b1b' }
]

const categoryOptions = [
    { value: 'TO_DO', label: 'To Do', color: '#64748b' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: '#2563eb' },
    { value: 'DONE', label: 'Done', color: '#16a34a' }
]

/* ── Search-filtered options ── */
const filterBySearch = (options) => {
    if (!searchKeyword.value.trim()) return options
    const kw = searchKeyword.value.toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(kw))
}

const filteredTypeOptions = computed(() => filterBySearch(typeOptions))
const filteredPriorityOptions = computed(() => filterBySearch(priorityOptions))
const filteredCategoryOptions = computed(() => filterBySearch(categoryOptions))

const filteredAssigneeOptions = computed(() => {
    if (!searchKeyword.value.trim()) return props.members
    const kw = searchKeyword.value.toLowerCase()
    return props.members.filter(m => m.user.email.toLowerCase().includes(kw))
})

const showUnassignedOption = computed(() => {
    if (!searchKeyword.value.trim()) return true
    return 'unassigned'.includes(searchKeyword.value.toLowerCase())
})

const currentCategoryLabel = computed(() => {
    return categories.find(c => c.key === selectedCategory.value)?.label || ''
})

const currentOptionsEmpty = computed(() => {
    if (!searchKeyword.value.trim()) return false
    switch (selectedCategory.value) {
        case 'type': return filteredTypeOptions.value.length === 0
        case 'priority': return filteredPriorityOptions.value.length === 0
        case 'column.category': return filteredCategoryOptions.value.length === 0
        case 'assignee.id': return filteredAssigneeOptions.value.length === 0
        default: return false
    }
})

/* ── Filter Logic ── */
const isSelected = (key, value) => {
    return activeFilters.value[key]?.includes(value) ?? false
}

const toggleFilter = (key, value) => {
    if (!activeFilters.value[key]) {
        activeFilters.value[key] = []
    }
    const idx = activeFilters.value[key].indexOf(value)
    if (idx === -1) {
        activeFilters.value[key].push(value)
    } else {
        activeFilters.value[key].splice(idx, 1)
        if (activeFilters.value[key].length === 0) {
            delete activeFilters.value[key]
        }
    }
    emitFilterChange()
}

const clearAllFilters = () => {
    activeFilters.value = {}
    emitFilterChange()
}

const clearCategoryFilter = () => {
    if (activeFilters.value[selectedCategory.value]) {
        delete activeFilters.value[selectedCategory.value]
        emitFilterChange()
    }
}

const togglePopover = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
        searchKeyword.value = ''
    }
}

/* ── Computed Helpers ── */
const hasActiveFilters = computed(() => Object.keys(activeFilters.value).length > 0)

const activeFilterCount = computed(() => {
    return Object.values(activeFilters.value).reduce((sum, arr) => sum + arr.length, 0)
})

const getFilterCount = (categoryKey) => {
    return activeFilters.value[categoryKey]?.length || 0
}

const getTotalOptions = (categoryKey) => {
    switch (categoryKey) {
        case 'type': return typeOptions.length
        case 'priority': return priorityOptions.length
        case 'column.category': return categoryOptions.length
        case 'assignee.id': return props.members.length + 1 // +1 for Unassigned
        default: return 0
    }
}

/* ── Emit ── */
const buildFilterParams = () => {
    const params = []
    for (const [key, values] of Object.entries(activeFilters.value)) {
        for (const val of values) {
            // Skip __unassigned__ from API params (handled client-side)
            if (val === '__unassigned__') continue
            params.push(`${key}:${val}`)
        }
    }
    return params
}

const emitFilterChange = () => {
    const includeUnassigned = isSelected('assignee.id', '__unassigned__')
    emit('filter-change', buildFilterParams(), includeUnassigned)
}

/* ── Utils ── */
const getInitials = (email) => {
    if (!email) return '?'
    const name = email.split('@')[0]
    return name.substring(0, 1).toUpperCase()
}

const avatarColors = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777', '#2563eb']
const getAvatarColor = (email) => {
    if (!email) return avatarColors[0]
    let hash = 0
    for (let i = 0; i < email.length; i++) {
        hash = email.charCodeAt(i) + ((hash << 5) - hash)
    }
    return avatarColors[Math.abs(hash) % avatarColors.length]
}

// Reset search when switching category
watch(selectedCategory, () => {
    searchKeyword.value = ''
})
</script>

<style scoped>
.filter-panel-enter-active {
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.filter-panel-leave-active {
    transition: all 0.12s ease-in;
}

.filter-panel-enter-from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
}

.filter-panel-leave-to {
    opacity: 0;
    transform: translateY(-2px) scale(0.99);
}
</style>
