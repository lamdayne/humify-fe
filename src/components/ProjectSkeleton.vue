<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
        <div v-for="i in 9" :key="i"
            class="bg-slate-200 w-full space-y-3 h-35 rounded-xl border border-slate-200 shadow-xs p-4 animate-pulse">
            <div class="flex items-center justify-between">
                <span class="p-3 w-40 bg-slate-300 rounded-2xl animate-pulse"></span>
                <span class="p-3 w-20 bg-slate-300 rounded-2xl animate-pulse"></span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="p-3 w-full bg-slate-300 rounded-2xl animate-pulse"></span>
                <span class="p-3 w-[50%] bg-slate-300 rounded-2xl animate-pulse"></span>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>