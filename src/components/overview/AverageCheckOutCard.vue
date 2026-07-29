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

      <span class="text-orange-500 text-xl">📤</span>

      <div>

        <p class="text-gray-500 text-sm">

          Average Check-out

        </p>

        <h2 class="text-3xl font-bold">

          {{ averageCheckOut }}

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