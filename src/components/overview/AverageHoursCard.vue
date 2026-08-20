<template>
  <StatCard>

    <div v-if="store.loading" class="animate-pulse space-y-2">
      <div class="h-3 w-3 rounded bg-slate-200"/>
      <div class="h-3 bg-slate-100 rounded"/>
      <div class="h-7 bg-slate-200 rounded"/>
    </div>

    <div v-else class="space-y-2">
      <Clock class="w-4 h-4 text-blue-400" />
      <div>
        <p class="text-xs text-slate-400 font-medium">Average Hours</p>
        <h2 class="text-2xl font-semibold text-slate-800 mt-0.5">{{ averageHours }}</h2>
      </div>
    </div>

  </StatCard>
</template>

<script setup>
import { computed } from "vue";
import { Clock } from '@lucide/vue';
import { useOverviewStore } from "/src/store/overview.js";
import StatCard from "../StatCard.vue";

const store = useOverviewStore();

const averageHours = computed(() => {

  const summary = store.summary?.[0];

  if (!summary) return "--";

  const totalHours = Number(summary.totalWorkedHours ?? 0);
  const presentDays = Number(summary.totalPresentDays ?? 0);

  if (!presentDays) return "--";

  const avg = totalHours / presentDays;

  const hour = Math.floor(avg);
  const minute = Math.round((avg - hour) * 60);

  return `${hour}h ${minute}m`;

});
</script>