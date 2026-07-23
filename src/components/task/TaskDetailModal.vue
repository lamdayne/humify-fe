<template>
    <ModalGeneric :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" width="1100px">
        <!-- Loading Spinner State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
            <LoaderCircle class="w-8 h-8 animate-spin text-slate-800" />
            <span class="text-sm font-medium">Loading task details...</span>
        </div>

        <!-- Task Detail Content -->
        <div v-else class="grid grid-cols-3 gap-4">
            <div class="col-span-2 flex flex-col gap-2 max-h-[65vh] min-h-0 overflow-y-auto scrollbar-none">
                <!-- Task Title Header -->
                <div class="flex gap-2 items-center">
                    <input type="checkbox"
                        class="opacity-0 hover:opacity-100 checked:opacity-100 transition cursor-pointer shrink-0">
                    <StatusBadge :type="taskDetail.completedAt ? 'ACTIVE' : 'INACTIVE'"
                        :content="taskDetail.taskKey || 'TASK'" class="shrink-0"></StatusBadge>
                    <input type="text" class="flex-1 min-w-0 text-xl font-medium" v-model="taskDetail.title"
                        @keydown.enter="handleSaveTask; $event.target.blur()">
                </div>
                
                <!-- Horizontal Action Buttons Bar -->
                <div class="relative flex flex-wrap items-center ml-5 mt-3 gap-2">
                    <!-- Click Backdrop Overlay -->
                    <div v-if="isAnyPopupOpen" @click="closeAllPopups" class="fixed inset-0 z-40 cursor-default"></div>

                    <!-- + Add Button -->
                    <div class="relative inline-block z-50">
                        <button @click="showAddMenuPopup = !showAddMenuPopup"
                            class="inline-flex items-center gap-1.5 px-3 h-9 border border-slate-300 bg-white text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 cursor-pointer transition">
                            <Plus class="w-4 h-4 text-slate-600"></Plus>
                            <span>Add</span>
                        </button>

                        <AddCardMenuPopup v-if="showAddMenuPopup"
                            @close="showAddMenuPopup = false"
                            @select-priority="showPriorityPopup = true; showAddMenuPopup = false"
                            @select-type="showTypePopup = true; showAddMenuPopup = false"
                            @select-points="showPointsPopup = true; showAddMenuPopup = false"
                            @select-estimated-hours="showEstimatedHoursPopup = true; showAddMenuPopup = false"
                            @select-checklist="showChecklist = true; showAddMenuPopup = false"
                            @select-members="showMemberPopup = true; showAddMenuPopup = false"
                            @select-attachment="fileInputRef.click(); showAddMenuPopup = false" />

                        <!-- Priority Selector Popup -->
                        <div v-if="showPriorityPopup"
                            class="absolute left-0 top-10 w-44 bg-white shadow-xl p-2 rounded-xl border border-slate-200 z-50 text-xs flex flex-col gap-1">
                            <div class="flex justify-between items-center pb-1 border-b border-slate-100">
                                <span class="font-bold text-[11px] text-slate-700 uppercase">Select Priority</span>
                                <button @click="showPriorityPopup = false" class="text-slate-400 hover:text-slate-700">
                                    <X class="w-3.5 h-3.5"></X>
                                </button>
                            </div>
                            <button v-for="p in ['LOW', 'MEDIUM', 'HIGH', 'URGENT']" :key="p"
                                @click="taskDetail.priority = p; handleSaveTask(); showPriorityPopup = false"
                                class="text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer font-medium transition flex items-center justify-between"
                                :class="[taskDetail.priority === p ? 'bg-slate-100 font-bold text-blue-600' : 'text-slate-700']">
                                <span>{{ p }}</span>
                                <span class="w-2 h-2 rounded-full" :class="getPriorityDotClass(p)"></span>
                            </button>
                        </div>

                        <!-- Type Selector Popup -->
                        <div v-if="showTypePopup"
                            class="absolute left-0 top-10 w-44 bg-white shadow-xl p-2 rounded-xl border border-slate-200 z-50 text-xs flex flex-col gap-1">
                            <div class="flex justify-between items-center pb-1 border-b border-slate-100">
                                <span class="font-bold text-[11px] text-slate-700 uppercase">Select Type</span>
                                <button @click="showTypePopup = false" class="text-slate-400 hover:text-slate-700">
                                    <X class="w-3.5 h-3.5"></X>
                                </button>
                            </div>
                            <button v-for="t in ['TASK', 'BUG', 'FEATURE', 'STORY']" :key="t"
                                @click="taskDetail.type = t; handleSaveTask(); showTypePopup = false"
                                class="text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer font-medium transition"
                                :class="[taskDetail.type === t ? 'bg-slate-100 font-bold text-purple-600' : 'text-slate-700']">
                                {{ t }}
                            </button>
                        </div>

                        <!-- Story Points Popup -->
                        <div v-if="showPointsPopup"
                            class="absolute left-0 top-10 w-48 bg-white shadow-xl p-3 rounded-xl border border-slate-200 z-50 text-xs flex flex-col gap-2">
                            <div class="flex justify-between items-center pb-1 border-b border-slate-100">
                                <span class="font-bold text-[11px] text-slate-700 uppercase">Story Points</span>
                                <button @click="showPointsPopup = false" class="text-slate-400 hover:text-slate-700">
                                    <X class="w-3.5 h-3.5"></X>
                                </button>
                            </div>
                            <input type="number" min="0" v-model="taskDetail.points"
                                @keydown.enter="handleSaveTask(); showPointsPopup = false"
                                placeholder="Enter points..."
                                class="w-full border border-slate-300 p-2 rounded-lg outline-none text-xs">
                            <button @click="handleSaveTask(); showPointsPopup = false"
                                class="bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-800 transition cursor-pointer">
                                Save
                            </button>
                        </div>

                        <!-- Estimated Hours Popup -->
                        <div v-if="showEstimatedHoursPopup"
                            class="absolute left-0 top-10 w-48 bg-white shadow-xl p-3 rounded-xl border border-slate-200 z-50 text-xs flex flex-col gap-2">
                            <div class="flex justify-between items-center pb-1 border-b border-slate-100">
                                <span class="font-bold text-[11px] text-slate-700 uppercase">Estimated Hours</span>
                                <button @click="showEstimatedHoursPopup = false" class="text-slate-400 hover:text-slate-700">
                                    <X class="w-3.5 h-3.5"></X>
                                </button>
                            </div>
                            <input type="number" step="0.5" min="0" v-model="taskDetail.estimatedHours"
                                @keydown.enter="handleSaveTask(); showEstimatedHoursPopup = false"
                                placeholder="Enter hours..."
                                class="w-full border border-slate-300 p-2 rounded-lg outline-none text-xs">
                            <button @click="handleSaveTask(); showEstimatedHoursPopup = false"
                                class="bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-slate-800 transition cursor-pointer">
                                Save
                            </button>
                        </div>
                    </div>

                    <!-- Dates Button & Popup -->
                    <div class="relative inline-block z-50">
                        <button @click="showDatesPopup = true"
                            class="inline-flex items-center gap-1.5 px-3 h-9 border border-slate-300 bg-white text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 cursor-pointer transition">
                            <Calendar class="w-4 h-4 text-slate-600"></Calendar>
                            <span>Dates</span>
                        </button>

                        <DatesPopup v-if="showDatesPopup"
                            :modelValue="taskDetail.dueDate"
                            @close="showDatesPopup = false"
                            @save="onSaveDueDate"
                            @remove="onRemoveDueDate" />
                    </div>

                    <!-- Checklist Button -->
                    <button @click="showChecklist = true"
                        class="inline-flex items-center gap-1.5 px-3 h-9 border border-slate-300 bg-white text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 cursor-pointer transition">
                        <CircleCheckBig class="w-4 h-4 text-slate-600"></CircleCheckBig>
                        <span>Checklist</span>
                    </button>

                    <!-- Attachment Button -->
                    <div>
                        <input type="file" ref="fileInputRef" class="hidden" multiple @change="onFileSelected">
                        <button @click="fileInputRef.click()"
                            class="inline-flex items-center gap-1.5 px-3 h-9 border border-slate-300 bg-white text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 cursor-pointer transition">
                            <Paperclip class="w-4 h-4 text-slate-600"></Paperclip>
                            <span>Attachment</span>
                        </button>
                    </div>

                    <!-- Members Button -->
                    <div class="relative inline-block z-50">
                        <button @click="showMemberPopup = !showMemberPopup"
                            class="inline-flex items-center gap-1.5 px-3 h-9 border border-slate-300 bg-white text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-50 cursor-pointer transition">
                            <UserPlus class="w-4 h-4 text-slate-600"></UserPlus>
                            <span>Members</span>
                        </button>

                        <MemberAssignPopup v-if="showMemberPopup"
                            :members="memberOfProject"
                            @close="showMemberPopup = false"
                            @select-member="handleAssignTask" />
                    </div>
                </div>

                <!-- Active Properties Display Bar (Including Due Date if present!) -->
                <div v-if="taskDetail.priority || taskDetail.type || taskDetail.points || taskDetail.estimatedHours || taskDetail.dueDate"
                    class="flex ml-5 mt-3 gap-2 flex-wrap items-center text-xs">
                    <!-- Due Date Badge in Detail View -->
                    <span v-if="taskDetail.dueDate"
                        class="px-2.5 py-1 rounded-md font-medium bg-blue-100 text-blue-800 flex items-center gap-1.5">
                        <Calendar class="w-3.5 h-3.5 text-blue-600"></Calendar>
                        <span>Due date: {{ formatDateLong(taskDetail.dueDate) }}</span>
                    </span>

                    <span v-if="taskDetail.priority" class="px-2 py-1 rounded font-medium flex items-center gap-1.5"
                        :class="getPriorityBadgeClass(taskDetail.priority)">
                        <span>Priority: {{ taskDetail.priority }}</span>
                    </span>
                    <span v-if="taskDetail.type" class="px-2 py-1 rounded font-medium bg-purple-100 text-purple-700">
                        Type: {{ taskDetail.type }}
                    </span>
                    <span v-if="taskDetail.points" class="px-2 py-1 rounded font-medium bg-slate-200 text-slate-700">
                        {{ taskDetail.points }} Story Points
                    </span>
                    <span v-if="taskDetail.estimatedHours" class="px-2 py-1 rounded font-medium bg-amber-100 text-amber-800">
                        {{ taskDetail.estimatedHours }}h Est.
                    </span>
                </div>

                <!-- Assignee display -->
                <span v-if="taskDetail.assignee" class="mt-4 ml-5 font-medium text-xs text-slate-500 uppercase tracking-wider">Members</span>
                <div v-if="taskDetail.assignee" class="flex ml-5 gap-2 items-center">
                    <div @click="showMemberPopup = !showMemberPopup" class="w-9 h-9 cursor-pointer" :title="taskDetail.assignee?.email">
                        <img src="https://res.cloudinary.com/dmzsletu0/image/upload/v1782044934/453178253_471506465671661_2781666950760530985_n_wqklyb.png"
                            alt="" class="w-full h-full rounded-full border border-slate-200 hover:border-slate-400 transition">
                    </div>
                    <button @click="showMemberPopup = !showMemberPopup" class="p-2 border border-slate-300 rounded-full cursor-pointer hover:bg-slate-100 transition text-slate-700">
                        <Plus class="w-4 h-4"></Plus>
                    </button>
                </div>

                <!-- Checklist Component -->
                <TaskChecklistSection v-if="showChecklist || (taskDetail.subtasks && taskDetail.subtasks.length > 0)"
                    :subtasks="taskDetail.subtasks"
                    @add-item="handleAddSubtask"
                    @toggle-check="toggleSubtaskCheck"
                    @delete-item="handleDeleteSubtask" />

                <!-- Description Section -->
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
                <div class="flex flex-col ml-5 mr-1 gap-3">
                    <textarea v-model="taskDetail.description" placeholder="No description for task"
                        class="w-full rounded-lg focus:outline-2 p-2 resize-none" rows="5"
                        :class="[isEditTaskDesc ? 'border border-slate-200' : '']"
                        @focus="isEditTaskDesc = true"></textarea>
                    <div class="flex gap-3" v-if="isEditTaskDesc">
                        <div>
                            <PrimaryButton content="Save" @click="handleSaveTask(); isEditTaskDesc = false"></PrimaryButton>
                        </div>
                        <div>
                            <SecondaryButton content="Cancel" @click="isEditTaskDesc = false"></SecondaryButton>
                        </div>
                    </div>
                </div>

                <!-- Attachments List Section -->
                <div v-if="taskAttachments && taskAttachments.length > 0" class="flex flex-col ml-5 gap-3 mt-4 mb-2">
                    <div class="flex gap-3">
                        <Paperclip class="w-5"></Paperclip>
                        <span class="text-[17px] font-medium">Attachment</span>
                    </div>
                    <div v-for="ta in taskAttachments" :key="ta.id" class="flex justify-between items-center w-full">
                        <div class="flex gap-3 items-center">
                            <div class="p-4 bg-slate-200 rounded-lg">
                                <File></File>
                            </div>
                            <div class="flex flex-col gap-2 justify-center">
                                <span class="font-medium">{{ ta.fileName }}</span>
                                <span>{{ formatFileSize(ta.fileSize) }}</span>
                            </div>
                        </div>
                        <div class="flex gap-3 items-center">
                            <a :href="ta.fileUrl" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
                                <ExternalLink class="w-5 h-5" />
                            </a>
                            <div class="relative">
                                <button @click="togglePopupAttachmentSelected(ta.id)" class="p-1 border border-slate-300 rounded-lg cursor-pointer">
                                    <Ellipsis></Ellipsis>
                                </button>
                                <div v-if="taskAttachmentFileSelected == ta.id" class="absolute right-0 mt-1 w-40 bg-white shadow-xl rounded-lg border border-slate-200 z-50 py-1">
                                    <button v-if="isImage(ta.fileUrl)" @click="handlePreviewImage(ta.fileUrl)" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center gap-2 cursor-pointer">Preview</button>
                                    <button @click="downloadFile(ta)" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center gap-2 cursor-pointer">Download</button>
                                    <button @click="deleteAttachment(ta.id)" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 text-red-600 flex items-center gap-2 cursor-pointer">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Activity & Comments Sidebar Component -->
            <TaskActivitySidebar :comments="taskComments" :activities="taskActivities"
                @add-comment="handleAddComment" />
        </div>
    </ModalGeneric>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Calendar, CircleCheckBig, Ellipsis, ExternalLink, File, LoaderCircle, Paperclip, Pencil, Plus, SquarePen, UserPlus, X } from '@lucide/vue';
