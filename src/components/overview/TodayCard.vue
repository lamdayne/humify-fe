<template>
  <StatCard>
    <template v-if="store.loading">
      <div class="animate-pulse space-y-4">
        <div class="h-4 w-28 rounded bg-slate-200"/>
        <div class="grid grid-cols-2 gap-3">
          <div class="h-12 rounded bg-slate-100"/>
          <div class="h-12 rounded bg-slate-100"/>
          <div class="h-12 rounded bg-slate-100"/>
          <div class="h-12 rounded bg-slate-100"/>
        </div>
        <div class="h-9 rounded-md bg-slate-200"/>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col h-full">

        <!-- Header -->
        <div class="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 class="text-sm font-semibold text-slate-900">Today's Attendance</h2>
            <p class="text-xs text-slate-400 mt-0.5">{{ todayDate }}</p>
          </div>
          <span class="px-2 py-0.5 rounded text-xs font-medium border" :class="statusClass">
            {{ statusText }}
          </span>
        </div>

        <!-- Metrics grid -->
        <div class="grid grid-cols-2 gap-x-6 gap-y-4 mb-5">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Check In</p>
            <p class="mt-1 text-lg font-semibold text-slate-900">{{ checkIn }}</p>
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Check Out</p>
            <p class="mt-1 text-lg font-semibold text-slate-900">{{ checkOut }}</p>
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Worked</p>
            <p class="mt-1 text-lg font-semibold text-slate-900">{{ workedHours }}</p>
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Late</p>
            <p class="mt-1 text-lg font-semibold text-slate-900">{{ lateMinutes }}</p>
          </div>
        </div>

        <!-- Action button -->
        <button
            @click="handleSwipe"
            :disabled="disabled || store.swipeLoading"
            class="w-full py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            :class="disabled ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 hover:bg-blue-700 text-white'">
          <span v-if="store.swipeLoading">Processing…</span>
          <span v-else>{{ buttonText }}</span>
        </button>

      </div>
    </template>
  </StatCard>
</template>

<script setup>
import { computed } from "vue";
import StatCard from "../StatCard.vue";
import { useOverviewStore } from "/src/store/overview.js";

const store = useOverviewStore();

const attendance = computed(() => {

  if (!store.todayAttendance?.length) return null;

  const today = new Date().toISOString().split("T")[0];

  return store.todayAttendance.find(i => i.workDate === today);

});

const todayStatus = computed(() => attendance.value?.status ?? "ABSENT");

const checkIn = computed(() => {

  if (!attendance.value?.checkInTime) return "--";

  return new Date(attendance.value.checkInTime)
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

});

const checkOut = computed(() => {

  if (!attendance.value?.checkOutTime) return "--";

  return new Date(attendance.value.checkOutTime)
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

});

const workedHours = computed(() => {

  return attendance.value?.workedHours
      ? `${attendance.value.workedHours} h`
      : "--";

});

const lateMinutes = computed(() => {

  return attendance.value?.lateMinutes
      ? `${attendance.value.lateMinutes} mins`
      : "0 mins";

});

const statusClass = computed(() => {

  switch (todayStatus.value) {

    case "PRESENT":

      return "bg-green-50 text-green-700 border-green-200";

    case "LATE":

      return "bg-amber-50 text-amber-700 border-amber-200";

    case "ABSENT":

      return "bg-red-50 text-red-700 border-red-200";

    case "LEAVE":

      return "bg-blue-50 text-blue-700 border-blue-200";

    default:

      return "bg-slate-50 text-slate-600 border-slate-200";

  }

});
const statusText = computed(() => {

  return {

    PRESENT: "Present",

    LATE: "Late",

    ABSENT: "Absent",

    LEAVE: "On Leave"

  }[todayStatus.value] || "Unknown";

});
const todayDate = computed(() => {

  return new Date().toLocaleDateString("en-US", {

    weekday: "long",

    month: "short",

    day: "numeric"

  });

});
const buttonText = computed(() => {

  if (!attendance.value) {
    return "Mark Present";
  }

  if (!attendance.value.checkInTime) {
    return "Mark Present";
  }

  if (!attendance.value.checkOutTime) {
    return "Check Out";
  }

  return "Completed";

});
const disabled = computed(() => {

  return buttonText.value === "Completed";

});
const handleSwipe = async () => {

  if (disabled.value) {
    return;
  }

  const logType =
      buttonText.value === "Mark Present"
          ? "CHECK_IN"
          : "CHECK_OUT";

  const success = await store.swipe(logType);

  if (success) {
    toast.success(
        logType === "CHECK_IN"
            ? "Checked in successfully!"
            : "Checked out successfully!"
    );
  }

};
</script>