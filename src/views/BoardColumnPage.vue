<template>
    <div class="flex-1">
        <!-- Kanban Columns Board -->
        <div class="flex items-start p-3 overflow-x-auto gap-3 hide-scrollbar">
            <!-- Columns -->
            <div v-for="(col, index) in columns" :key="col.id" draggable="true" @dragover.prevent
                @dragstart="onColumnDragStart(index)" @drop="onColumnDrop(index)"
                class="w-60 shrink-0 bg-gray-300 p-3 rounded-xl space-y-2 flex flex-col max-h-[85vh]">

                <!-- Column Header -->
                <div class="font-bold flex justify-between relative">
                    <span>{{ col.title.toUpperCase() }}</span>
                    <button @click="col.showMenu = !col.showMenu"
                        class="px-1 rounded-full hover:bg-slate-200 cursor-pointer">
                        <EllipsisVertical class="w-4"></EllipsisVertical>
                    </button>

                    <div v-if="col.showMenu" @click="col.showMenu = false" class="fixed inset-0 z-10 cursor-default">
                    </div>
                    <div v-if="col.showMenu"
                        class="absolute top-8 right-0 bg-white shadow-lg rounded-lg w-32 border border-gray-200 z-20 text-sm font-normal overflow-hidden">
                        <button @click="editColumnInfo(col)"
                            class="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer transition">Edit</button>
                        <button @click="showConfirmDelete(col.id)"
                            class="w-full text-left px-3 py-2 hover:bg-red-100 text-red-600 cursor-pointer border-t border-gray-100 transition">Delete</button>
                    </div>
                </div>

                <!-- Task Cards List -->
                <div class="space-y-2 flex-1 overflow-y-auto hide-scrollbar" @dragover.prevent
                    @drop.stop="onTaskDrop(col.id, col.tasks.length)">
                    <TaskCard v-for="(task, i) in col.tasks" :key="task.id" :task="task"
                        @dragstart="onTaskDragStart(col.id, i)" @drop="onTaskDrop(col.id, i)"
                        @click="showTaskDetail(task.id)" @contextmenu="showTaskIdPopup($event, task.id, col.id)" />
                </div>

                <!-- Add Card Form -->
                <div class="mt-3">
                    <button v-if="!col.isAdding" @click="col.isAdding = true"
                        class="w-full text-left cursor-pointer hover:bg-slate-200 p-2 rounded-lg transition">
                        + Add a card
                    </button>

                    <div v-else>
                        <textarea placeholder="Enter a title" v-model="col.newTask"
                            class="bg-white rounded-lg w-full p-2 resize-none focus:outline-none"></textarea>
                        <div class="flex gap-2">
                            <button @click="addTask(col)" class="bg-slate-900 text-white px-3 py-1 rounded-lg">
                                Add card
                            </button>
                            <button @click="cancelTask(col)" class="cursor-pointer">
                                <X></X>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add Column Button/Form -->
            <div class="w-60 shrink-0">
                <button v-if="!isAddingColumn" @click="isAddingColumn = true"
                    class="w-full bg-gray-300 p-3 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-gray-400">
                    <Plus class="w-4" />
                    <span>Add a column</span>
                </button>
                <div v-else class="bg-gray-300 p-3 rounded-xl space-y-2">
                    <input v-model="newColumnTitle" placeholder="Enter column title..."
                        class="w-full p-2 rounded-lg focus:outline-none" />

                    <div class="flex gap-2">
                        <button @click="addColumn" class="bg-slate-900 text-white px-3 py-1 rounded-lg">
                            Add column
                        </button>
                        <button @click="cancelColumn">
                            <X></X>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Task Delete Context Popup -->
        <div v-if="showPopupTask" ref="popupRef" class="fixed flex flex-col w-30 rounded-lg gap-2 text-white"
            :style="{ top: `${taskY}px`, left: `${taskX}px` }">
            <button @click.stop="handleDeleteTask"
                class="p-2 shadow-lg border-slate-300 rounded-lg font-medium cursor-pointer bg-slate-100 text-red-500">
                Delete
            </button>
        </div>

        <!-- Column Update Modal -->
        <ModalGeneric v-model="openModal" title="Update column info">
            <div class="space-y-6">
                <div>
                    <label class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Column
                        Name</label>
                    <input type="text" placeholder="To do" v-model="columnInfo.title"
                        class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm outline-none font-light">
                </div>
                <div>
                    <label
                        class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                    <select v-model="columnInfo.category"
                        class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm outline-none font-light">
                        <option value="TO_DO">To do</option>
                        <option value="IN_PROGRESS">In progress</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>
            </div>
            <template #footer>
                <div class="flex gap-2">
                    <SecondaryButton @click="openModal = false" content="Cancel"></SecondaryButton>
                    <PrimaryButton @click="handleUpdateColumn(columnInfo.id)" content="Update"></PrimaryButton>
                </div>
            </template>
        </ModalGeneric>

        <!-- Column Delete Confirmation Modal -->
        <ModalGeneric v-model="openModalDelete" title="Confirm Delete">
            <div class="space-y-3">
                <div>Do you want to delete?</div>
                <div v-if="selectedDeleteColumn?.tasks && selectedDeleteColumn.tasks.length > 0"
                    class="text-sm space-y-1">
                    <div class="text-amber-600 font-medium">Select a target column to move existing tasks:</div>
                    <select v-model="moveToColumnId" class="w-full border border-slate-300 rounded-md p-2 outline-none">
                        <option v-for="targetCol in availableTargetColumns" :key="targetCol.id" :value="targetCol.id">
                            {{ targetCol.title }}
                        </option>
                    </select>
                </div>
            </div>
            <template #footer>
                <div class="flex gap-2">
                    <SecondaryButton @click="openModalDelete = false" content="Cancel"></SecondaryButton>
                    <button @click="deleteColumn"
                        class="w-full h-9 px-3 bg-red-500 text-white font-medium rounded-lg hover:opacity-80 transition cursor-pointer">
                        Delete
                    </button>
                </div>
            </template>
        </ModalGeneric>

        <!-- Task Detail Modal Component -->
        <TaskDetailModal v-model="openTaskModal" :taskId="selectedTaskId" :projectId="project.id"
            :memberOfProject="memberOfProject" @task-updated="onTaskUpdated" />

        <!-- Toast Message -->
        <ToastMessage :show="toastOpen" :message="toastInfo.message" :type="toastInfo.type"></ToastMessage>
    </div>
