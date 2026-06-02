<template>
    <AsideMenu></AsideMenu>
    <TopNavBar></TopNavBar>
    <main class="ml-60 pt-14 min-h-screen p-3xl">
        <slot></slot>
    </main>
</template>

<script setup>
import AsideMenu from './AsideMenu.vue';
import TopNavBar from './TopNavBar.vue';


</script>