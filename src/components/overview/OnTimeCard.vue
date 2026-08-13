<template>

  <StatCard>
    <div v-if="store.loading" class="animate-pulse space-y-2">
      <div class="h-3 w-3 rounded bg-slate-200"/>
      <div class="h-3 bg-slate-100 rounded"/>
      <div class="h-7 bg-slate-200 rounded"/>
    </div>

    <div v-else class="space-y-2">
      <Timer class="w-4 h-4 text-green-400" />
      <div>
        <p class="text-xs text-slate-400 font-medium">On-time Arrival</p>
        <h2 class="text-2xl font-semibold text-slate-800 mt-0.5">{{ onTime }}</h2>
      </div>
    </div>
  </StatCard>

</template>

<script setup>
import { computed } from "vue";
import { Timer } from '@lucide/vue';
import { useOverviewStore } from "/src/store/overview.js";
import StatCard from "../StatCard.vue";

const store = useOverviewStore();

const onTime = computed(() => {

  if (!store.todayAttendance.length) return "--";

  const total = store.todayAttendance.length;

  const onTimeDays = store.todayAttendance.filter(i => (i.lateMinutes ?? 0) === 0).length;

  return `${((onTimeDays / total) * 100).toFixed(1)} %`;

});
</script>