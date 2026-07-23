<template>
    <MainContent>
        <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans antialiased text-slate-900 relative">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-start gap-4 mb-8">
                <div>
                    <h1 class="text-3xl font-semibold text-slate-900 tracking-tight mb-1">Project</h1>
                    <nav class="flex items-center gap-1.5 text-xs text-slate-400 font-light">
                        <span class="hover:text-slate-600 cursor-pointer transition-colors">Organization</span>
                        <span>&gt;</span>
                        <span class="text-slate-600 font-normal">Project</span>
                    </nav>
                </div>

                <div class="w-auto min-w-30">
                    <PrimaryButton :content="'Create Project'" @click="openModalDialog">
                        <template #icon>
                            <Plus class="w-5"></Plus>
                        </template>
                    </PrimaryButton>
                </div>
            </div>

            <ProjectSkeleton v-if="isLoading"></ProjectSkeleton>
            <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <router-link :to="`/project/${project.id}`" v-for="project in projects" :key="project.id"
                    class="bg-slate w-full flex flex-col justify-between h-35 rounded-xl border border-slate-200 shadow-xs p-4 cursor-pointer">
                    <div class="flex items-center justify-between">
                        <h1 class="text-lg font-semibold">{{ project.name }}</h1>
                        <StatusBadge :type="resolveStatusType(project.status)" :content="project.status"></StatusBadge>
                    </div>
                    <p class="text-xs text-slate-500 line-clamp-2">
                        {{ project.description || 'No description provided.' }}
                    </p>
                    <div class="relative self-end">
                        <Settings @click.stop.prevent="toggleMenuSetting(project.id)" class="w-4 h-4 cursor-pointer">
                        </Settings>

                        <!-- Click outside overlay -->
                        <div v-if="activeMenuId === project.id" @click.stop.prevent="activeMenuId = null"
                            class="fixed inset-0 z-40 cursor-default"></div>

                        <div v-if="activeMenuId === project.id"
                            class="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                            <button @click.stop.prevent="openUpdateModal(project); activeMenuId = null"
                                class="w-full text-left px-4 py-2 hover:bg-slate-100 cursor-pointer">
                                Update
                            </button>
                            <button @click.stop.prevent="openConfirmDeleteModal(project.id); activeMenuId = null"
                                class="w-full text-left px-4 py-2 hover:bg-slate-100 cursor-pointer text-red-500">
                                Delete
                            </button>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>

        <!-- Modal create project -->
        <ModalGeneric v-model="isModalOpen" :title="'Create new project'">
            <div class="space-y-5">
                <div>
                    <label for="projectName"
                        class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Project Name
                    </label>
                    <input type="text" id="projectName" placeholder="Ecommerce" v-model="projectValue.name"
                        class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                </div>
                <div>
                    <label for="projectKey"
                        class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Project Key
                    </label>
                    <input type="text" id="projectKey" placeholder="ECM" v-model="projectValue.key"
                        class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                </div>

                <!-- Create Sprint Checkbox Option -->
                <div class="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input type="checkbox" id="createSprint" v-model="projectValue.createSprint" class="w-4 h-4 accent-slate-900 cursor-pointer">
                    <label for="createSprint" class="text-xs font-medium text-slate-700 cursor-pointer select-none">
                        Enable Sprint Management (Creates initial Sprint 1)
                    </label>
                </div>

                <div>
                    <label for="description"
                        class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                    <textarea id="description" rows="3" placeholder="Briefly describe the project..."
                        v-model="projectValue.description"
                        class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light resize-none"></textarea>
                </div>
            </div>
            <template #footer>
                <div class="flex gap-2">
                    <SecondaryButton @click="isModalOpen = false" :content="'Cancel'"></SecondaryButton>
                    <PrimaryButton @click="handleCreateProject" :content="'Create'"></PrimaryButton>
                </div>
            </template>
        </ModalGeneric>

        <!-- Modal update project -->
        <ModalGeneric v-model="updateProjectInfo.isUpdate" :title="'Update project'">
            <div class="space-y-6">
                <div class="">
                    <label for="projectName"
                        class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Project Name
                    </label>
                    <input type="text" id="projectName" placeholder="Ecommerce" v-model="updateProjectInfo.name"
                        class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                </div>
                <div>
                    <label for="description"
                        class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Status</label>
                    <select type="text" id="projectKey" v-model="updateProjectInfo.status"
                        class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                </div>
                <div>
                    <label for="description"
                        class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                    <textarea id="description" rows="4" placeholder="Briefly describe the key responsibilities..."
                        v-model="updateProjectInfo.description"
                        class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"></textarea>
                </div>
            </div>
            <template #footer>
                <div class="flex gap-2">
                    <SecondaryButton @click="isModalOpen = false" :content="'Cancel'"></SecondaryButton>
                    <PrimaryButton @click="handleUpdateProject" :content="'Update'"></PrimaryButton>
                </div>
            </template>
        </ModalGeneric>

        <!-- Confirm Delete Modal -->
        <ModalGeneric v-model="deleteProjectInfo.isModalOpen" title="Confirm Delete">
            Do you want to delete?
            <template #footer>
                <div class="flex gap-2">
                    <SecondaryButton @click="deleteProjectInfo.isModalOpen = false" :content="'Cancel'">
                    </SecondaryButton>
                    <button @click="handleDeleteProject"
                        class="w-full h-9 px-3 bg-red-500 text-white font-medium rounded-lg hover:opacity-80 transition-all flex items-center justify-center cursor-pointer gap-xs">
                        Delete
                    </button>
                </div>
            </template>
        </ModalGeneric>

        <ToastMessage :show="toastOpen" :message="toastInfo.message" :type="toastInfo.type"></ToastMessage>
    </MainContent>
