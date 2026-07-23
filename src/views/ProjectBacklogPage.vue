<template>
    <div class="flex-1 p-6 max-w-7xl mx-auto font-sans text-slate-800 flex flex-col gap-6">
        <!-- Top Toolbar Header -->
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <div class="relative w-64">
                    <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input type="text" v-model="searchQuery" placeholder="Search backlog..."
                        class="w-full bg-slate-100 border border-slate-200 pl-9 pr-3 py-1.5 rounded-lg text-xs outline-none focus:border-slate-400 font-medium">
                </div>
            </div>

            <!-- Create Sprint Button -->
            <button @click="handleCreateSprint"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition cursor-pointer">
                <Plus class="w-4 h-4" />
                <span>Create sprint</span>
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
            <LoaderCircle class="w-8 h-8 animate-spin text-slate-700" />
            <span class="text-xs font-medium">Loading backlog & sprints...</span>
        </div>

        <div v-else class="flex flex-col gap-6">
            <!-- Sprints List -->
            <div v-for="sprint in sprints" :key="sprint.id"
                class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-visible">
                <!-- Sprint Header -->
                <div class="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <button @click="sprint.expanded = !sprint.expanded" class="text-slate-400 hover:text-slate-700">
                            <ChevronDown class="w-4 h-4 transition-transform" :class="[sprint.expanded === false ? '-rotate-90' : '']" />
                        </button>

                        <input type="checkbox"
                            :checked="isAllSprintTasksSelected(sprint.id)"
                            @change="toggleSelectAllSprintTasks(sprint.id)"
                            @click.stop
                            class="w-4 h-4 accent-slate-800 cursor-pointer shrink-0"
                            title="Select all tasks in this sprint">

                        <div class="flex items-center gap-2">
                            <span class="font-bold text-slate-900 text-sm">{{ sprint.name }}</span>
                            <span v-if="sprint.startDate && sprint.endDate" class="text-xs text-slate-400">
                                {{ formatDateShort(sprint.startDate) }} - {{ formatDateShort(sprint.endDate) }}
                            </span>
                            <span class="text-xs font-medium text-slate-500">
                                ({{ getSprintTasks(sprint.id).length }} work items)
                            </span>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                                :class="getSprintStatusBadgeClass(sprint.status)">
                                {{ sprint.status }}
                            </span>
                        </div>
                    </div>

                    <!-- Right Controls & Summary Badges -->
                    <div class="flex items-center gap-3">
                        <!-- Points Summary -->
                        <div class="flex items-center text-xs font-bold gap-1">
                            <span class="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md" title="To Do points">
                                {{ getStatusPoints(sprint.id, 'TO_DO') }}
                            </span>
                            <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md" title="In Progress points">
                                {{ getStatusPoints(sprint.id, 'IN_PROGRESS') }}
                            </span>
                            <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded-md" title="Done points">
                                {{ getStatusPoints(sprint.id, 'DONE') }}
                            </span>
                        </div>

                        <!-- Start / Complete Sprint Button & Ellipsis Menu -->
                        <div class="flex items-center gap-2">
                            <button v-if="sprint.status === 'PLANNED'" @click="handleUpdateSprintStatus(sprint.id, 'ACTIVE')"
                                class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition cursor-pointer">
                                Start sprint
                            </button>
                            <button v-else-if="sprint.status === 'ACTIVE'" @click="handleUpdateSprintStatus(sprint.id, 'COMPLETED')"
                                class="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg transition cursor-pointer">
                                Complete sprint
                            </button>

                            <!-- Ellipsis Options Menu (...) -->
                            <div class="relative">
                                <button @click.stop="sprint.showMenu = !sprint.showMenu"
                                    class="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer transition">
                                    <Ellipsis class="w-4 h-4" />
                                </button>

                                <div v-if="sprint.showMenu" @click.stop="sprint.showMenu = false" class="fixed inset-0 z-40 cursor-default"></div>
                                <div v-if="sprint.showMenu"
                                    class="absolute right-0 top-8 w-36 bg-white border border-slate-200 rounded-lg shadow-xl z-50 text-xs py-1">
                                    <button @click.stop="openEditSprintModal(sprint); sprint.showMenu = false"
                                        class="w-full text-left px-3 py-2 hover:bg-slate-100 font-medium cursor-pointer transition">
                                        Edit sprint
                                    </button>
                                    <button @click.stop="handleDeleteSprint(sprint.id); sprint.showMenu = false"
                                        class="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 font-medium cursor-pointer border-t border-slate-100 transition">
                                        Delete sprint
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sprint Work Items List -->
                <div v-if="sprint.expanded !== false" class="divide-y divide-slate-100">
                    <div v-for="task in getSprintTasks(sprint.id)" :key="task.id"
                        @click="openDetail(task.id)"
                        class="px-4 py-2.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-4 group">
                        
                        <div class="flex items-center gap-3 flex-1 min-w-0">
                            <input type="checkbox"
                                :checked="selectedTaskIds.includes(task.id)"
                                @change="toggleTaskSelection(task.id)"
                                @click.stop
                                class="w-4 h-4 accent-slate-800 cursor-pointer shrink-0">
                            <span class="text-xs font-mono font-medium text-slate-400 shrink-0">
                                {{ task.taskKey || 'TASK' }}
                            </span>
                            <span class="text-xs font-medium text-slate-800 truncate">
                                {{ task.title }}
                            </span>
                        </div>

                        <div class="flex items-center gap-3 shrink-0 text-xs">
                            <!-- Status Selector -->
                            <select :value="getColumnCategory(task.columnId)" @click.stop
                                @change="handleStatusChange(task, $event.target.value)"
                                class="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded px-2 py-1 text-[11px] font-semibold outline-none cursor-pointer">
                                <option value="TO_DO">TO DO</option>
                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                <option value="DONE">DONE</option>
                            </select>

                            <!-- Story Points Badge -->
                            <span class="px-2 py-0.5 bg-slate-100 text-slate-600 font-semibold text-[11px] rounded min-w-6 text-center">
                                {{ task.points !== undefined && task.points !== null ? task.points : '-' }}
                            </span>

                            <!-- Assignee Avatar -->
                            <div class="w-6 h-6 shrink-0" :title="task.assignee?.email || 'Unassigned'">
                                <img v-if="task.assignee" src="https://res.cloudinary.com/dmzsletu0/image/upload/v1782044934/453178253_471506465671661_2781666950760530985_n_wqklyb.png"
                                    alt="" class="w-full h-full rounded-full border border-slate-200">
                                <span v-else class="w-full h-full rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold flex items-center justify-center">
                                    ?
                                </span>
                            </div>

                            <!-- Task Options Menu (...) -->
                            <div class="relative">
                                <button @click.stop="task.showMenu = !task.showMenu"
                                    class="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer transition">
                                    <Ellipsis class="w-4 h-4" />
                                </button>

                                <div v-if="task.showMenu" @click.stop="task.showMenu = false" class="fixed inset-0 z-40 cursor-default"></div>
                                <div v-if="task.showMenu"
                                    class="absolute right-0 top-full mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-xl z-50 text-xs py-1">
                                    <button @click.stop="openDetail(task.id); task.showMenu = false"
                                        class="w-full text-left px-3 py-1.5 hover:bg-slate-100 font-medium cursor-pointer transition">
                                        Task details
                                    </button>
                                    <button @click.stop="confirmDeleteSingleTask(task.id); task.showMenu = false"
                                        class="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 font-medium cursor-pointer border-t border-slate-100 transition">
                                        Delete task
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Inline + Create Issue in Sprint -->
                    <div class="p-3 bg-slate-50/50">
                        <div v-if="activeCreatingSprintId === sprint.id" class="flex gap-2">
                            <input type="text" v-model="newIssueTitle" @keydown.enter="createIssueInSprint(sprint.id)"
                                placeholder="What needs to be done?"
                                class="flex-1 bg-white border border-slate-300 p-2 rounded-lg text-xs outline-none focus:border-slate-500">
                            <button @click="createIssueInSprint(sprint.id)"
                                class="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer">
                                Create
                            </button>
                            <button @click="activeCreatingSprintId = null" class="text-slate-400 hover:text-slate-700">
                                <X class="w-4 h-4" />
                            </button>
                        </div>
                        <button v-else @click="activeCreatingSprintId = sprint.id; newIssueTitle = ''"
                            class="text-xs font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer">
                            <Plus class="w-3.5 h-3.5" />
                            <span>Create issue</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Backlog Pool Section -->
            <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-visible">
                <!-- Backlog Header -->
                <div class="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <input type="checkbox"
                            :checked="isAllBacklogTasksSelected"
                            @change="toggleSelectAllBacklogTasks"
                            @click.stop
                            class="w-4 h-4 accent-slate-800 cursor-pointer shrink-0"
                            title="Select all tasks in backlog">
                        <span class="font-bold text-slate-900 text-sm">Backlog</span>
                        <span class="text-xs font-medium text-slate-500">
                            ({{ backlogTasks.length }} work items)
                        </span>
                    </div>

                    <div class="flex items-center text-xs font-bold gap-1">
                        <span class="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                            {{ getBacklogStatusPoints('TO_DO') }}
                        </span>
                        <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                            {{ getBacklogStatusPoints('IN_PROGRESS') }}
                        </span>
                        <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded-md">
                            {{ getBacklogStatusPoints('DONE') }}
                        </span>
                    </div>
                </div>

                <!-- Backlog Items List -->
                <div class="divide-y divide-slate-100">
                    <div v-for="task in backlogTasks" :key="task.id"
                        @click="openDetail(task.id)"
                        class="px-4 py-2.5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-4 group">
                        
                        <div class="flex items-center gap-3 flex-1 min-w-0">
                            <input type="checkbox"
                                :checked="selectedTaskIds.includes(task.id)"
                                @change="toggleTaskSelection(task.id)"
                                @click.stop
                                class="w-4 h-4 accent-slate-800 cursor-pointer shrink-0">
                            <span class="text-xs font-mono font-medium text-slate-400 shrink-0">
                                {{ task.taskKey || 'TASK' }}
                            </span>
                            <span class="text-xs font-medium text-slate-800 truncate">
                                {{ task.title }}
                            </span>
                        </div>

                        <div class="flex items-center gap-3 shrink-0 text-xs">
                            <!-- Move to Sprint Dropdown -->
                            <select v-if="sprints.length > 0" :value="task.sprintId || ''" @click.stop
                                @change="handleMoveToSprint(task, $event.target.value)"
                                class="bg-slate-100 border border-slate-200 rounded px-2 py-1 text-[11px] font-semibold outline-none cursor-pointer">
                                <option value="">Backlog</option>
                                <option v-for="s in sprints" :key="s.id" :value="s.id">{{ s.name }}</option>
                            </select>

                            <select :value="getColumnCategory(task.columnId)" @click.stop
                                @change="handleStatusChange(task, $event.target.value)"
                                class="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded px-2 py-1 text-[11px] font-semibold outline-none cursor-pointer">
                                <option value="TO_DO">TO DO</option>
                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                <option value="DONE">DONE</option>
                            </select>

                            <span class="px-2 py-0.5 bg-slate-100 text-slate-600 font-semibold text-[11px] rounded min-w-6 text-center">
                                {{ task.points !== undefined && task.points !== null ? task.points : '-' }}
                            </span>

                            <!-- Assignee Avatar -->
                            <div class="w-6 h-6 shrink-0" :title="task.assignee?.email || 'Unassigned'">
                                <img v-if="task.assignee" src="https://res.cloudinary.com/dmzsletu0/image/upload/v1782044934/453178253_471506465671661_2781666950760530985_n_wqklyb.png"
                                    alt="" class="w-full h-full rounded-full border border-slate-200">
                                <span v-else class="w-full h-full rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold flex items-center justify-center">
                                    ?
                                </span>
                            </div>

                            <!-- Task Options Menu (...) -->
                            <div class="relative">
                                <button @click.stop="task.showMenu = !task.showMenu"
                                    class="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer transition">
                                    <Ellipsis class="w-4 h-4" />
                                </button>

                                <div v-if="task.showMenu" @click.stop="task.showMenu = false" class="fixed inset-0 z-40 cursor-default"></div>
                                <div v-if="task.showMenu"
                                    class="absolute right-0 top-full mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-xl z-50 text-xs py-1">
                                    <button @click.stop="openDetail(task.id); task.showMenu = false"
                                        class="w-full text-left px-3 py-1.5 hover:bg-slate-100 font-medium cursor-pointer transition">
                                        Task details
                                    </button>
                                    <button @click.stop="confirmDeleteSingleTask(task.id); task.showMenu = false"
                                        class="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 font-medium cursor-pointer border-t border-slate-100 transition">
                                        Delete task
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="backlogTasks.length === 0" class="py-8 text-center text-xs text-slate-400">
                        Your backlog is empty.
                    </div>

                    <!-- Inline + Create Issue in Backlog -->
                    <div class="p-3 bg-slate-50/50">
                        <div v-if="isCreatingBacklog" class="flex gap-2">
                            <input type="text" v-model="newIssueTitle" @keydown.enter="createIssueInBacklog"
                                placeholder="What needs to be done?"
                                class="flex-1 bg-white border border-slate-300 p-2 rounded-lg text-xs outline-none focus:border-slate-500">
                            <button @click="createIssueInBacklog"
                                class="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer">
                                Create
                            </button>
                            <button @click="isCreatingBacklog = false" class="text-slate-400 hover:text-slate-700">
                                <X class="w-4 h-4" />
                            </button>
                        </div>
                        <button v-else @click="isCreatingBacklog = true; newIssueTitle = ''"
                            class="text-xs font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer">
                            <Plus class="w-3.5 h-3.5" />
                            <span>Create issue</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Task Detail Modal -->
        <TaskDetailModal v-model="openTaskModal"
            :taskId="selectedTaskId"
            :projectId="projectId"
            :memberOfProject="memberOfProject"
            @task-updated="onTaskUpdated" />

        <!-- Edit Sprint Modal -->
        <ModalGeneric v-model="openEditSprintModalFlag" title="Edit sprint" width="550px">
            <div class="space-y-4 text-xs">
                <div>
                    <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">Sprint Name</label>
                    <input type="text" v-model="editSprintForm.name" placeholder="Sprint name"
                        class="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-slate-500 font-medium">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">Start Date</label>
                        <input type="date" v-model="editSprintForm.startDate"
                            class="w-full border border-slate-300 p-2 rounded-lg outline-none focus:border-slate-500 font-medium">
                    </div>
                    <div>
                        <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">End Date</label>
                        <input type="date" v-model="editSprintForm.endDate"
                            class="w-full border border-slate-300 p-2 rounded-lg outline-none focus:border-slate-500 font-medium">
                    </div>
                </div>
                <div>
                    <label class="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">Sprint Goal</label>
                    <textarea v-model="editSprintForm.goal" rows="3" placeholder="What is the goal of this sprint?"
                        class="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-slate-500 font-medium resize-none"></textarea>
                </div>
            </div>
            <template #footer>
                <div class="flex gap-2">
                    <SecondaryButton @click="openEditSprintModalFlag = false" content="Cancel"></SecondaryButton>
                    <PrimaryButton @click="saveEditSprint" content="Save"></PrimaryButton>
                </div>
            </template>
        </ModalGeneric>

        <!-- Confirm Delete Task Modal -->
        <ModalGeneric v-model="openConfirmDeleteModal" title="Delete Confirmation" width="450px">
            <div class="flex flex-col items-center text-center p-2 gap-3">
                <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <AlertTriangle class="w-6 h-6" />
                </div>
                <h3 class="font-bold text-slate-900 text-sm">Are you sure you want to delete?</h3>
                <p class="text-xs text-slate-500 w-full leading-relaxed">
                    <span v-if="isBulkDelete">
                        You are about to delete <strong class="text-slate-800">{{ selectedTaskIds.length }}</strong> selected task(s). This action cannot be undone.
                    </span>
                    <span v-else>
                        This task will be permanently removed. This action cannot be undone.
                    </span>
                </p>
            </div>
            <template #footer>
                <div class="flex gap-2 justify-end w-full">
                    <SecondaryButton @click="openConfirmDeleteModal = false" content="Cancel"></SecondaryButton>
                    <button @click="executeDelete"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer">
                        Delete
                    </button>
                </div>
            </template>
        </ModalGeneric>

        <!-- Floating Bulk Delete Action Bar -->
        <div v-if="selectedTaskIds.length > 0"
            class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-4 text-xs font-semibold">
            <span class="flex items-center gap-2">
                <span class="bg-blue-600 px-2 py-0.5 rounded text-[11px] font-bold">{{ selectedTaskIds.length }}</span>
                <span>task(s) selected</span>
            </span>
            <div class="h-4 w-px bg-slate-700"></div>
            <button @click="confirmBulkDelete"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-bold">
                <Trash2 class="w-3.5 h-3.5" />
                <span>Delete selected</span>
            </button>
            <button @click="selectedTaskIds = []" class="text-slate-400 hover:text-white transition cursor-pointer">
                Deselect all
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { AlertTriangle, ChevronDown, Ellipsis, LoaderCircle, Plus, Search, Trash2, X } from '@lucide/vue';
import { useSprintStore } from '../store/sprintStore.js';
import { useTaskStore } from '../store/taskStore.js';
import { useColumnStore } from '../store/columnStore.js';
import { useProject } from '../store/projectStore.js';
import ModalGeneric from '../components/ModalGeneric.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import TaskDetailModal from '../components/task/TaskDetailModal.vue';