</template>

<script setup>
import { EllipsisVertical, Plus, X } from '@lucide/vue';
import { onMounted, reactive, ref, computed, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useColumnStore } from '../store/columnStore.js';
import { useTaskStore } from '../store/taskStore.js';
import { useProject } from '../store/projectStore.js';
import { useSprintStore } from '../store/sprintStore.js';

import ModalGeneric from '../components/ModalGeneric.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import ToastMessage from '../components/ToastMessage.vue';

import TaskCard from '../components/board/TaskCard.vue';
import TaskDetailModal from '../components/task/TaskDetailModal.vue';

const route = useRoute()
const projectStore = useProject()
const columnStore = useColumnStore()
const taskStore = useTaskStore()
const sprintStore = useSprintStore()

const props = defineProps({
    activeFilters: {
        type: Array,
        default: () => []
    },
    includeUnassigned: {
        type: Boolean,
        default: false
    }
})

const isAddingColumn = ref(false)
const newColumnTitle = ref('')
const draggedColumn = ref(null)
const draggedTask = ref(null)
const project = reactive({ id: null })

const openModal = ref(false)
const openModalDelete = ref(false)
const columnDeleteId = ref(null)
const moveToColumnId = ref(null)

const openTaskModal = ref(false)
const selectedTaskId = ref(null)

const showPopupTask = ref(false)
const popupTaskInfo = ref({ columnId: null, taskId: null })
const taskX = ref(null)
const taskY = ref(null)
const popupRef = ref(null)