import { useTaskStore } from '../../store/taskStore.js';
import { useUploadStore } from '../../store/uploadStore.js';

import StatusBadge from '../StatusBadge.vue';
import ModalGeneric from '../ModalGeneric.vue';
import PrimaryButton from '../PrimaryButton.vue';
import SecondaryButton from '../SecondaryButton.vue';

import AddCardMenuPopup from './popups/AddCardMenuPopup.vue';
import DatesPopup from './popups/DatesPopup.vue';
import MemberAssignPopup from './popups/MemberAssignPopup.vue';
import TaskChecklistSection from './TaskChecklistSection.vue';
import TaskActivitySidebar from './TaskActivitySidebar.vue';

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    taskId: { type: [Number, String], default: null },
    projectId: { type: [Number, String], default: null },
    memberOfProject: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'task-updated', 'toast'])

const taskStore = useTaskStore()
const uploadStore = useUploadStore()

const isLoading = ref(false)
const isEditTaskDesc = ref(false)
const taskDetail = ref({})

const showMemberPopup = ref(false)
const showPriorityPopup = ref(false)
const showTypePopup = ref(false)
const showPointsPopup = ref(false)
const showEstimatedHoursPopup = ref(false)
const showDatesPopup = ref(false)
const showAddMenuPopup = ref(false)