const route = useRoute()
const sprintStore = useSprintStore()
const taskStore = useTaskStore()
const columnStore = useColumnStore()
const projectStore = useProject()

const projectId = computed(() => route.params?.id)

const isLoading = ref(false)
const searchQuery = ref('')
const allTasks = ref([])
const columns = ref([])
const memberOfProject = ref([])

const openTaskModal = ref(false)
const selectedTaskId = ref(null)

const activeCreatingSprintId = ref(null)
const isCreatingBacklog = ref(false)
const newIssueTitle = ref('')

const sprints = computed(() => sprintStore.sprints)

const backlogTasks = computed(() => {
    let list = allTasks.value.filter(t => !t.sprintId)
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase().trim()
        list = list.filter(t => (t.title || '').toLowerCase().includes(q) || (t.taskKey || '').toLowerCase().includes(q))
    }
    return list
})

const getSprintTasks = (sprintId) => {
    let list = allTasks.value.filter(t => t.sprintId === sprintId)
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase().trim()
        list = list.filter(t => (t.title || '').toLowerCase().includes(q) || (t.taskKey || '').toLowerCase().includes(q))
    }
    return list
}

const getColumnCategory = (columnId) => {
    const col = columns.value.find(c => c.id === columnId)
    return col ? col.category : 'TO_DO'
}