const columns = ref([])
const allTasks = ref([])
const memberOfProject = ref(null)
const columnInfo = reactive({ id: null, title: '', category: '' })
const projectSprints = ref([])
const activeSprintIds = ref(new Set())

const toastOpen = ref(false)
const toastInfo = reactive({ message: null, type: 'success' })

const selectedDeleteColumn = computed(() => columns.value.find(c => c.id === columnDeleteId.value))
const availableTargetColumns = computed(() => columns.value.filter(c => c.id !== columnDeleteId.value))

const showToastMessage = (message, type = 'success') => {
    toastInfo.message = message
    toastInfo.type = type
    toastOpen.value = true
    setTimeout(() => {
        toastOpen.value = false
        toastInfo.message = ''
    }, 3000)
}

const showTaskDetail = (taskId) => {
    selectedTaskId.value = taskId
    openTaskModal.value = true
}

const onTaskUpdated = (updatedTask) => {
    if (!updatedTask) return
    const col = columns.value.find(c => c.id === updatedTask.columnId)
    if (col) {
        const task = col.tasks.find(t => t.id === updatedTask.id)
        if (task) {
            Object.assign(task, updatedTask)
        }
    }
}

const onColumnDragStart = (index) => {
    draggedColumn.value = index
    draggedTask.value = null
}

const onColumnDrop = async (index) => {
    if (draggedTask.value !== null) {
        const targetCol = columns.value[index]
        onTaskDrop(targetCol.id, targetCol.tasks.length)
        return
    }
    if (draggedColumn.value === null) return
    const from = draggedColumn.value
    const to = index
    if (from === to) {
        draggedColumn.value = null
        return
    }

    const moved = columns.value.splice(from, 1)[0]
    columns.value.splice(to, 0, moved)
    draggedColumn.value = null

    const projectId = route.params?.id
    await columnStore.reorderColumn(projectId, { columnIds: columns.value.map(c => c.id) })
}

const onTaskDragStart = (colId, index) => {
    draggedTask.value = { colId, index }
    draggedColumn.value = null
}

const onTaskDrop = async (targetColId, targetIndex) => {
    if (!draggedTask.value) return;

    const { colId: sourceColId, index: sourceIndex } = draggedTask.value;
    const sourceCol = columns.value.find(c => c.id === sourceColId);
    const targetCol = columns.value.find(c => c.id === targetColId);

    if (sourceCol && targetCol) {
        const [movedTask] = sourceCol.tasks.splice(sourceIndex, 1);
        if (sourceColId === targetColId && sourceIndex < targetIndex) {
            targetIndex--;
        }
        targetCol.tasks.splice(targetIndex, 0, movedTask);

        const tasks = targetCol.tasks;
        const beforeTask = tasks[targetIndex - 1] || null
        const afterTask = tasks[targetIndex + 1] || null

        const payload = {
            sprintId: null,
            columnId: targetColId,
            beforeTaskId: beforeTask ? beforeTask.id : null,
            afterTaskId: afterTask ? afterTask.id : null
        }

        const res = await taskStore.moveTask(movedTask.id, payload)
        const updated = res.data?.data
        if (updated) {
            Object.assign(movedTask, updated)
        }
    }
    draggedTask.value = null;
}

const addTask = async (col) => {
    if (!col.newTask.trim()) return

    const taskInfo = {
        sprintId: null,
        columnId: col.id,
        parentId: null,
        title: col.newTask,
        description: null,
        priority: 'MEDIUM',
        assigneeId: null,
        type: 'TASK',
        points: 0,
        estimatedHours: null,
        dueDate: null
    }

    const res = await taskStore.createTask(project.id, taskInfo)
    col.tasks.push({ ...res.data?.data })
    col.newTask = ''
    col.isAdding = false
}

const cancelTask = (col) => {
    col.newTask = ''
    col.isAdding = false
}