const taskAttachments = ref([])
const taskAttachmentFileSelected = ref(null)
const previewImageUrl = ref('')
const openPreviewImage = ref(false)

const taskComments = ref([])
const taskActivities = ref([])
const showChecklist = ref(false)
const fileInputRef = ref(null)

const isAnyPopupOpen = computed(() => {
    return showAddMenuPopup.value || showPriorityPopup.value || showTypePopup.value ||
        showPointsPopup.value || showEstimatedHoursPopup.value || showMemberPopup.value || showDatesPopup.value
})

const closeAllPopups = () => {
    showAddMenuPopup.value = false
    showPriorityPopup.value = false
    showTypePopup.value = false
    showPointsPopup.value = false
    showEstimatedHoursPopup.value = false
    showMemberPopup.value = false
    showDatesPopup.value = false
}

const formatDateLong = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const getPriorityBadgeClass = (priority) => {
    switch (priority) {
        case 'URGENT':
        case 'HIGH': return 'bg-red-100 text-red-700'
        case 'MEDIUM': return 'bg-amber-100 text-amber-700'
        case 'LOW': return 'bg-green-100 text-green-700'
        default: return 'bg-slate-100 text-slate-600'
    }
}

const getPriorityDotClass = (priority) => {
    switch (priority) {
        case 'URGENT':
        case 'HIGH': return 'bg-red-500'
        case 'MEDIUM': return 'bg-amber-500'
        case 'LOW': return 'bg-green-500'
        default: return 'bg-slate-400'
    }
}

