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
                <div
                    class="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center gap-4 shadow-xs hover:shadow-md transition">
                    <div
                        class="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 class="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <div class="text-xl font-bold text-slate-900">{{ summaryData?.kpis?.completedLast7Days || 0 }}
                            completed</div>
                        <div class="text-xs text-slate-500 mt-0.5">in the last 7 days</div>
                    </div>
                </div>

                <!-- KPI 2: Updated -->
                <div
                    class="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center gap-4 shadow-xs hover:shadow-md transition">
                    <div
                        class="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <Edit3 class="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <div class="text-xl font-bold text-slate-900">{{ summaryData?.kpis?.updatedLast7Days || 0 }}
                            updated</div>
                        <div class="text-xs text-slate-500 mt-0.5">in the last 7 days</div>
                    </div>
                </div>

                <!-- KPI 3: Created -->
                <div
                    class="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center gap-4 shadow-xs hover:shadow-md transition">
                    <div
                        class="w-11 h-11 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                        <CheckSquare class="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <div class="text-xl font-bold text-slate-900">{{ summaryData?.kpis?.createdLast7Days || 0 }}
                            created</div>
                        <div class="text-xs text-slate-500 mt-0.5">in the last 7 days</div>
                    </div>
                </div>

                <!-- KPI 4: Due Soon -->
                <div
                    class="bg-white border border-slate-200/80 rounded-xl p-4 flex items-center gap-4 shadow-xs hover:shadow-md transition">
                    <div
                        class="w-11 h-11 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                        <Calendar class="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <div class="text-xl font-bold text-slate-900">{{ summaryData?.kpis?.dueSoonNext7Days || 0 }} due
                            soon</div>
                        <div class="text-xs text-slate-500 mt-0.5">in the next 7 days</div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Status Overview Widget -->
                <div class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <h3 class="text-base font-bold text-slate-900">Status overview</h3>
                        <p class="text-xs text-slate-500 mt-1 mb-6">
                            Get a snapshot of the status of your work items.
                            <button @click="$emit('switchTab', 'board')"
                                class="text-blue-600 font-medium hover:underline cursor-pointer ml-1">
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
                                    fill="transparent" :stroke="seg.color" stroke-width="12"
                                    :stroke-dasharray="`${seg.dashArray} 238.76`" :stroke-dashoffset="-seg.dashOffset"
                                    stroke-linecap="butt" class="transition-all duration-500" />
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
                            <div v-for="(st, idx) in statusCounts" :key="st.columnId || idx"
                                class="flex items-center gap-2.5 text-xs text-slate-700">
                                <span class="w-3 h-3 rounded-xs shrink-0"
                                    :style="{ backgroundColor: getStatusColor(st.category, idx) }"></span>
                                <span class="font-medium truncate max-w-[120px]">{{ st.name }}:</span>
                                <span class="font-bold text-slate-900">{{ st.count }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Employee Performance & KPI Widget (Premium Modern Minimalist Style) -->
                <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between">
                            <h3 class="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                <TrendingUp class="w-4.5 h-4.5 text-blue-600" />
                                <span>Employee performance & KPI</span>
                            </h3>
                            <button @click="showPerformanceModal = true" class="text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer" title="Expand performance">
                                <Maximize2 class="w-4 h-4" />
                            </button>
                        </div>
                        <p class="text-xs text-slate-500 mt-1 mb-5">
                            Track productivity, time efficiency & task completion rate across the team.
                        </p>
                    </div>

                    <!-- Member Performance List -->
                    <div class="flex-1 overflow-y-auto max-h-[230px] space-y-3.5 pr-1 hide-scrollbar">
                        <div v-if="!memberPerformanceList || memberPerformanceList.length === 0"
                            class="py-10 text-center text-xs text-slate-400 font-light">
                            No member performance data recorded yet.
                        </div>

                        <div v-else v-for="m in memberPerformanceList" :key="m.userId || m.email"
                            class="bg-slate-50/80 border border-slate-200/70 rounded-xl p-4 space-y-3 hover:border-blue-300 hover:shadow-xs transition-all duration-200">
                            <!-- Header Info & Modern Score Pill -->
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3 truncate">
                                    <div v-if="m.avatar" class="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-slate-200">
                                        <img :src="m.avatar" alt="" class="w-full h-full object-cover" />
                                    </div>
                                    <div v-else class="w-9 h-9 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                                        {{ getInitials(m.userName) }}
                                    </div>
                                    <div class="truncate">
                                        <div class="text-xs font-bold text-slate-900 tracking-tight truncate">
                                            {{ formatMemberName(m.userName) }}
                                        </div>
                                        <div class="text-[11px] text-slate-400 font-normal truncate">{{ m.email }}</div>
                                    </div>
                                </div>

                                <!-- Sleek Minimalist Badge Pill with Status Dot -->
                                <div class="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200/80 text-slate-800 shrink-0 flex items-center gap-1.5 shadow-2xs">
                                    <span class="w-2 h-2 rounded-full shrink-0 animate-pulse" :class="getScoreDotClass(m.overallScore)"></span>
                                    <span class="font-extrabold text-slate-900">{{ m.overallScore }}%</span>
                                    <span class="text-slate-400 font-normal">· {{ getScoreLabel(m.overallScore) }}</span>
                                </div>
                            </div>

                            <!-- Premium Gradient Progress Bar -->
                            <div class="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden shadow-inner">
                                <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-xs"
                                    :style="{ width: `${m.completionRate}%` }"></div>
                            </div>

                            <!-- 3 Minimalist Stat Cards Grid -->
                            <div class="grid grid-cols-3 gap-2 pt-1">
                                <div class="bg-white border border-slate-200/60 rounded-lg p-2 flex flex-col justify-center">
                                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                                    <span class="text-xs font-bold text-slate-800 mt-0.5 truncate">{{ m.completedTasks }}/{{ m.totalTasks }} tasks</span>
                                </div>

                                <div class="bg-white border border-slate-200/60 rounded-lg p-2 flex flex-col justify-center">
                                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Logged</span>
                                    <span class="text-xs font-bold text-slate-800 mt-0.5 truncate">{{ m.loggedHoursSum }}h / {{ m.estimatedHoursSum }}h</span>
                                </div>

                                <div class="bg-white border border-slate-200/60 rounded-lg p-2 flex flex-col justify-center">
                                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">On-Time</span>
                                    <span class="text-xs font-bold text-slate-800 mt-0.5 truncate">{{ m.onTimeRate }}%</span>
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
                        <div v-for="item in priorityList" :key="item.priority"
                            class="flex flex-col items-center flex-1 z-10 group cursor-pointer">
                            <!-- Tooltip -->
                            <div
                                class="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-slate-100 text-[11px] py-1 px-2.5 rounded shadow-lg mb-2 border border-slate-700 text-center font-medium">
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
                        <div v-for="item in priorityList" :key="item.priority"
                            class="flex-1 text-center flex items-center justify-center gap-1">
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
                        <button @click="$emit('switchTab', 'board')"
                            class="text-blue-600 font-medium hover:underline cursor-pointer ml-1">
                            View all items
                        </button>
                    </p>

                    <!-- Work Type Rows -->
                    <div class="space-y-4">
                        <div v-for="t in typeList" :key="t.type" class="flex items-center gap-4">
                            <!-- Type Icon & Label -->
                            <div class="flex items-center gap-2.5 w-28 shrink-0 text-xs font-semibold text-slate-700">
                                <component :is="getTypeIcon(t.type)" class="w-4 h-4 shrink-0"
                                    :class="getTypeIconColor(t.type)" />
                                <span>{{ formatTypeName(t.type) }}</span>
                            </div>

                            <!-- Progress Bar -->
                            <div
                                class="flex-1 bg-slate-100 h-6 rounded-xs overflow-hidden relative border border-slate-200/50">
                                <div class="bg-slate-500 h-full transition-all duration-500"
                                    :style="{ width: `${t.percentage}%` }">
                                </div>
                                <span v-if="t.percentage > 0"
                                    class="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-800">
                                    {{ t.percentage }}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Row 4: Team Workload & Recent Activity (Moved down next to Team Workload!) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                        <div v-for="(member, idx) in workloadList" :key="member.userId || idx"
                            class="flex items-center gap-4">
                            <!-- Assignee Info -->
                            <div
                                class="flex items-center gap-2.5 w-44 shrink-0 text-xs font-semibold text-slate-700 truncate">
                                <div v-if="member.avatar"
                                    class="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-slate-200">
                                    <img :src="member.avatar" alt="" class="w-full h-full object-cover" />
                                </div>
                                <div v-else-if="member.userId"
                                    class="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                    {{ getInitials(member.userName) }}
                                </div>
                                <div v-else
                                    class="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                                    <User class="w-3.5 h-3.5" />
                                </div>

                                <span class="truncate">{{ member.userName }}</span>
                            </div>

                            <!-- Workload Progress Bar -->
                            <div
                                class="flex-1 bg-slate-100 h-6 rounded-xs overflow-hidden relative border border-slate-200/50">
                                <div class="bg-slate-500 h-full transition-all duration-500"
                                    :style="{ width: `${member.percentage}%` }">
                                </div>
                                <span v-if="member.percentage > 0"
                                    class="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-800">
                                    {{ member.percentage }}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity Widget (Moved Down Here!) -->
                <div class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs flex flex-col">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h3 class="text-base font-bold text-slate-900">Recent activity</h3>
                            <p class="text-xs text-slate-500 mt-1">Stay up to date with what's happening across the
                                space.</p>
                        </div>
                        <button @click="showActivityModal = true"
                            class="text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer"
                            title="Expand activity">
                            <Maximize2 class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Timeline Content -->
                    <div class="flex-1 overflow-y-auto max-h-[220px] space-y-4 hide-scrollbar">
                        <div v-if="!recentActivities || recentActivities.length === 0"
                            class="py-10 text-center text-xs text-slate-400">
                            No recent activity found.
                        </div>

                        <div v-else v-for="(group, dateLabel) in groupedActivities" :key="dateLabel" class="space-y-3">
                            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                {{ dateLabel }}
                            </div>

                            <div v-for="act in group" :key="act.id" class="flex items-start gap-3">
                                <!-- User Avatar Badge -->
                                <div
                                    class="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                    {{ getInitials(act.userName) }}
                                </div>

                                <!-- Activity Log Text -->
                                <div class="text-xs leading-relaxed text-slate-600 flex-1">
                                    <span class="font-bold text-slate-900">{{ act.userName }}</span>
                                    <span> {{ formatActionText(act) }} </span>

                                    <!-- Task Link Pill -->
                                    <span v-if="act.taskKey"
                                        class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold ml-1">
                                        <CheckSquare class="w-3 h-3 text-blue-600" />
                                        <span>{{ act.taskKey }}: {{ act.taskTitle }}</span>
                                    </span>

                                    <!-- Status Badge if present -->
                                    <span v-if="act.taskColumnName"
                                        class="inline-block px-1.5 py-0.2 text-[10px] uppercase font-bold tracking-wider rounded bg-slate-100 border border-slate-200 text-slate-700 ml-1.5">
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
        </template>

        <!-- Recent Activity Expanded Modal -->
        <ModalGeneric v-model="showActivityModal" title="Recent activity" width="680px">
            <p class="text-xs text-slate-500 -mt-3 mb-4">Stay up to date with what's happening across the space.</p>
            <div class="max-h-[60vh] overflow-y-auto pr-2 space-y-4 hide-scrollbar">
                <div v-if="!recentActivities || recentActivities.length === 0"
                    class="py-10 text-center text-xs text-slate-400">
                    No recent activity found.
                </div>

                <div v-else v-for="(group, dateLabel) in groupedActivities" :key="dateLabel" class="space-y-3">
                    <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {{ dateLabel }}
                    </div>

                    <div v-for="act in group" :key="act.id" class="flex items-start gap-3">
                        <!-- User Avatar Badge -->
                        <div
                            class="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            {{ getInitials(act.userName) }}
                        </div>

                        <!-- Activity Log Text -->
                        <div class="text-xs leading-relaxed text-slate-600 flex-1">
                            <span class="font-bold text-slate-900">{{ act.userName }}</span>
                            <span> {{ formatActionText(act) }} </span>

                            <!-- Task Link Pill -->
                            <span v-if="act.taskKey"
                                class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold ml-1">
                                <CheckSquare class="w-3 h-3 text-blue-600" />
                                <span>{{ act.taskKey }}: {{ act.taskTitle }}</span>
                            </span>

                            <!-- Status Badge if present -->
                            <span v-if="act.taskColumnName"
                                class="inline-block px-1.5 py-0.2 text-[10px] uppercase font-bold tracking-wider rounded bg-slate-100 border border-slate-200 text-slate-700 ml-1.5">
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

        <!-- Employee Performance Expanded Modal -->
        <ModalGeneric v-model="showPerformanceModal" title="Employee performance & KPI" width="720px">
            <p class="text-xs text-slate-500 -mt-3 mb-4">Track productivity, time efficiency & task completion rate across the team.</p>
            <div class="max-h-[65vh] overflow-y-auto pr-2 space-y-3.5 hide-scrollbar">
                <div v-if="!memberPerformanceList || memberPerformanceList.length === 0"
                    class="py-10 text-center text-xs text-slate-400 font-light">
                    No member performance data recorded yet.
                </div>

                <div v-else v-for="m in memberPerformanceList" :key="m.userId || m.email"
                    class="bg-slate-50/80 border border-slate-200/70 rounded-xl p-4 space-y-3 hover:border-blue-300 hover:shadow-xs transition-all duration-200">
                    <!-- Header Info & Modern Score Pill -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3 truncate">
                            <div v-if="m.avatar" class="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-slate-200">
                                <img :src="m.avatar" alt="" class="w-full h-full object-cover" />
                            </div>
                            <div v-else class="w-9 h-9 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                                {{ getInitials(m.userName) }}
                            </div>
                            <div class="truncate">
                                <div class="text-xs font-bold text-slate-900 tracking-tight truncate">
                                    {{ formatMemberName(m.userName) }}
                                </div>
                                <div class="text-[11px] text-slate-400 font-normal truncate">{{ m.email }}</div>
                            </div>
                        </div>

                        <!-- Sleek Minimalist Badge Pill with Status Dot -->
                        <div class="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200/80 text-slate-800 shrink-0 flex items-center gap-1.5 shadow-2xs">
                            <span class="w-2 h-2 rounded-full shrink-0 animate-pulse" :class="getScoreDotClass(m.overallScore)"></span>
                            <span class="font-extrabold text-slate-900">{{ m.overallScore }}%</span>
                            <span class="text-slate-400 font-normal">· {{ getScoreLabel(m.overallScore) }}</span>
                        </div>
                    </div>

                    <!-- Premium Gradient Progress Bar -->
                    <div class="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden shadow-inner">
                        <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-xs"
                            :style="{ width: `${m.completionRate}%` }"></div>
                    </div>

                    <!-- 3 Minimalist Stat Cards Grid -->
                    <div class="grid grid-cols-3 gap-2 pt-1">
                        <div class="bg-white border border-slate-200/60 rounded-lg p-2 flex flex-col justify-center">
                            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                            <span class="text-xs font-bold text-slate-800 mt-0.5 truncate">{{ m.completedTasks }}/{{ m.totalTasks }} tasks</span>
                        </div>

                        <div class="bg-white border border-slate-200/60 rounded-lg p-2 flex flex-col justify-center">
                            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Logged</span>
                            <span class="text-xs font-bold text-slate-800 mt-0.5 truncate">{{ m.loggedHoursSum }}h / {{ m.estimatedHoursSum }}h</span>
                        </div>

                        <div class="bg-white border border-slate-200/60 rounded-lg p-2 flex flex-col justify-center">
                            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">On-Time</span>
                            <span class="text-xs font-bold text-slate-800 mt-0.5 truncate">{{ m.onTimeRate }}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </ModalGeneric>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import {
    User, CheckCircle2, Edit3, CheckSquare, Calendar, Maximize2,
    Zap, Bug, Bookmark, TrendingUp
} from '@lucide/vue';
import ModalGeneric from '../ModalGeneric.vue';
import { useProject } from '../../store/projectStore';

const showActivityModal = ref(false);
const showPerformanceModal = ref(false);

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

// --- Member Performance Helpers ---
const memberPerformanceList = computed(() => {
    return summaryData.value?.memberPerformance || [];
});

const formatMemberName = (name) => {
    if (!name) return 'User';
    if (name.includes('@')) {
        const prefix = name.split('@')[0];
        return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    return name;
};

const getScoreDotClass = (score) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
};

const getScoreBadgeClass = (score) => {
    if (score >= 85) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 70) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 50) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
};

