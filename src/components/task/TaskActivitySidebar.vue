<template>
    <div class="col-span-1 border-l-2 border-slate-200 flex px-2 max-h-[65vh] min-h-0 overflow-y-auto scrollbar-none">
        <div class="flex flex-col gap-3 w-full">
            <!-- Tabs -->
            <div class="flex justify-between items-center">
                <div class="flex gap-2 items-center">
                    <MessageSquareText class="w-5"></MessageSquareText>
                    <button @click="activeTab = 'comments'" class="font-medium cursor-pointer"
                        :class="[activeTab === 'comments' ? 'text-slate-900 font-bold underline' : 'text-slate-500']">
                        Comments
                    </button>
                    <span>/</span>
                    <button @click="activeTab = 'activities'" class="font-medium cursor-pointer"
                        :class="[activeTab === 'activities' ? 'text-slate-900 font-bold underline' : 'text-slate-500']">
                        Activity
                    </button>
                </div>
            </div>

            <!-- Comments Tab -->
            <div v-if="activeTab === 'comments'" class="flex flex-col gap-2">
                <div class="flex gap-2">
                    <input type="text" v-model="newComment" @keydown.enter="onAddComment"
                        class="p-1.5 bg-slate-200 rounded-lg flex-1 text-sm outline-none"
                        placeholder="Write a comment...">
                    <button @click="onAddComment"
                        class="bg-slate-900 text-white px-3 py-1 rounded-lg text-xs cursor-pointer">
                        Send
                    </button>
                </div>
                <div class="flex flex-col gap-2 mt-2">
                    <div v-for="comment in comments" :key="comment.id"
                        class="p-2 bg-slate-100 rounded-lg text-xs flex flex-col gap-1">
                        <div class="flex justify-between text-slate-500 text-[11px]">
                            <span class="font-medium text-slate-800">
                                {{ comment.author?.fullName || comment.author?.email }}
                            </span>
                            <span>{{ formatDateRelative(comment.createdAt) }}</span>
                        </div>
                        <div class="text-slate-700">{{ comment.content }}</div>
                    </div>
                    <div v-if="comments.length === 0" class="text-xs text-slate-400 text-center py-3">
                        No comments
                    </div>
                </div>
            </div>

            <!-- Activities Tab -->
            <div v-else class="flex flex-col gap-2">
                <div v-for="act in activities" :key="act.id"
                    class="p-2 bg-slate-100 rounded-lg text-xs flex flex-col gap-0.5 border border-slate-200/50">
                    <div class="flex items-center gap-1">
                        <span class="font-medium text-slate-800">
                            {{ act.user?.fullName || act.user?.email || 'User' }}
                        </span>
                        <span class="text-slate-600 font-normal">{{ formatActivityAction(act.action) }}</span>
                    </div>
                    <div v-if="act.oldValue || act.newValue" class="text-slate-500 text-[11px] flex items-center gap-1">
                        <span v-if="act.oldValue" class="line-through text-slate-400">{{ act.oldValue }}</span>
                        <span v-if="act.oldValue && act.newValue">➔</span>
                        <span v-if="act.newValue" class="font-medium text-slate-700">{{ act.newValue }}</span>
                    </div>
                    <span class="text-slate-400 text-[10px]">{{ formatDateRelative(act.createdAt) }}</span>
                </div>
                <div v-if="activities.length === 0" class="text-xs text-slate-400 text-center py-3">
                    No activity
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { MessageSquareText } from '@lucide/vue';

const props = defineProps({
    comments: {
        type: Array,
        default: () => []
    },
    activities: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['add-comment'])

const activeTab = ref('comments')
const newComment = ref('')

const onAddComment = () => {
    if (!newComment.value.trim()) return
    emit('add-comment', newComment.value.trim())
    newComment.value = ''
}

const formatDateRelative = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatActivityAction = (action) => {
    switch (action) {
        case 'CREATE_TASK':
            return 'created this task'
        case 'UPDATE_STATUS':
            return 'updated status'
        case 'CHANGE_ASSIGNEE':
            return 'changed assignee'
        case 'UPDATE_PRIORITY':
            return 'updated priority'
        case 'CHANGE_SPRINT':
            return 'updated sprint'
        case 'UPDATE_POINTS':
            return 'updated story points'
        case 'ADD_COMMENT':
            return 'added a comment'
        case 'ADD_ATTACHMENT':
            return 'added an attachment'
        default:
            return action ? action.toLowerCase().replace(/_/g, ' ') : 'performed an action'
    }
}
</script>