const getStatusPoints = (sprintId, category) => {
    const tasks = allTasks.value.filter(t => t.sprintId === sprintId && getColumnCategory(t.columnId) === category)
    return tasks.reduce((sum, t) => sum + (t.points || 0), 0)
}

const getBacklogStatusPoints = (category) => {
    const tasks = allTasks.value.filter(t => !t.sprintId && getColumnCategory(t.columnId) === category)
    return tasks.reduce((sum, t) => sum + (t.points || 0), 0)
}

const formatDateShort = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

const getSprintStatusBadgeClass = (status) => {
    switch (status) {
        case 'ACTIVE': return 'bg-blue-100 text-blue-700'
        case 'COMPLETED': return 'bg-green-100 text-green-700'
        default: return 'bg-slate-200 text-slate-700'
    }
}

const loadData = async () => {
    if (!projectId.value) return
    isLoading.value = true
    try {
        await sprintStore.fetchSprints(projectId.value)
        
        const colRes = await columnStore.fetchColumnsByProjectId(projectId.value)
        columns.value = colRes.data?.data || []

        const taskRes = await taskStore.fetchTaskByProjectId(projectId.value)
        allTasks.value = (taskRes.data?.data?.items || []).filter(t => !t.parentId)

        const memberRes = await projectStore.getAllMemberByProjectId(projectId.value)
        memberOfProject.value = (memberRes?.data?.items || []).filter(m => m.status === 'ACTIVE')
    } catch (e) {
        console.error(e)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    loadData()
})

