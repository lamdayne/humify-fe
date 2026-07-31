<template>
  <MainContent>
    <div class="space-y-6 p-6">

      <!-- Header -->
      <div class="flex justify-between items-start">

        <div>
          <h1 class="text-3xl font-bold text-slate-800">
            Good Morning, {{ userName }}
          </h1>

          <p class="text-gray-500 mt-2">
            Welcome back!
          </p>

        </div>

        <div
            class="bg-white rounded-xl shadow border border-slate-300 px-6 py-4 text-right">

          <p class="text-gray-500 text-sm">
            Current Time
          </p>

          <p class="font-semibold text-xl">
            {{ currentTime }}
          </p>

        </div>

      </div>

      <!-- Dashboard -->

      <div class="grid grid-cols-12 gap-6">

        <div class="col-span-4 ">
          <TodayCard class="bg-slate-50/70 border-b border-slate-200" />
        </div>

        <div class="col-span-4">

          <div class="grid grid-cols-2 gap-4">

            <AverageHoursCard class="bg-slate-50/70 border-b border-slate-200"/>

            <AverageCheckInCard class="bg-slate-50/70 border-b border-slate-200"/>

            <OnTimeCard class="bg-slate-50/70 border-b border-slate-200"/>

            <AverageCheckOutCard class="bg-slate-50/70 border-b border-slate-200"/>

          </div>

        </div>

        <div class="col-span-4">

          <AttendanceSummaryCard class="bg-slate-50/70 border-b border-slate-200"/>

        </div>

      </div>
      <div class="grid grid-cols-12 gap-6 mt-6">

        <div class="col-span-8">
          <RecentAttendanceTable class="bg-slate-50/70 border-b border-slate-200"/>
        </div>

        <div class="col-span-4">
          <QuickActions class="bg-slate-50/70 border-b border-slate-200" />
        </div>

      </div>

    </div>
  </MainContent>
</template>

<script setup>
import {ref,onMounted,onUnmounted} from "vue";
import { useOverviewStore } from "../store/overview.js";
import MainContent from '../components/MainContent.vue';
import TodayCard from '../components/overview/TodayCard.vue';
import AverageHoursCard from "../components/overview/AverageHoursCard.vue";
import AverageCheckInCard from "../components/overview/AverageCheckInCard.vue";
import OnTimeCard from "../components/overview/OnTimeCard.vue";
import AverageCheckOutCard from "../components/overview/AverageCheckOutCard.vue";
import AttendanceSummaryCard from "../components/overview/AttendanceSummaryCard.vue";
import RecentAttendanceTable from "../components/overview/RecentAttendanceTable.vue";
import QuickActions from "../components/overview/QuickActions.vue";

const userName = ref("");

const currentTime = ref("");

let timer;

const overviewStore = useOverviewStore();

const today = new Date();

const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];

const currentDay = today.toISOString().split("T")[0];

onMounted(() => {
  overviewStore.fetchOverview(firstDay, currentDay);
});
const updateClock = () => {

  currentTime.value = new Date().toLocaleString("en-GB",{
    day:"2-digit",
    month:"short",
    year:"numeric",
    hour:"2-digit",
    minute:"2-digit"
  })

}


onMounted(()=>{

  updateClock();

  timer=setInterval(updateClock,1000);

})

onUnmounted(()=>{

  clearInterval(timer)

})
</script>