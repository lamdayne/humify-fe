<template>

  <StatCard>
    <div v-if="store.loading" class="animate-pulse space-y-2">
      <div class="h-3 w-3 rounded bg-slate-200"/>
      <div class="h-3 bg-slate-100 rounded"/>
      <div class="h-7 bg-slate-200 rounded"/>
    </div>

    <div v-else class="space-y-2">
      <LogOut class="w-4 h-4 text-orange-400" />
      <div>
        <p class="text-xs text-slate-400 font-medium">Avg Check-out</p>
        <h2 class="text-2xl font-semibold text-slate-800 mt-0.5">{{ averageCheckOut }}</h2>
      </div>
    </div>
  </StatCard>

</template>

<script setup>
import { computed } from "vue";
import { LogOut } from '@lucide/vue';
import { useOverviewStore } from "/src/store/overview.js";
import StatCard from "../StatCard.vue";

const store = useOverviewStore();

const averageCheckOut = computed(() => {

  const logs = store.attendanceLogs.filter(i => i.logType === "CHECK_OUT");

  if (!logs.length) return "--";

  const total = logs.reduce((sum, item) => {

    const date = new Date(item.timestamp);

    return sum + date.getHours() * 60 + date.getMinutes();

  }, 0);

  const avg = Math.round(total / logs.length);

  const h = String(Math.floor(avg / 60)).padStart(2, "0");
  const m = String(avg % 60).padStart(2, "0");

  return `${h}:${m}`;

});
</script>