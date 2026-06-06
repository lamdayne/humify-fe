<template>
    <Teleport to="body">
        <div v-if="modelValue" class="fixed inset-0 z-999 grid place-items-center p-4 overflow-y-auto">

            <div class="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm transition-opacity duration-300"
                @click="closeOnBackdrop && $emit('update:modelValue', false)" />

            <div class="bg-white border border-slate-200 rounded-xl relative z-1000 overflow-hidden shadow-xl flex flex-col my-8"
                :style="{ width: '100%', maxWidth: width, minWidth: '280px' }">
                <!-- Header -->
                <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h2 class="text-[17px] font-semibold text-slate-900 tracking-tight">{{ title }}</h2>
                    <button @click="$emit('update:modelValue', false)"
                        class="text-slate-400 hover:text-black p-1 rounded-md transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
                            stroke="currentColor" class="w-4.5 h-4.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Body -->
                <div class="p-6">
                    <slot />
                </div>

                <!-- Footer -->
                <div v-if="$slots.footer"
                    class="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
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