const handleCreateSprint = async () => {
    try {
        const nextNum = sprints.value.length + 1
        await sprintStore.createSprint(projectId.value, {
            name: `Sprint ${nextNum}`,
            goal: null
        })
    } catch (e) {
        console.error(e)
    }
}

const handleUpdateSprintStatus = async (sprintId, status) => {
    try {
        await sprintStore.updateSprintStatus(sprintId, status)
        await loadData()
    } catch (e) {
        console.error(e)
    }
}

const createIssueInSprint = async (sprintId) => {
    if (!newIssueTitle.value.trim()) return
    const defaultCol = columns.value.find(c => c.category === 'TO_DO') || columns.value[0]
    try {
        const payload = {
            sprintId,
            columnId: defaultCol ? defaultCol.id : null,
            parentId: null,
            title: newIssueTitle.value.trim(),
            priority: 'MEDIUM',
            type: 'TASK',
            points: 0
        }
        const res = await taskStore.createTask(projectId.value, payload)
        if (res.data?.data) {
            allTasks.value.push(res.data.data)
        }
        newIssueTitle.value = ''
        activeCreatingSprintId.value = null
    } catch (e) {
        console.error(e)
    }
}

const createIssueInBacklog = async () => {
    if (!newIssueTitle.value.trim()) return
    const defaultCol = columns.value.find(c => c.category === 'TO_DO') || columns.value[0]
    try {
        const payload = {
            sprintId: null,
            columnId: defaultCol ? defaultCol.id : null,
            parentId: null,
            title: newIssueTitle.value.trim(),
            priority: 'MEDIUM',
            type: 'TASK',
            points: 0
        }
        const res = await taskStore.createTask(projectId.value, payload)
        if (res.data?.data) {
            allTasks.value.push(res.data.data)
        }
        newIssueTitle.value = ''
        isCreatingBacklog.value = false
    } catch (e) {
        console.error(e)
    }
}

