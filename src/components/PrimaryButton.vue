<template>
    <button @click="$emit('click')"
        class="w-full h-9 px-3 bg-black text-white font-medium rounded-lg hover:opacity-80 transition-all flex items-center justify-center cursor-pointer gap-xs">
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