<template>
  <StatCard>
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-sm font-semibold text-slate-800">Recent Attendance</h2>
        <p class="text-xs text-slate-400 mt-0.5">Last attendance records</p>
      </div>
      <RouterLink
          to="/attendance"
          class="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        View All →
      </RouterLink>
    </div>

    <div v-if="store.loading" class="space-y-2 animate-pulse">
      <div v-for="i in 4" :key="i" class="h-10 rounded-md bg-slate-100" />
    </div>

    <div v-else-if="records.length === 0" class="py-8 text-center text-sm text-slate-400">
      No attendance records yet
    </div>

    <table v-else class="w-full">
      <thead>
        <tr class="border-b border-slate-100">
          <th class="py-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Date</th>
          <th class="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Check In</th>
          <th class="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Check Out</th>
          <th class="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Worked</th>
          <th class="text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
        </tr>
      </thead>

      <tbody>
        <tr
            v-for="item in records"
            :key="item.id"
            class="border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors"
        >
          <td class="py-3 text-sm text-slate-700">{{ formatDate(item.workDate) }}</td>
          <td class="text-sm text-slate-500">{{ formatTime(item.checkInTime) }}</td>
          <td class="text-sm text-slate-500">{{ formatTime(item.checkOutTime) }}</td>
          <td class="text-sm text-slate-500">{{ item.workedHours }}h</td>
          <td class="text-right">
            <span
                class="px-2 py-0.5 rounded text-xs font-medium border"
                :class="statusClass(item.status)"
            >
              {{ item.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

  </StatCard>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useOverviewStore } from "/src/store/overview.js";
import StatCard from "../StatCard.vue";

const store = useOverviewStore();

const records = computed(() => {

  return [...store.todayAttendance]
      .sort((a, b) => new Date(b.workDate) - new Date(a.workDate))
      .slice(0, 3);

});

function formatDate(date) {

  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

}

function formatTime(time) {

  if (!time) return "--";

  return new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

}

function statusClass(status) {
  switch (status) {
    case "PRESENT":
      return "bg-green-50 text-green-700 border-green-200";
    case "LATE":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "ABSENT":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-500 border-slate-200";
  }
}
</script>