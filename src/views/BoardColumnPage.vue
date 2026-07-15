<template>
    <div class="flex-1">
        <div class="flex items-start p-3 overflow-x-auto gap-3 hide-scrollbar">
            <div v-for="(col, index) in columns" :key="col.id" draggable="true" @dragover.prevent
                @dragstart="onColumnDragStart(index)" @drop="onColumnDrop(index)"
                class="w-60 shrink-0 bg-gray-300 p-3 rounded-xl space-y-2 flex flex-col max-h-[85vh]">
                <div class="font-bold flex justify-between relative">
                    <span class="">{{ col.title }}</span>
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
                <div class="space-y-2 flex-1 overflow-y-auto hide-scrollbar" @dragover.prevent
                    @drop.stop="onTaskDrop(col.id, col.tasks.length)">
                    <div v-for="(task, i) in col.tasks" :key="task.id" draggable="true" @dragover.prevent.stop
                        @dragstart.stop="onTaskDragStart(col.id, i)" @drop.stop="onTaskDrop(col.id, i)"
                        @click="showTaskDetail(task.id)"
                        class="group bg-white p-3 rounded-lg shadow-sm cursor-pointer border-2 border-transparent hover:border-slate-400 flex items-start gap-2">
                        <input type="checkbox" name="" id="" draggable="false"
                            class="mt-1 opacity-0 group-hover:opacity-100 checked:opacity-100 transition cursor-pointer">
                        <div class="flex-1">
                            {{ task.title }}
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <button v-if="!col.isAdding" @click="col.isAdding = true"
                        class="w-full text-left cursor-pointer hover:bg-slate-200 p-2 rounded-lg transition">
                        + Add a card
                    </button>

                    <div v-else>
                        <textarea name="" id="" placeholder="Enter a title" v-model="col.newTask"
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
        <ModalGeneric v-model="openModal" title="Update column info">
            <div class="space-y-6">
                <div class="">
                    <label for="projectName"
                        class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Column Name
                    </label>
                    <input type="text" id="projectName" placeholder="To do" v-model="columnInfo.title"
                        class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                </div>
                <div class="">
                    <label for="projectKey"
                        class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Category
                    </label>
                    <select type="text" id="projectKey" v-model="columnInfo.category"
                        class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                        <option value="TO_DO">To do</option>
                        <option value="IN_PROGRESS">In progress</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>
            </div>
            <template #footer>
                <div class="flex gap-2">
                    <SecondaryButton @click="openModal = false" :content="'Cancel'"></SecondaryButton>
                    <PrimaryButton @click="handleUpdateColumn(columnInfo.id)" :content="'Update'"></PrimaryButton>
                </div>
            </template>
        </ModalGeneric>
        <ModalGeneric v-model="openModalDelete" title="Confirm Delete">
            Do you want to delete?
            <template #footer>
                <div class="flex gap-2">
                    <SecondaryButton @click="openModalDelete = false" :content="'Cancel'"></SecondaryButton>
                    <button @click="deleteColumn"
                        class="w-full h-9 px-3 bg-red-500 text-white font-medium rounded-lg hover:opacity-80 transition-all flex items-center justify-center cursor-pointer gap-xs">
                        Delete
                    </button>
                </div>
            </template>
        </ModalGeneric>
        <ModalGeneric v-model="openTaskModal" width="1100px">
            <div class="grid grid-cols-3 gap-4">
                <div class="col-span-2 flex flex-col gap-2">
                    <div class="flex gap-2 items-center">
                        <input type="checkbox" name="" id=""
                            class="opacity-0 hover:opacity-100 checked:opacity-100 transition cursor-pointer shrink-0">
                        <StatusBadge :type="taskDetail.completedAt ? 'ACTIVE' : 'INACTIVE'"
                            :content="taskDetail.taskKey" class="shrink-0"></StatusBadge>
                        <input type="text" class="flex-1 min-w-0 text-xl font-medium" :value="taskDetail.title">
                    </div>
                    <div class="relative grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 ml-5 mt-4 gap-2">
                        <!-- <SecondaryButton :content="'Add'">
                            <template #icon>
                                <Plus></Plus>
                            </template>
                        </SecondaryButton> -->
                        <SecondaryButton :content="'Checklist'">
                            <template #icon>
                                <CircleCheckBig class="w-4"></CircleCheckBig>
                            </template>
                        </SecondaryButton>
                        <input type="date" name="" class="border border-slate-300 px-2 rounded-lg">
                        <SecondaryButton :content="'Attachment'">
                            <template #icon>
                                <Paperclip class="w-4"></Paperclip>
                            </template>
                        </SecondaryButton>
                        <SecondaryButton :content="'Member'" v-if="!taskDetail.assignee" @click="toggleShowMenuPopup">
                            <template #icon>
                                <UserPlus class="w-5"></UserPlus>
                            </template>
                        </SecondaryButton>
                        <div v-if="showMemberPopup"
                            class="absolute right-0 top-10 w-70 bg-white shadow-lg p-3 rounded-lg border border-slate-200 z-50">
                            <h1 class="text-center">Member</h1>
                            <input type="text" class="w-full p-2 border-2 border-slate-200 outline-none rounded-lg"
                                placeholder="Search members" v-model="searchMember">
                            <div class="w-full h-30 overflow-auto mt-5 scrollbar-none">
                                <div v-for="member in filteredMembers" :key="member.id"
                                    class="flex gap-2 mt-2 items-center hover:bg-slate-100 cursor-pointer p-1">
                                    <img src="https://res.cloudinary.com/dmzsletu0/image/upload/v1782044934/453178253_471506465671661_2781666950760530985_n_wqklyb.png"
                                        alt="" class="w-10 rounded-full">
                                    <span>{{ member.user.email || member.user.fullName }}</span>
                                </div>
                                <div v-if="filteredMembers.length === 0" class="text-center mt-5 text-slate-400">
                                    No member found
                                </div>
                            </div>
                        </div>
                    </div>
                    <span v-if="taskDetail.assignee" class="mt-5 ml-5 font-medium">Members</span>
                    <div v-if="taskDetail.assignee" class="flex ml-5 gap-2">
                        <div class="w-12 cursor-pointer">
                            <img src="https://res.cloudinary.com/dmzsletu0/image/upload/v1782044934/453178253_471506465671661_2781666950760530985_n_wqklyb.png"
                                alt="" :title="taskDetail.assignee?.email" class="rounded-full">
                        </div>
                        <button class="p-2.5 border-2 border-slate-300 rounded-full cursor-pointer">
                            <Plus></Plus>
                        </button>
                    </div>
                    <div class="flex justify-between ml-5 mt-2">
                        <div class="flex gap-4 items-center">
                            <SquarePen class="w-5"></SquarePen>
                            <span class="font-medium text-[17px]">Description</span>
                        </div>
                        <div v-if="!isEditTaskDesc" @click="isEditTaskDesc = true">
                            <SecondaryButton content="Edit">
                                <template #icon>
                                    <Pencil class="w-4"></Pencil>
                                </template>
                            </SecondaryButton>
                        </div>
                    </div>
                    <div class="flex flex-col ml-5 gap-3">
                        <textarea :value="taskDetail.description ? taskDetail.description : 'No description for task'"
                            class="w-full rounded-lg focus:outline-2 p-2 resize-none" rows="5" name="" id=""
                            :class="[isEditTaskDesc ? 'border border-slate-200' : '']"
                            @focus="isEditTaskDesc = true"></textarea>
                        <div class="flex gap-3" v-if="isEditTaskDesc">
                            <div>
                                <PrimaryButton content="Save"></PrimaryButton>
                            </div>
                            <div>
                                <SecondaryButton content="Cancel" @click="isEditTaskDesc = false"></SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-span-1 border-l-2 border-slate-200 flex px-2">
                    <div class="flex flex-col gap-3 w-full">
                        <div class="flex gap-3">
                            <MessageSquareText class="w-5"></MessageSquareText>
                            <span class="font-medium">Comments and activity</span>
                        </div>
                        <input type="text" class="p-1.5 bg-slate-200 rounded-lg" placeholder="Write a comment...">
                    </div>
                </div>
            </div>
        </ModalGeneric>
        <ToastMessage :show="toastOpen" :message="toastInfo.message" :type="toastInfo.type"></ToastMessage>
    </div>
