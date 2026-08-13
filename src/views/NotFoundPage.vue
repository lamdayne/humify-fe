<template>
  <div class="min-h-screen w-full bg-white text-slate-900 font-sans antialiased flex flex-col justify-between selection:bg-blue-500 selection:text-white">
    <!-- Header: Centered Humify brand link -->
    <header class="w-full px-8 py-6 flex items-center justify-center">
      <router-link to="/" class="text-xl font-bold tracking-tight text-slate-900 hover:text-blue-600 transition-colors">
        Humify
      </router-link>
    </header>

    <!-- Main Content: Centered Layout with Horizontal Text -->
    <main class="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
      <div class="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
        <!-- Big 404 in dark navy -->
        <h1 class="text-8xl sm:text-9xl md:text-[140px] font-black text-slate-900 tracking-tight leading-none mb-6 select-none">
          404
        </h1>

        <!-- LOOKS LIKE YOU'RE LOST (Forced horizontal text) -->
        <h2 class="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-wider uppercase mb-3 whitespace-nowrap">
          LOOKS LIKE YOU'RE LOST
        </h2>

        <!-- The page you are looking for not available! (Forced horizontal text) -->
        <p class="text-xs sm:text-sm md:text-base text-slate-500 font-light mb-10 whitespace-nowrap">
          The page you are looking for not available!
        </p>

        <!-- GO TO HOME -> / GO TO DASHBOARD -> -->
        <router-link
          :to="authStore.isAuthenticated ? '/dashboard' : '/'"
          class="inline-flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-600 tracking-widest uppercase transition-colors group cursor-pointer py-2 px-6 rounded-lg hover:bg-slate-50 whitespace-nowrap"
        >
          <span>{{ authStore.isAuthenticated ? 'GO TO DASHBOARD' : 'GO TO HOME' }}</span>
          <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
        </router-link>
      </div>
    </main>

    <!-- Footer Space -->
    <footer class="w-full py-4"></footer>
  </div>
</template>

<script setup>
import { ArrowRight } from '@lucide/vue';
import { useAuthStore } from '../store/authStore';

const authStore = useAuthStore();
</script>
