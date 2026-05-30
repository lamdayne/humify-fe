<template>
    <button @click="$emit('click')"
        class="w-full h-9 border border-primary bg-white text-primary font-medium rounded-lg transition-colors cursor-pointer">
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