const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Average';
    return 'Needs Work';
};

// --- SVG Donut Calculations ---
const statusCounts = computed(() => {
    return summaryData.value?.statusOverview?.statusCounts || [];
});

const getStatusColor = (category, index) => {
    switch (category) {
        case 'TO_DO': return '#3B82F6'; // Blue
        case 'IN_PROGRESS': return '#F59E0B'; // Amber
        case 'DONE': return '#10B981'; // Green
        default:
            const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'];
            return colors[index % colors.length];
    }
};

const donutSegments = computed(() => {
    const list = statusCounts.value;
    const total = summaryData.value?.statusOverview?.totalWorkItems || 0;
    if (total === 0 || !list.length) return [];

    const circumference = 238.76;
    let accumulatedOffset = 0;

    return list.map((item, idx) => {
        const count = item.count || 0;
        const ratio = count / total;
        const dashArray = ratio * circumference;
        const offset = accumulatedOffset;
        accumulatedOffset += dashArray;

        return {
            color: getStatusColor(item.category, idx),
            dashArray: dashArray.toFixed(2),
            dashOffset: offset.toFixed(2)
        };
    });
});

// --- Bar Chart Calculations ---
const priorityList = computed(() => {
    const raw = summaryData.value?.priorityBreakdown || [];
    const order = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];

    const getLabel = (p) => {
        switch (p) {
            case 'URGENT': return 'Highest';
            case 'HIGH': return 'High';
            case 'MEDIUM': return 'Medium';
            case 'LOW': return 'Low';
            default: return p;
        }
    };

    return order.map(p => {
        const found = raw.find(item => item.priority === p);
        return {
            priority: p,
            label: getLabel(p),
            count: found ? found.count : 0
        };
    });
});