const handleMoveToSprint = async (task, sprintIdVal) => {
    const newSprintId = sprintIdVal ? Number(sprintIdVal) : null
    try {
        task.sprintId = newSprintId
        await taskStore.moveTask(task.id, {
            sprintId: newSprintId,
            columnId: task.columnId
        })
    } catch (e) {
        console.error(e)
    }
}

const handleStatusChange = async (task, newCategory) => {
    const targetCol = columns.value.find(c => c.category === newCategory) || columns.value[0]
    if (!targetCol) return
    try {
        task.columnId = targetCol.id
        await taskStore.moveTask(task.id, {
            sprintId: task.sprintId || null,
            columnId: targetCol.id
        })
    } catch (e) {
        console.error(e)
    }
}

const openDetail = (taskId) => {
    selectedTaskId.value = taskId
    openTaskModal.value = true
}

const onTaskUpdated = (updated) => {
    if (!updated) return
    const idx = allTasks.value.findIndex(t => t.id === updated.id)
    if (idx !== -1) allTasks.value[idx] = updated
}

const selectedTaskIds = ref([])

const toggleTaskSelection = (taskId) => {
    const idx = selectedTaskIds.value.indexOf(taskId)
    if (idx !== -1) {
        selectedTaskIds.value.splice(idx, 1)
    } else {
        selectedTaskIds.value.push(taskId)
    }
}

