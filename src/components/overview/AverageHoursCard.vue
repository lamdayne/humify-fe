<template>
  <StatCard>

    <div
        v-if="store.loading"
        class="animate-pulse">

      <div class="h-8 w-8 rounded bg-gray-200"/>

      <div class="mt-4 h-4 bg-gray-200 rounded"/>

      <div class="mt-2 h-8 bg-gray-200 rounded"/>

    </div>

    <div class="space-y-4">

      <span class="text-blue-500 text-xl">🕒</span>

      <div>
        <p class="text-gray-500 text-sm">
          Average Hours
        </p>

        <h2 class="text-3xl font-bold text-slate-800">
          {{ averageHours }}
        </h2>
      </div>

    </div>
  </StatCard>
</template>

<script setup>
import { computed } from "vue";

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