const fetchDetail = async (id) => {
    if (!id) return
    isLoading.value = true
    try {
        const res = await taskStore.getTaskDetail(id)
        taskDetail.value = res.data?.data || {}
        await getTaskAttachment(id)
        await fetchComments(id)
        await fetchActivities(id)
    } catch (e) {
        console.error(e)
    } finally {
        isLoading.value = false
    }
}

const fetchComments = async (id) => {
    try {
        const res = await taskStore.getComments(id)
        taskComments.value = res.data?.data || []
    } catch (e) {
        console.error(e)
    }
}

const fetchActivities = async (id) => {
    try {
        const res = await taskStore.getActivities(id)
        taskActivities.value = res.data?.data || []
    } catch (e) {
        console.error(e)
    }
}

const handleSaveTask = async () => {
    if (!taskDetail.value?.id) return
    try {
        const payload = {
            title: taskDetail.value.title,
            description: taskDetail.value.description,
            priority: taskDetail.value.priority || 'MEDIUM',
            type: taskDetail.value.type || 'TASK',
            points: taskDetail.value.points !== undefined && taskDetail.value.points !== null && taskDetail.value.points !== '' ? Number(taskDetail.value.points) : 0,
            estimatedHours: taskDetail.value.estimatedHours !== undefined && taskDetail.value.estimatedHours !== null && taskDetail.value.estimatedHours !== '' ? Number(taskDetail.value.estimatedHours) : null,
            dueDate: taskDetail.value.dueDate || null,
            completedAt: taskDetail.value.completedAt || null
        }
        const res = await taskStore.updateTask(taskDetail.value.id, payload)
        const updated = res.data?.data
        if (updated) {
            Object.assign(taskDetail.value, updated)
            emit('task-updated', updated)
        }
        await fetchActivities(taskDetail.value.id)
    } catch (e) {
        console.error(e)
    }
}

