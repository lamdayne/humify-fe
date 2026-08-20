<template>
  <StatCard>
    <div v-if="store.loading" class="animate-pulse space-y-3">
      <div class="h-4 w-24 rounded bg-slate-200"/>
      <div class="h-3 bg-slate-100 rounded"/>
      <div class="h-3 bg-slate-100 rounded"/>
      <div class="h-3 bg-slate-100 rounded"/>
      <div class="h-3 bg-slate-100 rounded"/>
    </div>

    <div v-else class="grid grid-cols-2 gap-5 items-center">
      <div class="space-y-4">
        <h2 class="text-sm font-semibold text-slate-800">My Attendance</h2>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-green-500 shrink-0"/>
              <span class="text-xs text-slate-600">Present Days</span>
            </div>
            <span class="text-sm font-semibold text-slate-900">{{ summary?.totalPresentDays }}</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-400 shrink-0"/>
              <span class="text-xs text-slate-600">Late Count</span>
            </div>
            <span class="text-sm font-semibold text-slate-900">{{ summary?.totalLateCount }}</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-red-500 shrink-0"/>
              <span class="text-xs text-slate-600">Absent Days</span>
            </div>
            <span class="text-sm font-semibold text-slate-900">{{ summary?.totalAbsentDays }}</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"/>
              <span class="text-xs text-slate-600">Leave Days</span>
            </div>
            <span class="text-sm font-semibold text-slate-900">{{ summary?.totalLeaveDays }}</span>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <AttendanceChart :summary="summary" />
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