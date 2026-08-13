<template>
    <button @click="$emit('click')"
        class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-medium rounded-md transition-colors duration-150 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
        <slot name="icon"></slot>
        {{ content }}
    </button>
</template>

<script setup>

defineProps({
    content: {
        type: String,
        default: "Content"
    }
})

defineEmits(['click'])
</script>