const onSaveDueDate = (isoDate) => {
    taskDetail.value.dueDate = isoDate
    handleSaveTask()
    showDatesPopup.value = false
}

const onRemoveDueDate = () => {
    taskDetail.value.dueDate = null
    handleSaveTask()
    showDatesPopup.value = false
}

const handleAssignTask = async (userId) => {
    try {
        const res = await taskStore.assignTask(taskDetail.value.id, userId)
        if (res.data?.success) {
            taskDetail.value.assignee = res.data?.data?.assignee
            emit('task-updated', taskDetail.value)
            await fetchActivities(taskDetail.value.id)
        }
    } catch (e) {
        console.error(e)
    }
    showMemberPopup.value = false
}

const handleAddComment = async (content) => {
    if (!content || !taskDetail.value?.id) return
    try {
        const res = await taskStore.createComment(taskDetail.value.id, { content, parentId: null })
        if (res.data?.success || res.data?.data) {
            await fetchComments(taskDetail.value.id)
            await fetchActivities(taskDetail.value.id)
        }
    } catch (e) {
        console.error(e)
    }
}

const handleAddSubtask = async (title) => {
    if (!title || !taskDetail.value?.id) return
    try {
        const payload = {
            sprintId: taskDetail.value.sprintId || null,
            columnId: taskDetail.value.columnId,
            parentId: taskDetail.value.id,
            title,
            description: null,
            priority: 'MEDIUM',
            assigneeId: null,
            type: 'TASK',
            points: 0,
            estimatedHours: null,
            dueDate: null
        }
        const res = await taskStore.createTask(props.projectId, payload)
        if (res.data?.success || res.data?.data) {
            showChecklist.value = true
            const detailRes = await taskStore.getTaskDetail(taskDetail.value.id)
            taskDetail.value = detailRes.data?.data || taskDetail.value
            emit('task-updated', taskDetail.value)
        }
    } catch (e) {
        console.error(e)
    }
}