const isAllSprintTasksSelected = (sprintId) => {
    const tasks = getSprintTasks(sprintId)
    if (tasks.length === 0) return false
    return tasks.every(t => selectedTaskIds.value.includes(t.id))
}

const toggleSelectAllSprintTasks = (sprintId) => {
    const tasks = getSprintTasks(sprintId)
    if (isAllSprintTasksSelected(sprintId)) {
        const ids = tasks.map(t => t.id)
        selectedTaskIds.value = selectedTaskIds.value.filter(id => !ids.includes(id))
    } else {
        tasks.forEach(t => {
            if (!selectedTaskIds.value.includes(t.id)) {
                selectedTaskIds.value.push(t.id)
            }
        })
    }
}

const isAllBacklogTasksSelected = computed(() => {
    if (backlogTasks.value.length === 0) return false
    return backlogTasks.value.every(t => selectedTaskIds.value.includes(t.id))
})

const toggleSelectAllBacklogTasks = () => {
    if (isAllBacklogTasksSelected.value) {
        const ids = backlogTasks.value.map(t => t.id)
        selectedTaskIds.value = selectedTaskIds.value.filter(id => !ids.includes(id))
    } else {
        backlogTasks.value.forEach(t => {
            if (!selectedTaskIds.value.includes(t.id)) {
                selectedTaskIds.value.push(t.id)
            }
        })
    }
}