const addColumn = async () => {
    if (!newColumnTitle.value.trim()) return

    const projectId = route.params?.id;
    const res = await columnStore.createColumn(projectId, { name: newColumnTitle.value, category: 'IN_PROGRESS' })
    const newCol = res.data?.data;

    columns.value.push({
        id: newCol.id,
        title: newColumnTitle.value,
        tasks: [],
        isAdding: false,
        newTask: "",
        showMenu: false
    })

    newColumnTitle.value = ""
    isAddingColumn.value = false
}

const cancelColumn = () => {
    newColumnTitle.value = ""
    isAddingColumn.value = false
}

const deleteColumn = async () => {
    const columnId = columnDeleteId.value
    const sourceCol = columns.value.find(c => c.id === columnId)
    const hasTasks = sourceCol?.tasks && sourceCol.tasks.length > 0
    const targetColId = moveToColumnId.value

    try {
        const res = await columnStore.deleteColumn(columnId, hasTasks ? targetColId : null)
        if (res.data?.success) {
            if (sourceCol && hasTasks && targetColId) {
                const targetCol = columns.value.find(c => c.id === targetColId)
                if (targetCol) targetCol.tasks.push(...sourceCol.tasks)
            }
            const index = columns.value.findIndex(c => c.id === columnId)
            if (index !== -1) columns.value.splice(index, 1)
            openModalDelete.value = false
            showToastMessage(res.data?.message || 'Delete column success')
        } else {
            showToastMessage(res.data?.message || 'Delete column failed', 'failed')
        }
    } catch (e) {
        showToastMessage(e.response?.data?.message || 'Delete column failed', 'failed')
    }
}

const showConfirmDelete = (colId) => {
    openModalDelete.value = true
    columnDeleteId.value = colId
    const otherCols = columns.value.filter(c => c.id !== colId)
    moveToColumnId.value = otherCols.length > 0 ? otherCols[0].id : null
}

const editColumnInfo = (col) => {
    col.showMenu = false
    openModal.value = true
    columnInfo.id = col.id
    columnInfo.title = col.title
    columnInfo.category = col.category
}

const handleUpdateColumn = async (colId) => {
    if (!columnInfo.title || !columnInfo.title.trim()) {
        showToastMessage('Please input column name', 'failed')
        return
    }
    try {
        const res = await columnStore.updateColumn(colId, { name: columnInfo.title, category: columnInfo.category })
        if (res.data?.success) {
            openModal.value = false
            const currentCol = columns.value.find(col => col.id === colId)
            currentCol.title = res.data?.data.name
            currentCol.category = res.data?.data.category
            showToastMessage(res.data?.message)
        } else {
            showToastMessage(res.data?.message, 'failed')
        }
    } catch (e) {
        showToastMessage(e.response?.data?.message || 'Update failed', 'failed')
    }
}

const distributeTasksToColumns = (tasks) => {
    // Clear all tasks from columns
    columns.value.forEach(col => col.tasks = [])

    tasks.forEach(task => {
        if (!task.parentId) {
            if (projectSprints.value.length > 0) {
                // Scrum mode: show task only if its sprint is ACTIVE
                if (task.sprintId && activeSprintIds.value.has(task.sprintId)) {
                    const col = columns.value.find(c => c.id === task.columnId)
                    if (col) col.tasks.push({ ...task })
                }
            } else {
                // Kanban mode: show all tasks
                const col = columns.value.find(c => c.id === task.columnId)
                if (col) col.tasks.push({ ...task })
            }
        }
    })

    columns.value.forEach(col => col.tasks.sort((a, b) => a.position - b.position))
}

