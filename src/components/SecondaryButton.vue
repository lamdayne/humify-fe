<template>
    <button @click="$emit('click')"
        class="flex items-center justify-center w-full h-9 px-3 border border-primary bg-white text-primary font-medium rounded-lg transition-colors cursor-pointer gap-xs">
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