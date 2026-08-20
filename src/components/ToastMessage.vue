<template>
    <Transition name="slide-fade">
        <div v-if="show" :class="[
            type === 'success'
                ? 'border-l-[3px] border-green-500'
                : 'border-l-[3px] border-red-500',
            'fixed top-5 right-5 z-9999 flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-[0_4px_12px_rgba(15,23,42,0.12)] border border-slate-200'
        ]">
            <CircleCheckBig v-if="type === 'success'" class="w-4 h-4 text-green-500 shrink-0"></CircleCheckBig>
            <CircleX v-else class="w-4 h-4 text-red-500 shrink-0"></CircleX>
            <span class="text-sm font-medium text-slate-800">{{ message }}</span>
        </div>
    </Transition>
</template>

<script setup>
import { CircleCheckBig, CircleX } from '@lucide/vue';



defineProps({
    type: {
        type: String,
        default: 'success'
    },
    message: {
        type: String,
        default: 'Failed'
    },
    show: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
/* Hiệu ứng trượt và mờ mượt mà của Toast */
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}
</style>