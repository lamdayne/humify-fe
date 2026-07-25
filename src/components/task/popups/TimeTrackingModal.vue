<template>
    <ModalGeneric :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" width="480px"
        title="Time tracking">
        <div class="flex flex-col gap-4">
            <!-- Two Main Inputs: Time spent & Time remaining -->
            <div class="grid grid-cols-2 gap-4">
                <!-- Time Spent Input -->
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">
                        Time spent <span class="text-red-500">*</span>
                    </label>
                    <input type="text" v-model="timeSpentInput" placeholder="e.g. 2h 30m, 1d 4h"
                        class="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono transition">
                    <span v-if="parsedTimeSpent > 0" class="text-[11px] text-blue-600 font-semibold mt-1 block">
                        = {{ parsedTimeSpent }} hour(s)
                    </span>
                </div>

                <!-- Time Remaining Input -->
                <div>
                    <label class="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                        <span>Time remaining</span>
                        <Info class="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600 transition"
                            title="Estimated remaining time for task" />
                    </label>
                    <input type="text" v-model="timeRemainingInput" placeholder="e.g. 4h, 1d"
                        class="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono transition">
                    <span v-if="parsedTimeRemaining !== null" class="text-[11px] text-slate-500 font-medium mt-1 block">
                        Remaining: {{ parsedTimeRemaining }} hour(s)
                    </span>
                </div>
            </div>

            <!-- Jira Format Guidelines Box -->
            <div class="bg-slate-100/80 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1">
                <div class="font-bold text-slate-700">Use the format: <span class="font-mono text-blue-700">2w 4d 6h
                        45m</span></div>
                <ul class="list-disc list-inside space-y-0.5 font-medium text-[11px] text-slate-500 pl-1">
                    <li><span class="font-bold font-mono text-slate-700">w</span> = weeks (5d / 40h)</li>
                    <li><span class="font-bold font-mono text-slate-700">d</span> = days (8h)</li>
                    <li><span class="font-bold font-mono text-slate-700">h</span> = hours</li>
                    <li><span class="font-bold font-mono text-slate-700">m</span> = minutes</li>
                </ul>
            </div>

            <!-- Date Started Input -->
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Date started</label>
                <input type="datetime-local" v-model="loggedAtInput"
                    class="w-full border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-blue-500 font-sans">
            </div>

            <!-- Work Description Textarea -->
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Work description</label>
                <textarea v-model="descriptionInput" rows="2" placeholder="What work did you do?"
                    class="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 resize-none"></textarea>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button @click="$emit('update:modelValue', false)"
                    class="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer transition">
                    Cancel
                </button>
                <button @click="handleSaveWorklog" :disabled="submitting || parsedTimeSpent <= 0"
                    class="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition flex items-center gap-1.5">
                    <LoaderCircle v-if="submitting" class="w-3.5 h-3.5 animate-spin" />
                    <span>Save</span>
                </button>
            </div>

            <!-- Worklog History Log List (Compact Jira Activity Style) -->
            <div v-if="worklogs && worklogs.length > 0" class="mt-3 pt-3 border-t border-slate-200">
                <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Work log history</h4>
                <div class="max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1 hide-scrollbar">
                    <div v-for="wl in worklogs" :key="wl.id" class="py-2.5 flex items-start gap-2.5 text-xs">
                        <!-- Avatar Badge -->
                        <div class="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            {{ getInitials(getUserName(wl)) }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <!-- Name + Logged Time -->
                            <div class="text-slate-800 leading-snug">
                                <span class="font-bold text-slate-900">{{ getUserName(wl) }}</span>
                                <span class="text-slate-500 mx-1">logged</span>
                                <span class="font-bold text-slate-900">{{ formatHoursToJiraString(wl.timeSpentHours) }}</span>
                            </div>
                            <!-- Description Note -->
                            <div v-if="wl.description" class="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{{ wl.description }}</div>
                            <!-- Date Time & Delete Link -->
                            <div class="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                                <span>{{ formatDateTime(wl.loggedAt || wl.createdAt) }}</span>
                                <span>·</span>
                                <button @click="handleDeleteWorklog(wl.id)" class="text-slate-400 hover:text-red-600 transition cursor-pointer font-medium">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ModalGeneric>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { LoaderCircle, Trash2, Info } from '@lucide/vue';
import ModalGeneric from '../../ModalGeneric.vue';
import { useTaskStore } from '../../../store/taskStore';

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    taskId: { type: [Number, String], required: true },
    estimatedHours: { type: Number, default: 0 },
    loggedHours: { type: Number, default: 0 }
});

const emit = defineEmits(['update:modelValue', 'worklogSaved']);

const taskStore = useTaskStore();
const timeSpentInput = ref('');
const timeRemainingInput = ref('');
const descriptionInput = ref('');
const loggedAtInput = ref(new Date().toISOString().slice(0, 16));
const submitting = ref(false);
const worklogs = ref([]);

