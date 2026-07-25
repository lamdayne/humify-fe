<template>
    <div draggable="true" @dragover.prevent.stop
        @dragstart.stop="$emit('dragstart')" @drop.stop="$emit('drop')"
        @click="$emit('click')"
        @contextmenu.prevent.stop="$emit('contextmenu', $event)"
        class="group bg-white p-3 rounded-lg shadow-sm cursor-pointer border-2 border-transparent hover:border-slate-400 flex flex-col gap-2">
        
        <!-- Card Title -->
        <div class="flex-1 font-medium text-slate-800 text-sm">
            {{ task.title }}
        </div>

        <!-- Footer Info (Task Key & Assignee Avatar if assigned) -->
        <div v-if="task.taskKey || task.assignee" class="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <!-- Task Key -->
            <span v-if="task.taskKey" class="text-[11px] font-mono text-slate-500 font-medium">
                {{ task.taskKey }}
            </span>

            <!-- Assignee Avatar (Only displayed if assigned) -->
            <div v-if="task.assignee" class="shrink-0 ml-auto"
                :title="task.assignee.fullName || task.assignee.email">
                <img src="https://res.cloudinary.com/dmzsletu0/image/upload/v1782044934/453178253_471506465671661_2781666950760530985_n_wqklyb.png"
                    alt="" class="w-5 h-5 rounded-full border border-slate-200">
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    task: {
        type: Object,
        required: true
    }
})

defineEmits(['click', 'dragstart', 'drop', 'contextmenu'])
</script>
