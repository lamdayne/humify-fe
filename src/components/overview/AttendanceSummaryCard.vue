<template>
  <StatCard>
    <div
        v-if="store.loading"
        class="animate-pulse">

      <div class="h-8 w-8 rounded bg-gray-200"/>
      <div class="mt-4 h-4 bg-gray-200 rounded"/>
      <div class="mt-2 h-8 bg-gray-200 rounded"/>
      <div class="mt-2 h-8 bg-gray-200 rounded"/>
      <div class="mt-2 h-8 bg-gray-200 rounded"/>
      <div class="mt-2 h-8 bg-gray-200 rounded"/>

    </div>

    <div class="grid grid-cols-2 gap-6 items-center">
      <div class="space-y-6">

        <div class="flex justify-between">

          <h2 class="text-2xl font-bold text-slate-900">

            My Attendance

          </h2>

        </div>

        <div class="space-y-4">

          <div class="flex justify-between">

            <div class="flex items-center gap-3">

              <span class="w-3 h-3 rounded-full bg-green-500"/>

              <span>Present Days</span>

            </div>

            <span class="font-semibold">
            {{ summary?.totalPresentDays }}
        </span>

          </div>

          <div class="flex justify-between">

            <div class="flex items-center gap-3">

              <span class="w-3 h-3 rounded-full bg-yellow-400"/>

              <span>Late Count</span>

            </div>

            <span class="font-semibold">
            {{ summary?.totalLateCount }}
        </span>

          </div>

          <div class="flex justify-between">

            <div class="flex items-center gap-3">

              <span class="w-3 h-3 rounded-full bg-red-500"/>

              <span>Absent Days</span>

            </div>

            <span class="font-semibold">
            {{ summary?.totalAbsentDays }}
        </span>

          </div>

          <div class="flex justify-between">

            <div class="flex items-center gap-3">

              <span class="w-3 h-3 rounded-full bg-blue-500"/>

              <span>Leave Days</span>

            </div>

            <span class="font-semibold">
            {{ summary?.totalLeaveDays }}
        </span>

          </div>

        </div>
      </div>
      <!-- Right -->

      <AttendanceChart
          :summary="summary"
      />
    </div>


  </StatCard>
</template>

<script setup>
import {computed} from "vue";
import {useOverviewStore} from "/src/store/overview.js";
import StatCard from "../StatCard.vue";
import AttendanceChart from "./AttendanceChart.vue";

const store = useOverviewStore();

const summary = computed(() => {

  if (!store.summary?.length) return null;

  return store.summary[0];

});
</script>