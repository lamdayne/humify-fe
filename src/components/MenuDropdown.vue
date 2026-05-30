<template>
    <div class="space-y-base">
        <label class="text-body-sm font-bold block">{{ title }}</label>
        <div class="relative">
            <select
                class="w-full appearance-none border border-outline-variant px-md py-3 rounded focus:border-primary focus:ring-0 outline-none bg-white">
                <slot></slot>
            </select>
            <span class="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown></ChevronDown>
            </span>
        </div>
    </div>
</template>

<script setup>
import { ChevronDown } from '@lucide/vue';

defineProps({
    title: {
        type: String,
        default: "Default Title"
    }
})
</script>