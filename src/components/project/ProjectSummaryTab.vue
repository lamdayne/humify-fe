<template>
    <div class="p-6 bg-slate-100 min-h-screen text-slate-800 font-sans">
        <!-- Skeleton Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div v-for="i in 4" :key="i" class="h-24 bg-white border border-slate-200 rounded-xl animate-pulse"></div>
        </div>

        <template v-else>
            <!-- 4 Top KPI Metric Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <!-- KPI 1: Completed -->
                <div class="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center gap-4 shadow-xs hover:shadow-md transition">
                    <div class="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 class="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <div class="text-xl font-bold text-slate-900">{{ summaryData?.kpis?.completedLast7Days || 0 }} completed</div>
                        <div class="text-xs text-slate-500 mt-0.5">in the last 7 days</div>
                    </div>
                </div>

                <!-- KPI 2: Updated -->
                <div class="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center gap-4 shadow-xs hover:shadow-md transition">
                    <div class="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <Edit3 class="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <div class="text-xl font-bold text-slate-900">{{ summaryData?.kpis?.updatedLast7Days || 0 }} updated</div>
                        <div class="text-xs text-slate-500 mt-0.5">in the last 7 days</div>
                    </div>
                </div>

                <!-- KPI 3: Created -->
                <div class="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center gap-4 shadow-xs hover:shadow-md transition">
                    <div class="w-11 h-11 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                        <CheckSquare class="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <div class="text-xl font-bold text-slate-900">{{ summaryData?.kpis?.createdLast7Days || 0 }} created</div>
                        <div class="text-xs text-slate-500 mt-0.5">in the last 7 days</div>
                    </div>
                </div>

                <!-- KPI 4: Due Soon -->
                <div class="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center gap-4 shadow-xs hover:shadow-md transition">
                    <div class="w-11 h-11 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                        <Calendar class="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <div class="text-xl font-bold text-slate-900">{{ summaryData?.kpis?.dueSoonNext7Days || 0 }} due soon</div>
                        <div class="text-xs text-slate-500 mt-0.5">in the next 7 days</div>
                    </div>
                </div>
            </div>

            <!-- Row 2: Status Overview & Recent Activity -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Status Overview Widget -->
                <div class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <h3 class="text-base font-bold text-slate-900">Status overview</h3>
                        <p class="text-xs text-slate-500 mt-1 mb-6">
                            Get a snapshot of the status of your work items.
                            <button @click="$emit('switchTab', 'board')" class="text-blue-600 font-medium hover:underline cursor-pointer ml-1">
                                View all work items
                            </button>
                        </p>
                    </div>

                    <!-- Donut Chart & Legend Container -->
                    <div class="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
                        <!-- SVG Donut Chart -->
                        <div class="relative w-44 h-44 flex items-center justify-center shrink-0">
                            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <!-- Background Circle -->
                                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#E2E8F0" stroke-width="12" />

                                <!-- Segment Circles -->
                                <circle v-for="(seg, idx) in donutSegments" :key="idx" cx="50" cy="50" r="38"
                                    fill="transparent"
                                    :stroke="seg.color"
                                    stroke-width="12"
                                    :stroke-dasharray="`${seg.dashArray} 238.76`"
                                    :stroke-dashoffset="-seg.dashOffset"
                                    stroke-linecap="butt"
                                    class="transition-all duration-500" />
                            </svg>
                            <!-- Donut Center Content -->
                            <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                                <span class="text-2xl font-extrabold text-slate-900 leading-none">
                                    {{ summaryData?.statusOverview?.totalWorkItems || 0 }}
                                </span>
                                <span class="text-[11px] text-slate-500 truncate max-w-[100px] mt-1 font-medium">
                                    Total work items
                                </span>
                            </div>
                        </div>

                        <!-- Status Legend List -->
                        <div class="flex flex-col gap-2.5 w-full sm:w-auto">
                            <div v-for="(st, idx) in statusCounts" :key="st.columnId || idx" class="flex items-center gap-2.5 text-xs text-slate-700">
                                <span class="w-3 h-3 rounded-xs shrink-0" :style="{ backgroundColor: getStatusColor(st.category, idx) }"></span>
                                <span class="font-medium truncate max-w-[120px]">{{ st.name }}:</span>
                                <span class="font-bold text-slate-900">{{ st.count }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity Widget -->
                <div class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs flex flex-col">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h3 class="text-base font-bold text-slate-900">Recent activity</h3>
                            <p class="text-xs text-slate-500 mt-1">Stay up to date with what's happening across the space.</p>
                        </div>
                        <button @click="showActivityModal = true" class="text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer" title="Expand activity">
                            <Maximize2 class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Timeline Content -->
                    <div class="flex-1 overflow-y-auto max-h-[260px] pr-1 space-y-4 hide-scrollbar">
                        <div v-if="!recentActivities || recentActivities.length === 0" class="py-10 text-center text-xs text-slate-400">
                            No recent activity found.
                        </div>

                        <div v-else v-for="(group, dateLabel) in groupedActivities" :key="dateLabel" class="space-y-3">
                            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                {{ dateLabel }}
                            </div>

                            <div v-for="act in group" :key="act.id" class="flex items-start gap-3">
                                <!-- User Avatar Badge -->
                                <div class="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                    {{ getInitials(act.userName) }}
                                </div>

                                <!-- Activity Log Text -->
                                <div class="text-xs leading-relaxed text-slate-600 flex-1">
                                    <span class="font-bold text-slate-900">{{ act.userName }}</span>
                                    <span> {{ formatActionText(act) }} </span>
                                    
                                    <!-- Task Link Pill -->
                                    <span v-if="act.taskKey" class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold ml-1">
                                        <CheckSquare class="w-3 h-3 text-blue-600" />
                                        <span>{{ act.taskKey }}: {{ act.taskTitle }}</span>
                                    </span>

                                    <!-- Status Badge if present -->
                                    <span v-if="act.taskColumnName" class="inline-block px-1.5 py-0.2 text-[10px] uppercase font-bold tracking-wider rounded bg-slate-100 border border-slate-200 text-slate-700 ml-1.5">
                                        {{ act.taskColumnName }}
                                    </span>

                                    <div class="text-[10px] text-slate-400 mt-0.5">
                                        {{ formatTimeAgo(act.createdAt) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Row 3: Priority Breakdown & Types of Work -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Priority Breakdown Widget -->
                <div class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
                    <h3 class="text-base font-bold text-slate-900">Priority breakdown</h3>
                    <p class="text-xs text-slate-500 mt-1 mb-6">
                        Get a holistic view of how work is being prioritized.
                    </p>

                    <!-- Bar Chart -->
                    <div class="h-48 flex items-end justify-between px-4 pb-4 pt-6 border-b border-slate-200 relative">
                        <!-- Y Axis Lines -->
                        <div class="absolute inset-x-0 bottom-4 border-b border-slate-100"></div>
                        <div class="absolute inset-x-0 bottom-16 border-b border-slate-100"></div>
                        <div class="absolute inset-x-0 bottom-28 border-b border-slate-100"></div>

                        <!-- Bars -->
                        <div v-for="item in priorityList" :key="item.priority" class="flex flex-col items-center flex-1 z-10 group cursor-pointer">
                            <!-- Tooltip -->
                            <div class="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-slate-100 text-[11px] py-1 px-2.5 rounded shadow-lg mb-2 border border-slate-700 text-center font-medium">
                                {{ item.label }}<br />
                                <span class="font-bold text-white">{{ item.count }}</span>
                            </div>

                            <!-- Bar Column -->
                            <div class="w-10 bg-slate-300 group-hover:bg-blue-600 transition-all rounded-t-xs"
                                :style="{ height: `${calculateBarHeight(item.count)}px` }">
                            </div>
                        </div>
                    </div>

                    <!-- X Axis Labels -->
                    <div class="flex items-center justify-between px-4 mt-3 text-xs text-slate-500 font-medium">
                        <div v-for="item in priorityList" :key="item.priority" class="flex-1 text-center flex items-center justify-center gap-1">
                            <span :class="getPriorityIconClass(item.priority)">≈</span>
                            <span>{{ item.label }}</span>
                        </div>
                    </div>
                </div>

                <!-- Types of Work Widget -->
                <div class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
                    <div class="flex items-center justify-between mb-1">
                        <h3 class="text-base font-bold text-slate-900">Types of work</h3>
                    </div>
                    <p class="text-xs text-slate-500 mb-6">
                        Get a breakdown of work items by their types.
                        <button @click="$emit('switchTab', 'board')" class="text-blue-600 font-medium hover:underline cursor-pointer ml-1">
                            View all items
                        </button>
                    </p>

                    <!-- Work Type Rows -->
                    <div class="space-y-4">
                        <div v-for="t in typeList" :key="t.type" class="flex items-center gap-4">
                            <!-- Type Icon & Label -->
                            <div class="flex items-center gap-2.5 w-28 shrink-0 text-xs font-semibold text-slate-700">
                                <component :is="getTypeIcon(t.type)" class="w-4 h-4 shrink-0" :class="getTypeIconColor(t.type)" />
                                <span>{{ formatTypeName(t.type) }}</span>
                            </div>

                            <!-- Progress Bar -->
                            <div class="flex-1 bg-slate-100 h-6 rounded-xs overflow-hidden relative border border-slate-200/50">
                                <div class="bg-slate-500 h-full transition-all duration-500"
                                    :style="{ width: `${t.percentage}%` }">
                                </div>
                                <span v-if="t.percentage > 0" class="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-800">
                                    {{ t.percentage }}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Row 4: Team Workload (Full Width) -->
            <div class="mb-6">
                <!-- Team Workload Widget -->
                <div class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs">
                    <h3 class="text-base font-bold text-slate-900">Team workload</h3>
                    <p class="text-xs text-slate-500 mt-1 mb-6">
                        Monitor the capacity of your team.
                        <span class="text-blue-600 font-medium hover:underline cursor-pointer ml-1">
                            Reassign work items to get the right balance
                        </span>
                    </p>

                    <div class="space-y-4">
                        <div v-for="(member, idx) in workloadList" :key="member.userId || idx" class="flex items-center gap-4">
                            <!-- Assignee Info -->
                            <div class="flex items-center gap-2.5 w-44 shrink-0 text-xs font-semibold text-slate-700 truncate">
                                <div v-if="member.avatar" class="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-slate-200">
                                    <img :src="member.avatar" alt="" class="w-full h-full object-cover" />
                                </div>
                                <div v-else-if="member.userId" class="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                    {{ getInitials(member.userName) }}
                                </div>
                                <div v-else class="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                                    <User class="w-3.5 h-3.5" />
                                </div>

                                <span class="truncate">{{ member.userName }}</span>
                            </div>

                            <!-- Workload Progress Bar -->
                            <div class="flex-1 bg-slate-100 h-6 rounded-xs overflow-hidden relative border border-slate-200/50">
                                <div class="bg-slate-500 h-full transition-all duration-500"
                                    :style="{ width: `${member.percentage}%` }">
                                </div>
                                <span v-if="member.percentage > 0" class="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-800">
                                    {{ member.percentage }}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- Recent Activity Expanded Modal -->
        <ModalGeneric v-model="showActivityModal" title="Recent activity" width="680px">
            <p class="text-xs text-slate-500 -mt-3 mb-4">Stay up to date with what's happening across the space.</p>
            <div class="max-h-[60vh] overflow-y-auto pr-2 space-y-4 hide-scrollbar">
                <div v-if="!recentActivities || recentActivities.length === 0" class="py-10 text-center text-xs text-slate-400">
                    No recent activity found.
                </div>

                <div v-else v-for="(group, dateLabel) in groupedActivities" :key="dateLabel" class="space-y-3">
                    <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {{ dateLabel }}
                    </div>

                    <div v-for="act in group" :key="act.id" class="flex items-start gap-3">
                        <!-- User Avatar Badge -->
                        <div class="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            {{ getInitials(act.userName) }}
                        </div>

                        <!-- Activity Log Text -->
                        <div class="text-xs leading-relaxed text-slate-600 flex-1">
                            <span class="font-bold text-slate-900">{{ act.userName }}</span>
                            <span> {{ formatActionText(act) }} </span>
                            
                            <!-- Task Link Pill -->
                            <span v-if="act.taskKey" class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold ml-1">
                                <CheckSquare class="w-3 h-3 text-blue-600" />
                                <span>{{ act.taskKey }}: {{ act.taskTitle }}</span>
                            </span>

                            <!-- Status Badge if present -->
                            <span v-if="act.taskColumnName" class="inline-block px-1.5 py-0.2 text-[10px] uppercase font-bold tracking-wider rounded bg-slate-100 border border-slate-200 text-slate-700 ml-1.5">
                                {{ act.taskColumnName }}
                            </span>

                            <div class="text-[10px] text-slate-400 mt-0.5">
                                {{ formatTimeAgo(act.createdAt) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModalGeneric>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import {
    User, CheckCircle2, Edit3, CheckSquare, Calendar, Maximize2,
    Zap, Bug, Bookmark
} from '@lucide/vue';
import ModalGeneric from '../ModalGeneric.vue';
import { useProject } from '../../store/projectStore';

const showActivityModal = ref(false);

const props = defineProps({
    projectId: {
        type: [Number, String],
        required: false,
        default: null
    }
});

defineEmits(['switchTab']);

const projectStore = useProject();
const loading = ref(true);
const summaryData = ref(null);

const loadSummary = async (id) => {
    if (!id) {
        return;
    }
    loading.value = true;
    try {
        summaryData.value = await projectStore.getProjectSummary(id);
    } catch (e) {
        console.error('Failed to load project summary', e);
    } finally {
        loading.value = false;
    }
};

watch(() => props.projectId, (newId) => {
    if (newId) {
        loadSummary(newId);
    }
}, { immediate: true });

onMounted(() => {
    if (props.projectId) {
        loadSummary(props.projectId);
    }
});

// Colors for status overview
const STATUS_COLORS = {
    TO_DO: '#3B82F6', // Blue
    IN_PROGRESS: '#F59E0B', // Amber
    DONE: '#10B981', // Emerald
    DEFAULT: '#8B5CF6' // Purple
};

const getStatusColor = (category, index) => {
    if (category && STATUS_COLORS[category]) return STATUS_COLORS[category];
    const fallbackColors = ['#3B82F6', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#6366F1'];
    return fallbackColors[index % fallbackColors.length];
};

const statusCounts = computed(() => summaryData.value?.statusOverview?.statusCounts || []);

// SVG Donut calculation logic
const donutSegments = computed(() => {
    const total = summaryData.value?.statusOverview?.totalWorkItems || 0;
    if (total === 0) {
        return [{ dashArray: '0', dashOffset: 0, color: '#E2E8F0' }];
    }

    const circumference = 2 * Math.PI * 38; // ~238.76
    let cumulativeOffset = 0;

    return statusCounts.value.map((st, idx) => {
        const ratio = st.count / total;
        const dashArray = ratio * circumference;
        const segment = {
            dashArray: dashArray,
            dashOffset: cumulativeOffset,
            color: getStatusColor(st.category, idx)
        };
        cumulativeOffset += dashArray;
        return segment;
    });
});

// Activity Grouping by Date
const recentActivities = computed(() => summaryData.value?.recentActivities || []);

const groupedActivities = computed(() => {
    const groups = {};
    const now = new Date();

    recentActivities.value.forEach(act => {
        const date = new Date(act.createdAt);
        let key = 'Earlier';

        const isToday = date.toDateString() === now.toDateString();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();

        if (isToday) {
            key = 'Today';
        } else if (isYesterday) {
            key = 'Yesterday';
        } else {
            key = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
        }

        if (!groups[key]) groups[key] = [];
        groups[key].push(act);
    });

    return groups;
});

const formatActionText = (act) => {
    if (act.action === 'CREATE') return 'created';
    if (act.action === 'UPDATE' && act.oldValue && act.newValue) {
        return `updated field from "${act.oldValue}" to "${act.newValue}" on`;
    }
    return 'updated task';
};

const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diffMs = new Date() - new Date(dateStr);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
};

const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

// Priority Bar Chart
const priorityList = computed(() => {
    const raw = summaryData.value?.priorityBreakdown || [];
    return [
        { priority: 'URGENT', label: 'Highest', count: raw.find(r => r.priority === 'URGENT')?.count || 0 },
        { priority: 'HIGH', label: 'High', count: raw.find(r => r.priority === 'HIGH')?.count || 0 },
        { priority: 'MEDIUM', label: 'Medium', count: raw.find(r => r.priority === 'MEDIUM')?.count || 0 },
        { priority: 'LOW', label: 'Low', count: raw.find(r => r.priority === 'LOW')?.count || 0 },
    ];
});

const calculateBarHeight = (count) => {
    const max = Math.max(...priorityList.value.map(p => p.count), 1);
    if (count === 0) return 4;
    return Math.max(Math.round((count / max) * 120), 12);
};

const getPriorityIconClass = (priority) => {
    if (priority === 'URGENT') return 'text-red-500 font-bold';
    if (priority === 'HIGH') return 'text-orange-500 font-bold';
    if (priority === 'MEDIUM') return 'text-amber-500 font-bold';
    return 'text-blue-500 font-bold';
};

// Types of Work
const typeList = computed(() => {
    const raw = summaryData.value?.typesOfWork || [];
    const activeTypes = raw.filter(t => t.count > 0);
    if (activeTypes.length === 0) {
        return [{ type: 'TASK', count: 0, percentage: 0 }];
    }
    return activeTypes;
});

const formatTypeName = (type) => {
    if (type === 'TASK') return 'Task';
    if (type === 'EPIC') return 'Epic';
    if (type === 'BUG') return 'Bug';
    if (type === 'STORY') return 'Story';
    return type;
};

const getTypeIcon = (type) => {
    if (type === 'EPIC') return Zap;
    if (type === 'BUG') return Bug;
    if (type === 'STORY') return Bookmark;
    return CheckSquare;
};

const getTypeIconColor = (type) => {
    if (type === 'EPIC') return 'text-purple-600';
    if (type === 'BUG') return 'text-red-600';
    if (type === 'STORY') return 'text-emerald-600';
    return 'text-blue-600';
};

// Team Workload
const workloadList = computed(() => summaryData.value?.teamWorkload || []);

// Epic Progress
const epicList = computed(() => summaryData.value?.epicProgress || []);
</script>