</template>

<script setup>
import { Columns3, Plus, RefreshCw, Settings } from '@lucide/vue';
import MainContent from '../components/MainContent.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import ModalGeneric from '../components/ModalGeneric.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import StatusBadge from '../components/StatusBadge.vue';
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import ProjectSkeleton from '../components/ProjectSkeleton.vue';
import { useProject } from '../store/projectStore.js';
import ToastMessage from '../components/ToastMessage.vue';

const isModalOpen = ref(false)
const isLoading = ref(false)
const toastOpen = ref(false)
const activeMenuId = ref(null)
const deleteProjectInfo = ref({
    isModalOpen: false,
    projectId: null
})

const updateProjectInfo = ref({
    isUpdate: false,
    productId: null,
    name: null,
    description: null,
    status: null,
})

const toastInfo = reactive({
    message: null,
    type: 'success'
})

const projectValue = reactive({
    name: null,
    key: null,
    description: null,
    createSprint: false
})

const projectStore = useProject();

const projects = computed(() => projectStore.projects)

const openModalDialog = () => {
    isModalOpen.value = true
}

onMounted(async () => {
    isLoading.value = true
    await projectStore.fetchProjects()
    isLoading.value = false
})

const handleCreateProject = async () => {
    if (!validateForm()) return
    projectValue.key = projectValue.key.toUpperCase()
    try {
        const res = await projectStore.createProject({ ...projectValue })
        if (res.success) {
            showToastMessage(res.message, 'success')
            projects.value.push(res.data)
            isModalOpen.value = false
        } else {
            showToastMessage(res.message, 'failed')
        }
    } catch (e) {
        const errorResponseData = e.response?.data
        showToastMessage(errorResponseData?.message || 'Failed to create project', 'failed')
    }
}

const validateForm = () => {
    if (!projectValue.name || projectValue.name.trim().length === 0) {
        showToastMessage('Please input project name', 'failed')
        return false
    }

    if (!projectValue.key || projectValue.key.trim().length === 0) {
        showToastMessage('Please input project key', 'failed')
        return false
    }

    if (projectValue.key.trim().length > 10) {
        showToastMessage('Project key must be less than 10 character', 'failed')
        return false
    }

    return true
}

const clearForm = () => {
    projectValue.name = null
    projectValue.key = null
    projectValue.description = null
    projectValue.createSprint = false
    updateProjectInfo.value.isUpdate = false
    updateProjectInfo.value.productId = null
    updateProjectInfo.value.name = null
    updateProjectInfo.value.description = null
    updateProjectInfo.value.status = null
    deleteProjectInfo.value.isModalOpen = false
    deleteProjectInfo.value.projectId = null
}

const showToastMessage = (message, type = 'success') => {
    toastInfo.message = message
    toastInfo.type = type
    toastOpen.value = true
    setTimeout(() => {
        toastOpen.value = false
        toastInfo.message = ''
    }, 3000)
}

const resolveStatusType = (projectStatus) => {
    switch (projectStatus) {
        case 'ACTIVE':
            return 'ACTIVE'
        case 'COMPLETED':
            return 'COMPLETED'
        case 'ARCHIVED':
            return 'PENDING'
        default:
            return 'PENDING'
    }
}

const toggleMenuSetting = (id) => {
    activeMenuId.value = activeMenuId.value === id ? null : id
}

const openUpdateModal = (project) => {
    updateProjectInfo.value.isUpdate = true
    updateProjectInfo.value.productId = project.id
    updateProjectInfo.value.name = project.name
    updateProjectInfo.value.description = project.description
    updateProjectInfo.value.status = project.status
}

const handleUpdateProject = async () => {
    try {
        const payload = {
            name: updateProjectInfo.value.name,
            description: updateProjectInfo.value.description,
            status: updateProjectInfo.value.status
        }
        const res = await projectStore.updateProject(updateProjectInfo.value.productId, payload)
        if (res.success) {
            showToastMessage(res.message, 'success')
            const index = projects.value.findIndex(project => project.id === updateProjectInfo.value.productId)
            if (index !== -1) {
                projects.value[index] = res.data
            }
            updateProjectInfo.value.isUpdate = false
        } else {
            showToastMessage(res.message, 'failed')
        }
    } catch (e) {
        const errorResponseData = e.response?.data
        showToastMessage(errorResponseData.message, 'failed')
    }
}

const openConfirmDeleteModal = (projectId) => {
    deleteProjectInfo.value.isModalOpen = true
    deleteProjectInfo.value.projectId = projectId
}

const handleDeleteProject = async () => {
    try {
        const res = await projectStore.deleteProject(deleteProjectInfo.value.projectId)
        if (res.success) {
            showToastMessage(res.message, 'success')
            const index = projects.value.findIndex(project => project.id === deleteProjectInfo.value.projectId)
            if (index !== -1) {
                projects.value.splice(index, 1)
            }
            deleteProjectInfo.value.isModalOpen = false
        } else {
            showToastMessage(res.message, 'failed')
        }
    } catch (e) {
        const errorResponseData = e.response?.data
        showToastMessage(errorResponseData.message, 'failed')
    }
}


watch(isModalOpen, (newValue) => {
    if (!newValue) {
        clearForm()
    }
})

watch(updateProjectInfo, (newValue) => {
    if (!newValue.isUpdate) {
        clearForm()
    }
})

watch(deleteProjectInfo, (newValue) => {
    if (!newValue.isModalOpen) {
        clearForm()
    }
})

</script>