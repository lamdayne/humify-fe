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
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div v-for="project in projects" :key="project.id"
                    class="bg-slate w-full flex flex-col justify-between h-35 rounded-xl border border-slate-200 shadow-xs p-4 cursor-pointer">
                    <div class="flex items-center justify-between">
                        <h1 class="text-lg">{{ project.name }}</h1>
                        <StatusBadge :type="resolveStatusType(project.status)" :content="project.status"></StatusBadge>
                    </div>
                    <p>
                        {{ project.description?.length > 100 ? project.description?.substring(0, 100) + '...' :
                            project.description
                        }}
                    </p>
                    <div class="relative self-end">
                        <Settings class="w-4 h-4"></Settings>
                        <div v-if="showMenu"
                            class="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                            <button class="w-full text-left px-4 py-2 hover:bg-slate-100">
                                Update
                            </button>
                            <button class="w-full text-left px-4 py-2 hover:bg-slate-100">
                                Setting
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ModalGeneric v-model="isModalOpen" :title="'Create new project'">
            <div class="space-y-6">
                <div class="">
                    <label for="projectName"
                        class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Project Name
                    </label>
                    <input type="text" id="projectName" placeholder="Ecommerce" v-model="projectValue.name"
                        class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                </div>
                <div class="">
                    <label for="projectKey"
                        class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Project Key
                    </label>
                    <input type="text" id="projectKey" placeholder="ECM" v-model="projectValue.key"
                        class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                </div>
                <div>
                    <label for="description"
                        class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                    <textarea id="description" rows="4" placeholder="Briefly describe the key responsibilities..."
                        v-model="projectValue.description"
                        class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"></textarea>
                </div>
            </div>
            <template #footer>
                <div class="flex gap-2">
                    <SecondaryButton @click="isModalOpen = false" :content="'Cancel'"></SecondaryButton>
                    <PrimaryButton @click="handleCreateProject" :content="'Create'"></PrimaryButton>
                </div>
            </template>
        </ModalGeneric>
        <ToastMessage :show="toastOpen" :message="toastInfo.message" :type="toastInfo.type"></ToastMessage>
    </MainContent>
</template>

<script setup>
import { Plus, Settings } from '@lucide/vue';
import MainContent from '../components/MainContent.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import ModalGeneric from '../components/ModalGeneric.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import StatusBadge from '../components/StatusBadge.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import ProjectSkeleton from '../components/ProjectSkeleton.vue';
import { useProject } from '../store/projectStore.js';
import ToastMessage from '../components/ToastMessage.vue';

const isModalOpen = ref(false)
const isLoading = ref(false)
const toastOpen = ref(false)


const toastInfo = reactive({
    message: null,
    type: 'success'
})

const projectValue = reactive({
    name: null,
    key: null,
    description: null
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
        const errorResponse = e.response
        const errorResponseData = e.response?.data
        showToastMessage(errorResponseData.message, 'failed')
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

watch(isModalOpen, (newValue) => {
    if (!newValue) {
        clearForm()
    }
})

</script>