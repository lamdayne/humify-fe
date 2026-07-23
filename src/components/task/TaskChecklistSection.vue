<template>
    <div class="flex flex-col ml-5 gap-3 mt-4 pr-1">
        <div class="flex justify-between items-center">
            <div class="flex gap-3 items-center">
                <CircleCheckBig class="w-5 h-5 text-slate-700"></CircleCheckBig>
                <span class="font-medium text-[17px]">Checklist</span>
            </div>
        </div>

        <!-- Progress Bar -->
        <div v-if="subtasks && subtasks.length > 0" class="flex items-center gap-3">
            <span class="text-xs text-slate-500 min-w-8">
                {{ progressPercent }}%
            </span>
            <div class="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-blue-600 h-full transition-all duration-300"
                    :style="{ width: `${progressPercent}%` }">
                </div>
            </div>
        </div>

        <!-- Subtasks List -->
        <div class="flex flex-col gap-1.5">
            <div v-for="subtask in subtasks" :key="subtask.id"
                class="flex items-center justify-between p-2 hover:bg-slate-100 rounded-lg group">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                    <input type="checkbox" :checked="!!subtask.completedAt"
                        @change="$emit('toggle-check', subtask)"
                        class="w-4 h-4 cursor-pointer accent-slate-800">
                    <span class="text-sm text-slate-800"
                        :class="[subtask.completedAt ? 'line-through text-slate-400' : '']">
                        {{ subtask.title }}
                    </span>
                    <span v-if="subtask.taskKey" class="text-xs text-slate-400 font-mono">
                        {{ subtask.taskKey }}
                    </span>
                </div>
                <button @click="$emit('delete-item', subtask.id)"
                    class="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 cursor-pointer transition">
                    <X class="w-4 h-4"></X>
                </button>
            </div>
        </div>

        <!-- Continuous Add Subtask Input -->
        <div class="flex gap-2 mt-1">
            <input type="text" v-model="newItemTitle" @keydown.enter="onAdd"
                placeholder="Add an item..."
                class="flex-1 border border-slate-300 p-2 rounded-lg text-sm outline-none focus:border-slate-500">
            <button @click="onAdd"
                class="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-800 transition cursor-pointer">
                Add
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { CircleCheckBig, X } from '@lucide/vue';

const props = defineProps({
    subtasks: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['add-item', 'toggle-check', 'delete-item'])

const newItemTitle = ref('')

const completedCount = computed(() => {
    if (!props.subtasks) return 0
    return props.subtasks.filter(s => !!s.completedAt).length
})

const progressPercent = computed(() => {
    if (!props.subtasks || props.subtasks.length === 0) return 0
    return Math.round((completedCount.value / props.subtasks.length) * 100)
})

const onAdd = () => {
    if (!newItemTitle.value.trim()) return
    emit('add-item', newItemTitle.value.trim())
    newItemTitle.value = ''
}
</script>