const openConfirmDeleteModal = ref(false)
const taskToDeleteId = ref(null)
const isBulkDelete = ref(false)

const confirmDeleteSingleTask = (taskId) => {
    taskToDeleteId.value = taskId
    isBulkDelete.value = false
    openConfirmDeleteModal.value = true
}

const confirmBulkDelete = () => {
    if (selectedTaskIds.value.length === 0) return
    isBulkDelete.value = true
    openConfirmDeleteModal.value = true
}

const executeDelete = async () => {
    try {
        if (isBulkDelete.value) {
            await Promise.all(selectedTaskIds.value.map(id => taskStore.deleteTask(id)))
            allTasks.value = allTasks.value.filter(t => !selectedTaskIds.value.includes(t.id))
            selectedTaskIds.value = []
        } else if (taskToDeleteId.value) {
            const taskId = taskToDeleteId.value
            const res = await taskStore.deleteTask(taskId)
            if (res.data?.success) {
                allTasks.value = allTasks.value.filter(t => t.id !== taskId)
                selectedTaskIds.value = selectedTaskIds.value.filter(id => id !== taskId)
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        openConfirmDeleteModal.value = false
        taskToDeleteId.value = null
        isBulkDelete.value = false
    }
}



const openEditSprintModalFlag = ref(false)
const editSprintForm = reactive({
    id: null,
    name: '',
    goal: '',
    startDate: '',
    endDate: ''
})

const openEditSprintModal = (sprint) => {
    editSprintForm.id = sprint.id
    editSprintForm.name = sprint.name || ''
    editSprintForm.goal = sprint.goal || ''
    editSprintForm.startDate = sprint.startDate ? sprint.startDate.split('T')[0] : ''
    editSprintForm.endDate = sprint.endDate ? sprint.endDate.split('T')[0] : ''
    openEditSprintModalFlag.value = true
}

const saveEditSprint = async () => {
    if (!editSprintForm.name.trim()) return
    try {
        const payload = {
            name: editSprintForm.name.trim(),
            goal: editSprintForm.goal || null,
            startDate: editSprintForm.startDate ? new Date(editSprintForm.startDate).toISOString() : null,
            endDate: editSprintForm.endDate ? new Date(editSprintForm.endDate).toISOString() : null
        }
        await sprintStore.updateSprint(editSprintForm.id, payload)
        openEditSprintModalFlag.value = false
    } catch (e) {
        console.error(e)
    }
}

const handleDeleteSprint = async (sprintId) => {
    try {
        await sprintStore.deleteSprint(sprintId)
        await loadData()
    } catch (e) {
        console.error(e)
    }
}
</script>
