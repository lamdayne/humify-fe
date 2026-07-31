<template>

  <StatCard >

    <div
        v-if="store.loading"
        class="animate-pulse">

      <div class="h-8 w-8 rounded bg-gray-200"/>

      <div class="mt-4 h-4 bg-gray-200 rounded"/>

      <div class="mt-2 h-8 bg-gray-200 rounded"/>

    </div>

    <div class="space-y-4">

      <span class="text-green-500 text-xl">⏰</span>

      <div>

        <p class="text-gray-500 text-sm">

          On-time Arrival

        </p>

        <h2 class="text-3xl font-bold text-green-600">

          {{ onTime }}

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

const onTime = computed(() => {

  if (!store.todayAttendance.length) return "--";

  const total = store.todayAttendance.length;

  const onTimeDays = store.todayAttendance.filter(i => (i.lateMinutes ?? 0) === 0).length;

  return `${((onTimeDays / total) * 100).toFixed(1)} %`;

});
</script>