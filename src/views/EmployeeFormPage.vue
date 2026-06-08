<template>
    <MainContent>
        <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans antialiased text-slate-900 relative">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-start gap-4 mb-8">
                <div>
                    <h1 class="text-3xl font-semibold text-slate-900 tracking-tight mb-1">Add Employee</h1>
                    <nav class="flex items-center gap-1.5 text-xs text-slate-400 font-light">
                        <span class="hover:text-slate-600 cursor-pointer transition-colors">Organization</span>
                        <span>&gt;</span>
                        <span class="text-slate-600 font-normal">Employee</span>
                    </nav>
                </div>
            </div>
        </div>
    </MainContent>
</template>

<script setup>
import MainContent from '../components/MainContent.vue';

</script>