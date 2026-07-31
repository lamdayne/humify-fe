<template>
  <StatCard>
    <template v-if="store.loading">

      <div class="animate-pulse space-y-5">

        <div class="h-6 w-28 rounded bg-slate-200"/>

        <div class="grid grid-cols-2 gap-4">

          <div class="h-14 rounded bg-slate-100"/>

          <div class="h-14 rounded bg-slate-100"/>

          <div class="h-14 rounded bg-slate-100"/>

          <div class="h-14 rounded bg-slate-100"/>

        </div>

        <div class="h-11 rounded-xl bg-slate-200"/>

      </div>

    </template>
    <template v-else>
    <div class="flex flex-col">

      <!-- Header -->
      <div class="flex items-start justify-between border-b border-slate-200 pb-2">
        <div>
          <h2 class="text-lg font-bold text-slate-900">
            Today
          </h2>

          <p class="text-sm text-slate-400 mt-1">
            {{ todayDate }}
          </p>
        </div>

        <span
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="statusClass">

        {{ statusText }}

    </span>
      </div>

      <!-- Content -->
      <div class="flex-1 py-4 space-y-3">

        <div class="grid grid-cols-2 gap-x-8 gap-y-4 py-1">

          <div>
            <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Check In
            </p>

            <p class="mt-1 text-lg font-bold text-slate-900">
              {{ checkIn }}
            </p>
          </div>

          <div>
            <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Check Out
            </p>

            <p class="mt-1 text-lg font-bold text-slate-900">
              {{ checkOut }}
            </p>
          </div>

          <div>
            <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Worked
            </p>

            <p class="mt-1 text-lg font-bold text-slate-900">
              {{ workedHours }}
            </p>
          </div>

          <div>
            <p class="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Late
            </p>

            <p class="mt-1 text-lg font-bold text-slate-900">
              {{ lateMinutes }}
            </p>
          </div>

        </div>

      </div>

      <!-- Button -->
      <button
          @click="handleSwipe"
          :disabled="disabled || store.swipeLoading"
          class="w-full rounded-xl
           bg-slate-900
           text-white
           py-3
           font-medium
           transition
           hover:bg-slate-800
           disabled:opacity-50">

    <span v-if="store.swipeLoading">

        Processing...

    </span>

        <span v-else>

        {{ buttonText }}

    </span>

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

      return "bg-green-100 text-green-700";

    case "LATE":

      return "bg-yellow-100 text-yellow-700";

    case "ABSENT":

      return "bg-red-100 text-red-700";

    case "LEAVE":

      return "bg-blue-100 text-blue-700";

    default:

      return "bg-slate-100 text-slate-600";

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