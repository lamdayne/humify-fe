<template>
    <AsideMenu :open="sidebarOpen" @close="sidebarOpen = false"></AsideMenu>
    <TopNavBar @toggle-sidebar="sidebarOpen = !sidebarOpen"></TopNavBar>
    <main class="lg:ml-60 pt-14 min-h-screen bg-slate-100">
        <slot></slot>
    </main>
</template>

<script setup>
import { ref } from 'vue';
import AsideMenu from './AsideMenu.vue';
import TopNavBar from './TopNavBar.vue';

const sidebarOpen = ref(false)
</script>