// Parse Jira Time Format: e.g. "2w 4d 6h 45m" -> hours as float
const parseJiraTimeString = (str) => {
    if (!str || typeof str !== 'string') return 0;
    const clean = str.trim().toLowerCase();
    if (!clean) return 0;

    // Direct number check
    if (!isNaN(clean)) return parseFloat(clean);

    let totalHours = 0;
    const weeksMatch = clean.match(/(\d+(?:\.\d+)?)\s*w/);
    const daysMatch = clean.match(/(\d+(?:\.\d+)?)\s*d/);
    const hoursMatch = clean.match(/(\d+(?:\.\d+)?)\s*h/);
    const minutesMatch = clean.match(/(\d+(?:\.\d+)?)\s*m/);

    if (weeksMatch) totalHours += parseFloat(weeksMatch[1]) * 40; // 1w = 5d = 40h
    if (daysMatch) totalHours += parseFloat(daysMatch[1]) * 8;   // 1d = 8h
    if (hoursMatch) totalHours += parseFloat(hoursMatch[1]);
    if (minutesMatch) totalHours += parseFloat(minutesMatch[1]) / 60;

    return Math.round(totalHours * 100) / 100;
};

// Format float hours into Jira string: e.g. 10.5 -> "1d 2h 30m"
const formatHoursToJiraString = (hours) => {
    if (!hours || hours <= 0) return '0h';
    let h = Math.round(hours * 60) / 60;

    const w = Math.floor(h / 40);
    h %= 40;
    const d = Math.floor(h / 8);
    h %= 8;
    const hrs = Math.floor(h);
    const m = Math.round((h - hrs) * 60);

    const parts = [];
    if (w > 0) parts.push(`${w}w`);
    if (d > 0) parts.push(`${d}d`);
    if (hrs > 0) parts.push(`${hrs}h`);
    if (m > 0) parts.push(`${m}m`);

    return parts.length > 0 ? parts.join(' ') : '0h';
};

const parsedTimeSpent = computed(() => parseJiraTimeString(timeSpentInput.value));

const parsedTimeRemaining = computed(() => {
    if (!timeRemainingInput.value) return null;
    return parseJiraTimeString(timeRemainingInput.value);
});

const loggedHoursSum = computed(() => {
    if (worklogs.value && worklogs.value.length > 0) {
        return worklogs.value.reduce((acc, curr) => acc + (curr.timeSpentHours || 0), 0);
    }
    return props.loggedHours || 0;
});

const remainingHours = computed(() => {
    if (parsedTimeRemaining.value !== null) {
        return parsedTimeRemaining.value;
    }
    const rem = (props.estimatedHours || 0) - loggedHoursSum.value;
    return Math.max(0, Math.round(rem * 100) / 100);
});

const loggedPercentage = computed(() => {
    if (!props.estimatedHours || props.estimatedHours <= 0) return 0;
    return Math.min(100, Math.round((loggedHoursSum.value * 100) / props.estimatedHours));
});

const fetchWorklogs = async () => {
    if (!props.taskId) return;
    try {
        const res = await taskStore.getWorklogs(props.taskId);
        worklogs.value = res.data?.data || [];
    } catch (e) {
        console.error('Failed to fetch worklogs', e);
    }
};

watch(() => props.modelValue, (val) => {
    if (val) {
        timeSpentInput.value = '';
        timeRemainingInput.value = '';
        descriptionInput.value = '';
        loggedAtInput.value = new Date().toISOString().slice(0, 16);
        fetchWorklogs();
    }
}, { immediate: true });

const handleSaveWorklog = async () => {
    if (parsedTimeSpent.value <= 0 || !props.taskId) return;
    submitting.value = true;
    try {
        const payload = {
            timeSpentHours: parsedTimeSpent.value,
            description: descriptionInput.value || null,
            loggedAt: loggedAtInput.value ? new Date(loggedAtInput.value).toISOString() : new Date().toISOString()
        };
        await taskStore.createWorklog(props.taskId, payload);
        timeSpentInput.value = '';
        descriptionInput.value = '';
        await fetchWorklogs();

        // Optionally update task estimated remaining if specified
        if (parsedTimeRemaining.value !== null) {
            await taskStore.updateTask(props.taskId, {
                estimatedHours: loggedHoursSum.value + parsedTimeRemaining.value
            });
        }

        emit('worklogSaved');
        emit('update:modelValue', false);
    } catch (e) {
        console.error('Failed to save worklog', e);
    } finally {
        submitting.value = false;
    }
};

const handleDeleteWorklog = async (worklogId) => {
    try {
        await taskStore.deleteWorklog(worklogId);
        await fetchWorklogs();
        emit('worklogSaved');
    } catch (e) {
        console.error('Failed to delete worklog', e);
    }
};

const getUserName = (wl) => {
    if (!wl) return 'System';
    if (wl.user) {
        if (wl.user.fullName && wl.user.fullName.trim() !== '') return wl.user.fullName;
        if (wl.user.email && wl.user.email.trim() !== '') return wl.user.email;
    }
    if (wl.userName && wl.userName.trim() !== '') return wl.userName;
    if (wl.userEmail && wl.userEmail.trim() !== '') return wl.userEmail;
    return 'System';
};

const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
};

const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
</script>