onMounted(async () => {
    const projectId = route.params?.id;
    project.id = projectId

    // Fetch sprints to check if Scrum project
    await sprintStore.fetchSprints(projectId)
    projectSprints.value = sprintStore.sprints
    // Collect IDs of ALL ACTIVE sprints (multiple sprints can be active simultaneously)
    activeSprintIds.value = new Set(
        projectSprints.value.filter(s => s.status === 'ACTIVE').map(s => s.id)
    )

    const res = await columnStore.fetchColumnsByProjectId(projectId)
    columns.value = res.data?.data.map((col) => ({
        id: col.id,
        title: col.name,
        position: col.position,
        tasks: [],
        isAdding: false,
        newTask: '',
        showMenu: false,
        category: col.category
    })).sort((a, b) => a.position - b.position)

    const taskRes = await taskStore.fetchTaskByProjectId(projectId)
    allTasks.value = taskRes.data?.data?.items || []

    distributeTasksToColumns(allTasks.value)

    const memberRes = await projectStore.getAllMemberByProjectId(projectId)
    memberOfProject.value = memberRes?.data?.items.filter(member => member.status === 'ACTIVE')
    document.addEventListener('click', handleClickOutside)
})

// Watch activeFilters and includeUnassigned to apply filter
watch([() => props.activeFilters, () => props.includeUnassigned], async ([newFilters, unassigned]) => {
    const projectId = project.id
    if (!projectId) return

    const hasApiFilters = newFilters && newFilters.length > 0

    if (hasApiFilters && !unassigned) {
        // Only API filters
        try {
            const res = await taskStore.filterTasksByProjectId(projectId, newFilters)
            const filteredTasks = res.data?.data || []
            distributeTasksToColumns(filteredTasks)
        } catch (e) {
            console.error('Filter error:', e)
        }
    } else if (hasApiFilters && unassigned) {
        // API filters + unassigned (merge results)
        try {
            const res = await taskStore.filterTasksByProjectId(projectId, newFilters)
            const apiTasks = res.data?.data || []
            const unassignedTasks = allTasks.value.filter(t => !t.assignee)
            // Merge and deduplicate
            const mergedMap = new Map()
            apiTasks.forEach(t => mergedMap.set(t.id, t))
            unassignedTasks.forEach(t => mergedMap.set(t.id, t))
            distributeTasksToColumns(Array.from(mergedMap.values()))
        } catch (e) {
            console.error('Filter error:', e)
        }
    } else if (unassigned) {
        // Only unassigned filter
        const unassignedTasks = allTasks.value.filter(t => !t.assignee)
        distributeTasksToColumns(unassignedTasks)
    } else {
        // No filters active, show all tasks
        distributeTasksToColumns(allTasks.value)
    }
}, { deep: true })

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

const showTaskIdPopup = (event, taskId, colId) => {
    taskX.value = event.clientX;
    taskY.value = event.clientY;
    showPopupTask.value = true
    popupTaskInfo.value.columnId = colId
    popupTaskInfo.value.taskId = taskId
}

const handleClickOutside = (e) => {
    if (showPopupTask.value && popupRef.value && !popupRef.value.contains(e.target)) {
        closePopupTask()
    }
}

const closePopupTask = () => {
    showPopupTask.value = false
    popupTaskInfo.value.columnId = null
    popupTaskInfo.value.taskId = null
}

const handleDeleteTask = async () => {
    try {
        const taskId = popupTaskInfo.value.taskId
        const colId = popupTaskInfo.value.columnId
        const res = await taskStore.deleteTask(taskId);
        const data = res.data
        if (data.success) {
            const taskList = columns.value.find(col => col.id === colId).tasks
            const index = taskList.findIndex(task => task.id === taskId)
            taskList.splice(index, 1);
            closePopupTask()
            showToastMessage(data.message || 'Delete task success')
        } else {
            showToastMessage(data.message || 'Delete task failed', 'failed')
        }
    } catch (e) {
        showToastMessage('Server error', 'failed')
    }
}

watch(openModal, (newValue) => {
    if (!newValue) {
        columnInfo.id = null
        columnInfo.title = null
        columnInfo.category = null
    }
})

watch(openModalDelete, (newValue) => {
    if (!newValue) {
        columnDeleteId.value = null
        moveToColumnId.value = null
    }
})
</script>