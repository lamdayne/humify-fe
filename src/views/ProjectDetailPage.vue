<template>
    <MainContent>
        <!-- Top Sub-Navigation Header Bar -->
        <div class="bg-slate-100 h-14 px-6 flex items-center justify-between border-b border-slate-200">
            <!-- Left Tabs (Board & Backlog) -->
            <div class="flex items-center gap-1">
                <button @click="activeMainTab = 'board'"
                    class="px-4 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 cursor-pointer"
                    :class="[activeMainTab === 'board' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60']">
                    <Columns3 class="w-4 h-4 text-blue-600" />
                    <span>Board</span>
                </button>

                <button v-if="currentProject?.type === 'SCRUM'" @click="activeMainTab = 'backlog'"
                    class="px-4 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 cursor-pointer"
                    :class="[activeMainTab === 'backlog' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60']">
                    <ListTodo class="w-4 h-4 text-purple-600" />
                    <span>Backlog</span>
                </button>
            </div>

            <!-- Right Share Button -->
            <div class="mr-2">
                <PrimaryButton content="Share" @click="showShareModal">
                    <template #icon>
                        <Plus class="w-4 h-4"></Plus>
                    </template>
                </PrimaryButton>
            </div>
        </div>

        <!-- Main Content View Switcher -->
        <BoardColumnPage v-if="activeMainTab === 'board'" />
        <ProjectBacklogPage v-else-if="activeMainTab === 'backlog'" />

        <!-- Share Modal -->
        <ModalGeneric v-model="openShareModal" width="700px">
            <div class="flex gap-2">
                <div class="w-2/3">
                    <label for="inviteEmail"
                        class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Email
                    </label>
                    <input type="email" id="inviteEmail" placeholder="Email address" v-model="emailInvite"
                        class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                </div>
                <div class="flex w-1/3 gap-2">
                    <div class="w-2/3">
                        <label for="inviteRole"
                            class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Role
                        </label>
                        <select id="inviteRole" v-model="selectedRoleEmailInvite"
                            class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                            <option v-for="pr in projectRoles" :value="pr.id" :key="pr.id">{{ pr.name }}</option>
                        </select>
                    </div>
                    <div class="w-1/3 mt-6">
                        <button @click="inviteWithEmail"
                            class="p-3 bg-slate-200 rounded-lg cursor-pointer hover:bg-slate-300 transition">Share</button>
                    </div>
                </div>
            </div>

            <div class="flex mt-4 gap-3">
                <span class="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg">
                    <Link2 class="w-5 h-5"></Link2>
                </span>
                <div class="flex justify-between w-full">
                    <div class="flex flex-col">
                        <span class="font-medium text-[16px]">Share this board with the link</span>
                        <div class="flex gap-3">
                            <span @click="createPublicLink" class="underline text-blue-800 cursor-pointer">
                                Create link
                            </span>
                            <span @click="copyLinkInvite" v-if="publicLinkInvite"
                                class="underline text-blue-800 cursor-pointer">Copy link</span>
                        </div>
                    </div>
                    <div class="">
                        <select id="linkRole" v-model="selectedRoleLinkInvite"
                            class="w-full border border-slate-200 hover:border-slate-300 rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light">
                            <option v-for="pr in projectRoles" :value="pr.id" :key="pr.id">{{ pr.name }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="border-b border-slate-200 mt-5">
                <div class="flex items-center gap-6">
                    <button class="relative flex items-center gap-2 pb-3 text-sm font-medium cursor-pointer"
                        :class="[isTabActive === 'members' ? 'border-b-2 border-slate-700' : '']"
                        @click="isTabActive = 'members'">
                        <span class="font-medium text-[16px]">Board members</span>
                    </button>
                    <button class="relative flex items-center gap-2 pb-3 text-sm font-medium cursor-pointer"
                        :class="[isTabActive === 'requests' ? 'border-b-2 border-slate-700' : '']"
                        @click="isTabActive = 'requests'">
                        <span class="font-medium text-[16px]">Join requests</span>
                    </button>
                </div>
            </div>

            <div v-if="isTabActive === 'members'">
                <div class="flex mt-4 justify-between px-4 items-center" v-for="member in memberOfProject"
                    :key="member.id">
                    <div class="flex gap-5 items-center">
                        <img src="https://res.cloudinary.com/dmzsletu0/image/upload/v1782044934/453178253_471506465671661_2781666950760530985_n_wqklyb.png"
                            alt="" class="rounded-full w-12 h-12">
                        <div class="flex flex-col">
                            <span class="font-medium">{{ member.user.email }}</span>
                            <span class="text-xs text-slate-500">{{ member.role.name }}</span>
                        </div>
                    </div>
                    <div>
                        <select v-model="member.role.name" @change="updateRoleMember(member)"
                            class="border border-slate-200 hover:border-slate-300 rounded-md p-2 text-sm outline-none">
                            <option value="MANAGER">Manager</option>
                            <option value="MEMBER">Member</option>
                            <option value="VIEWER">Viewer</option>
                        </select>
                    </div>
                </div>
            </div>

            <div v-else>
                <div class="flex mt-4 justify-between px-4 items-center" v-for="memberPending in memberPendingApprove"
                    :key="memberPending.id">
                    <div class="flex gap-5 items-center">
                        <img src="https://res.cloudinary.com/dmzsletu0/image/upload/v1782044934/453178253_471506465671661_2781666950760530985_n_wqklyb.png"
                            alt="" class="rounded-full w-12 h-12">
                        <div class="flex flex-col">
                            <span class="font-medium">{{ memberPending.user.email }}</span>
                            <span class="text-xs text-slate-500">{{ memberPending.role.name }}</span>
                        </div>
                    </div>
                    <div>
                        <PrimaryButton @click="approveRequest(memberPending)" content="Approve"></PrimaryButton>
                    </div>
                </div>
            </div>
        </ModalGeneric>

        <!-- Toast Message -->
        <ToastMessage :show="toastOpen" :message="toastInfo.message" :type="toastInfo.type"></ToastMessage>
    </MainContent>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Columns3, ListTodo, Plus, Link2 } from '@lucide/vue';
