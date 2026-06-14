<template>
    <Transition name="slide-fade">
        <div v-if="show" :class="[type === 'success' ? 'bg-black text-white' : 'bg-red-500 text-white',
            'fixed top-6 right-6 z-9999 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border border-slate-300'
        ]">
            <CircleCheckBig v-if="type === 'success'" class="w-5 h-5 text-emerald-400"></CircleCheckBig>
            <CircleX v-else class="w-5 h-5 text-red-200"></CircleX>
            <span class="text-sm font-medium">{{ message }}</span>
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