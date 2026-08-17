<template>
    <Teleport to="body">
        <div v-if="modelValue" class="fixed inset-0 z-999 grid place-items-center p-4 overflow-y-auto">

            <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] transition-opacity duration-200"
                @click="closeOnBackdrop && $emit('update:modelValue', false)" />

            <div class="bg-white border border-slate-200 rounded-lg relative z-1000 overflow-visible shadow-[0_8px_24px_rgba(15,23,42,0.12)] flex flex-col my-8"
                :style="{ width: '100%', maxWidth: width, minWidth: '280px' }">
                <!-- Header -->
                <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 class="text-[15px] font-semibold text-slate-900">{{ title }}</h2>
                    <button @click="$emit('update:modelValue', false)"
                        class="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors hover:bg-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
                            stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-5">
                    <slot />
                </div>

                <!-- Footer -->
                <div v-if="$slots.footer"
                    class="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
                    <slot name="footer" />
                </div>
            </div>

        </div>
    </Teleport>
</template>

<script setup>
defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: '520px'
    },
    closeOnBackdrop: {
        type: Boolean,
        default: true
    }
})

defineEmits(['update:modelValue'])
</script>