const handleDeleteSubtask = async (subtaskId) => {
    try {
        const res = await taskStore.deleteTask(subtaskId)
        if (res.data?.success) {
            const detailRes = await taskStore.getTaskDetail(taskDetail.value.id)
            taskDetail.value = detailRes.data?.data || taskDetail.value
            emit('task-updated', taskDetail.value)
        }
    } catch (e) {
        console.error(e)
    }
}

const toggleSubtaskCheck = async (subtask) => {
    const isCompleted = !!subtask.completedAt
    const nextCompletedAt = isCompleted ? null : new Date().toISOString()
    subtask.completedAt = nextCompletedAt
    try {
        const payload = {
            title: subtask.title,
            priority: subtask.priority || 'MEDIUM',
            type: subtask.type || 'TASK',
            points: subtask.points || 0,
            completedAt: nextCompletedAt
        }
        await taskStore.updateTask(subtask.id, payload)
        if (taskDetail.value?.id) {
            await fetchActivities(taskDetail.value.id)
        }
    } catch (e) {
        subtask.completedAt = isCompleted ? new Date().toISOString() : null
        console.error(e)
    }
}

const onFileSelected = async (event) => {
    const files = Array.from(event.target.files)
    event.target.value = ''
    if (!files.length) return

    for (const file of files) {
        const presignRes = await uploadStore.getPresignedUrl('tasks')
        const presignData = presignRes.data?.data
        const cloudinaryRes = await uploadStore.uploadToCloudinary(file, presignData)

        const payload = {
            fileName: cloudinaryRes.original_filename,
            fileUrl: cloudinaryRes.secure_url,
            fileSize: cloudinaryRes.bytes
        }

        const res = await taskStore.addAttachment(taskDetail.value.id, payload)
        if (res.data?.success) {
            taskAttachments.value.push(res.data?.data)
            await fetchActivities(taskDetail.value.id)
        }
    }
}

const getTaskAttachment = async (id) => {
    try {
        const res = await taskStore.getAttachment(id)
        taskAttachments.value = res.data?.data || []
    } catch (e) {
        console.error(e)
    }
}

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 bytes'
    const k = 1024
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i))).toFixed(2) + ' ' + sizes[i]
}

const togglePopupAttachmentSelected = (id) => {
    taskAttachmentFileSelected.value = taskAttachmentFileSelected.value ? null : id
}

const isImage = (url) => {
    if (!url) return false
    if (url.includes('/image/')) return true
    if (url.includes('/raw/') || url.includes('/video/')) return false
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)
}

const downloadFile = (ta) => {
    const link = document.createElement('a');
    link.href = ta.fileUrl.replace('/upload/', '/upload/fl_attachment/');
    link.download = ta.fileName || 'file';
    link.click();
}

const handlePreviewImage = (url) => {
    if (isImage(url)) {
        previewImageUrl.value = url
        openPreviewImage.value = true
    }
}

const deleteAttachment = async (taskAttachmentId) => {
    try {
        const res = await taskStore.deleteAttachment(taskAttachmentId)
        if (res.data?.success) {
            const index = taskAttachments.value.findIndex(ta => ta.id === taskAttachmentId);
            if (index !== -1) taskAttachments.value.splice(index, 1)
            if (taskDetail.value?.id) await fetchActivities(taskDetail.value.id)
        }
    } catch (e) {
        console.error(e)
    }
}

watch(() => props.taskId, (newId) => {
    if (props.modelValue && newId) {
        fetchDetail(newId)
    }
})

watch(() => props.modelValue, (isOpen) => {
    if (isOpen && props.taskId) {
        fetchDetail(props.taskId)
    } else if (!isOpen) {
        closeAllPopups()
        isEditTaskDesc.value = false
        taskAttachments.value = []
        taskComments.value = []
        taskActivities.value = []
        showChecklist.value = false
    }
})
</script>
