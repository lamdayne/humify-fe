<template>
    <header class="fixed top-0 left-0 right-0 z-50 h-14 border-b border-slate-300 backdrop-blur-lg bg-white/70">
        <div class="w-full mx-auto h-full flex items-center justify-between px-4 md:px-16 lg:px-36">
            <div class="flex items-center gap-xl">
                <router-link to="/" class="text-[20px] font-semibold text-primary tracking-tight">Humify</router-link>
            </div>
            <div class="flex items-center gap-md">
                <PrimaryButton :content="'Get started'"></PrimaryButton>
            </div>
        </div>
    </header>
    <h1>Login</h1>
</template>

<script setup>
import PrimaryButton from '../components/PrimaryButton.vue';

</script>
