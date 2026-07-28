<template>
  <StatCard>
    <div class="flex items-center justify-between mb-5">
      <div>
        <h2 class="text-lg font-semibold text-slate-800">
          Recent Attendance
        </h2>

        <p class="text-sm text-slate-500">
          Last attendance records
        </p>
      </div>

      <RouterLink
          to="/attendance"
          class="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        View All
      </RouterLink>
    </div>

    <div
        v-if="store.loading"
        class="space-y-3 animate-pulse"
    >
      <div
          v-for="i in 5"
          :key="i"
          class="h-12 rounded-lg bg-gray-200"
      />
    </div>

    <div
        v-else-if="records.length === 0"
        class="text-center py-10 text-gray-400"
    >
      No attendance records
    </div>

    <table
        v-else
        class="w-full"
    >
      <thead>
      <tr class="border-b text-xs uppercase text-slate-400">
        <th class="py-3 text-left">Date</th>
        <th class="text-left">Check In</th>
        <th class="text-left">Check Out</th>
        <th class="text-left">Worked</th>
        <th class="text-right">Status</th>
      </tr>
      </thead>

      <tbody>
      <tr
          v-for="item in records"
          :key="item.id"
          class="border-b last:border-none hover:bg-slate-50"
      >
        <td class="py-4">
          {{ formatDate(item.workDate) }}
        </td>

        <td>
          {{ formatTime(item.checkInTime) }}
        </td>

        <td>
          {{ formatTime(item.checkOutTime) }}
        </td>

        <td>
          {{ item.workedHours }} h
        </td>

        <td class="text-right">
          <span
              class="px-2 py-1 rounded-full text-xs font-semibold"
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
      return "bg-green-100 text-green-700";

    case "LATE":
      return "bg-yellow-100 text-yellow-700";

    case "ABSENT":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-600";

  }

}
</script>