</template>

<script setup>
import { CircleCheckBig, EllipsisVertical, MessageSquareText, Paperclip, Pencil, Plus, SquarePen, UserPlus, X } from '@lucide/vue';
import { onMounted, reactive, ref, watch, computed } from 'vue';
import { useColumnStore } from '../store/columnStore.js'
import { useRoute } from 'vue-router';
import { useTaskStore } from '../store/taskStore.js';
import StatusBadge from '../components/StatusBadge.vue';
import ModalGeneric from '../components/ModalGeneric.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import ToastMessage from '../components/ToastMessage.vue';
import { useProject } from '../store/projectStore.js';

const route = useRoute()
const projectStore = useProject()
const isAddingColumn = ref(false)
const newColumnTitle = ref('')
const draggedColumn = ref(null)
const draggedTask = ref(null)
const project = reactive({
    id: null
})
const openModal = ref(false)
const openModalDelete = ref(false)
const columnDeleteId = ref(null)

const openTaskModal = ref(false)
const isEditTaskDesc = ref(false)

const showMemberPopup = ref(false)
const searchMember = ref('')

const filteredMembers = computed(() => {
    if (!memberOfProject.value) return []
    const keyword = searchMember.value.toLowerCase().trim()
    if (!keyword) return memberOfProject.value

    return memberOfProject.value.filter(member => {
        const email = (member.user?.email || '').toLowerCase()
        const fullName = (member.user?.fullName || '').toLowerCase()
        return email.includes(keyword) || fullName.includes(keyword)
    })
})

