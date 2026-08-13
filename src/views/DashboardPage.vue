<template>
  <MainContent>
    <div class="space-y-5 p-6">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-900">Overview</h1>
          <p class="text-xs text-slate-400 mt-0.5">{{ currentTime }}</p>
        </div>
      </div>

      <!-- Dashboard cards row 1 -->
      <div class="grid grid-cols-12 gap-5">

        <div class="col-span-12 lg:col-span-4">
          <TodayCard />
        </div>

        <div class="col-span-12 lg:col-span-4">
          <div class="grid grid-cols-2 gap-4">
            <AverageHoursCard />
            <AverageCheckInCard />
            <OnTimeCard />
            <AverageCheckOutCard />
          </div>
        </div>

        <div class="col-span-12 lg:col-span-4">
          <AttendanceSummaryCard />
        </div>

      </div>

      <!-- Dashboard cards row 2 -->
      <div class="grid grid-cols-12 gap-5">

        <div class="col-span-12 lg:col-span-8">
          <RecentAttendanceTable />
        </div>

        <div class="col-span-12 lg:col-span-4">
          <QuickActions />
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