const calculateBarHeight = (count) => {
    const max = Math.max(...priorityList.value.map(p => p.count), 1);
    if (count === 0) return 4;
    return Math.max(Math.round((count / max) * 120), 12);
};

const getPriorityIconClass = (priority) => {
    switch (priority) {
        case 'URGENT': return 'text-red-600 font-bold';
        case 'HIGH': return 'text-red-500';
        case 'MEDIUM': return 'text-amber-500';
        case 'LOW': return 'text-blue-500';
        default: return 'text-slate-400';
    }
};

// --- Work Types Helpers ---
const typeList = computed(() => {
    const raw = summaryData.value?.typesOfWork || [];
    const activeTypes = raw.filter(t => t.count > 0);
    if (activeTypes.length === 0) {
        return [{ type: 'TASK', count: 0, percentage: 0 }];
    }
    return activeTypes;
});

const getTypeIcon = (type) => {
    switch (type) {
        case 'BUG': return Bug;
        case 'STORY': return Bookmark;
        case 'TASK':
        default: return Zap;
    }
};

const getTypeIconColor = (type) => {
    switch (type) {
        case 'BUG': return 'text-red-500';
        case 'STORY': return 'text-green-500';
        case 'TASK':
        default: return 'text-blue-500';
    }
};

const formatTypeName = (type) => {
    if (!type) return 'Task';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

// --- Team Workload Helpers ---
const workloadList = computed(() => {
    return summaryData.value?.teamWorkload || [];
});

// --- Recent Activity Helpers ---
const recentActivities = computed(() => {
    return summaryData.value?.recentActivities || [];
});

const groupedActivities = computed(() => {
    const list = recentActivities.value;
    if (!list || !list.length) return {};

    const groups = {};
    const now = new Date();

    list.forEach(act => {
        const date = new Date(act.createdAt);
        let key = 'Earlier';

        const isToday = date.toDateString() === now.toDateString();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();

        if (isToday) key = 'TODAY';
        else if (isYesterday) key = 'YESTERDAY';
        else {
            key = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
        }

        if (!groups[key]) groups[key] = [];
        groups[key].push(act);
    });

    return groups;
});

const formatActionText = (act) => {
    if (!act.action) return 'updated task';
    switch (act.action) {
        case 'CREATE': return 'created task';
        case 'MOVE': return 'moved task';
        case 'UPDATE': return 'updated task';
        case 'COMMENT': return 'commented on task';
        case 'ASSIGN': return 'assigned task';
        default: return act.action.toLowerCase() + ' task';
    }
};

const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
};

const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);

    if (diffSeconds < 60) return 'just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
</script>