const columns = ref([
    {
        id: 1,
        title: 'To do',
        tasks: [],
        isAdding: false,
        newTask: '',
        showMenu: false,
        category: ''
    }
])

const memberOfProject = ref(null)

const columnInfo = reactive({
    id: null,
    title: '',
    category: ''
})

const toastOpen = ref(false)
const toastInfo = reactive({
    message: null,
    type: 'success'
})

const taskDetail = ref([])

const columnStore = useColumnStore()
const taskStore = useTaskStore()

const showToastMessage = (message, type = 'success') => {
    toastInfo.message = message
    toastInfo.type = type
    toastOpen.value = true
    setTimeout(() => {
        toastOpen.value = false
        toastInfo.message = ''
    }, 3000)
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
    const columnIds = {
        columnIds: columns.value.map(c => c.id)
    }
    await columnStore.reorderColumn(projectId, columnIds)
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
            Object.assign(moveTask, updated)
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
    const taskData = res.data?.data

    col.tasks.push({ ...taskData })

    col.newTask = ''
    col.isAdding = false
}

const cancelTask = (col) => {
    col.newTask = ''
    col.isAdding = false
}

const addColumn = async () => {
    if (!newColumnTitle.value.trim()) return

    const columnInfo = {
        name: newColumnTitle.value,
        category: 'IN_PROGRESS'
    }

    const projectId = route.params?.id;
    const res = await columnStore.createColumn(projectId, columnInfo)

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
    const index = columns.value.findIndex(c => c.id === columnId);
    if (index !== -1) {
        columns.value.splice(index, 1);
    }

    try {
        const res = await columnStore.deleteColumn(columnId)
        if (res.data?.success) {
            openModalDelete.value = false
            showToastMessage(res.data?.message)
        } else {
            showToastMessage(res.data?.message, 'failed')
        }
    } catch (e) {
        const errorResponse = e.response
        const errorResponseData = e.response?.data
        showToastMessage(errorResponseData?.message || 'Delete failed', 'failed')
    }
}

const showConfirmDelete = (colId) => {
    openModalDelete.value = true
    columnDeleteId.value = colId
}

const editColumnInfo = (col) => {
    col.showMenu = false
    openModal.value = true
    columnInfo.id = col.id
    columnInfo.title = col.title
    columnInfo.category = col.category
}

const handleUpdateColumn = async (colId) => {
    if (!validateForm()) return
    try {
        const payload = {
            name: columnInfo.title,
            category: columnInfo.category
        }
        const res = await columnStore.updateColumn(colId, payload)
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
        const errorResponse = e.response
        const errorResponseData = e.response?.data
        showToastMessage(errorResponseData?.message || 'Update failed', 'failed')
    }
}

const validateForm = () => {
    if (!columnInfo.title || columnInfo.title.trim().length === 0) {
        showToastMessage('Please input column name', 'failed')
        return false
    }

    return true
}

const clearForm = () => {
    columnInfo.id = null
    columnInfo.title = null
    columnInfo.category = null
}

const showTaskDetail = async (taskId) => {
    openTaskModal.value = true
    try {
        const res = await taskStore.getTaskDetail(taskId)
        taskDetail.value = res.data?.data
    } catch (e) {
        console.log(e)
    }
}

// showShareModal removed

onMounted(async () => {
    const projectId = route.params?.id;
    project.id = projectId
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
    const tasksCol = taskRes.data?.data?.items || []

    tasksCol.forEach(task => {
        const col = columns.value.find((c => c.id === task.columnId))

        if (col) {
            col.tasks.push({ ...task })
        }
    })

    columns.value.forEach(col => {
        col.tasks.sort((a, b) => a.position - b.position)
    })

    const memberRes = await projectStore.getAllMemberByProjectId(projectId)
    memberOfProject.value = memberRes?.data?.items.filter(member => member.status === 'ACTIVE')
})

// Invitation management methods removed

const toggleShowMenuPopup = () => {
    showMemberPopup.value = !showMemberPopup.value
}

watch(openModal, (newValue) => {
    if (!newValue) {
        clearForm()
    }
})

watch(openModalDelete, (newValue) => {
    if (!newValue) {
        columnDeleteId.value = null
    }
})

watch(openTaskModal, (newValue) => {
    if (!newValue) {
        isEditTaskDesc.value = false
        showMemberPopup.value = false
    }
})
</script>