<template>
    <button @click="$emit('click')"
        class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-md transition-colors duration-150 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
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