import MainContent from '../components/MainContent.vue';
import ModalGeneric from '../components/ModalGeneric.vue';
import PrimaryButton from '../components/PrimaryButton.vue';
import SecondaryButton from '../components/SecondaryButton.vue';
import ToastMessage from '../components/ToastMessage.vue';
import BoardColumnPage from './BoardColumnPage.vue';
import ProjectBacklogPage from './ProjectBacklogPage.vue';
import { useProject } from '../store/projectStore.js';
import { useSprintStore } from '../store/sprintStore.js';

const route = useRoute();
const projectStore = useProject();
const sprintStore = useSprintStore();

const activeMainTab = ref('board');
const currentProject = ref(null);
const openShareModal = ref(false);
const isTabActive = ref('members');
const memberPendingApprove = ref([]);
const memberOfProject = ref([]);

const selectedRoleLinkInvite = ref(null);
const publicLinkInvite = ref(null);
const selectedRoleEmailInvite = ref(null);
const emailInvite = ref(null);

const projectRoles = computed(() => projectStore.projectRoles);

const toastOpen = ref(false);
const toastInfo = reactive({
    message: null,
    type: 'success'
});

const showToastMessage = (message, type = 'success') => {
    toastInfo.message = message;
    toastInfo.type = type;
    toastOpen.value = true;
    setTimeout(() => {
        toastOpen.value = false;
        toastInfo.message = '';
    }, 3000);
};

const showShareModal = () => {
    openShareModal.value = true;
};

const loadProjectData = async () => {
    const projectId = route.params?.id;
    if (!projectId) return;

    const projectRes = await projectStore.getProjectById(projectId);
    currentProject.value = projectRes;

    if (currentProject.value?.type === 'SCRUM') {
        await sprintStore.fetchSprints(projectId);
        const hasActiveSprint = sprintStore.sprints.some(s => s.status === 'ACTIVE');
        activeMainTab.value = hasActiveSprint ? 'board' : 'backlog';
    }

    await projectStore.getAllProjectRoles();
    const memberRes = await projectStore.getAllMemberByProjectId(projectId);
    const members = memberRes?.data?.items || [];
    memberOfProject.value = members.filter(member => member.status === 'ACTIVE');
    memberPendingApprove.value = members.filter(member => member.status !== 'ACTIVE');
};

onMounted(async () => {
    await loadProjectData();
});

const updateRoleMember = async (member) => {
    try {
        const payload = {
            code: member.role.name
        };
        const projectId = route.params?.id;
        await projectStore.updateProjectMemberRole(projectId, member.user.id, payload);
        showToastMessage('Update member role successfully');
    } catch (e) {
        console.log(e);
        showToastMessage('Update member role failed', 'failed');
    }
};

const approveRequest = async (member) => {
    try {
        const projectId = route.params?.id;
        await projectStore.approveRequest(projectId, member.user.id);
        const index = memberPendingApprove.value.findIndex(m => m.user.id === member.user.id);
        if (index !== -1) {
            memberPendingApprove.value.splice(index, 1);
        }
        member.status = 'ACTIVE';
        memberOfProject.value.push(member);
        showToastMessage('Approve request successfully');
    } catch (e) {
        console.log(e);
        showToastMessage('Approve request failed', 'failed');
    }
};

const createPublicLink = async () => {
    try {
        const projectId = route.params?.id;
        const payload = {
            email: null,
            projectRoleId: selectedRoleLinkInvite.value
        };
        const res = await projectStore.createInviteMember(projectId, payload);
        const data = res.data;
        if (data.success) {
            showToastMessage(data.message || 'Create link invite success');
            publicLinkInvite.value = data?.data.inviteLink;
        } else {
            showToastMessage('Create link invite failed', 'failed');
        }
    } catch (e) {
        console.log(e);
        const resDataError = e.response?.data;
        showToastMessage(resDataError?.message || 'Create link invite failed', 'failed');
    }
};

const inviteWithEmail = async () => {
    try {
        if (!emailInvite.value || emailInvite.value.trim().length === 0) {
            showToastMessage('Please input email', 'failed');
            return;
        }

        if (!selectedRoleEmailInvite.value) {
            showToastMessage('Please select role member', 'failed');
            return;
        }
        const projectId = route.params?.id;
        const payload = {
            email: emailInvite.value,
            projectRoleId: selectedRoleEmailInvite.value
        };
        const res = await projectStore.createInviteMember(projectId, payload);
        const data = res.data;
        if (data.success) {
            showToastMessage(data.message || 'Create invite success');
            emailInvite.value = null;
        } else {
            showToastMessage('Create invite failed', 'failed');
        }
    } catch (e) {
        console.log(e);
        showToastMessage('Create invite failed', 'failed');
    }
};

const copyLinkInvite = () => {
    if (publicLinkInvite.value) {
        navigator.clipboard.writeText(publicLinkInvite.value);
        showToastMessage('Copy link invite success');
    }
};
</script>