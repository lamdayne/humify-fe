<template>
  <apexchart
      type="donut"
      height="250"
      :options="chartOptions"
      :series="series"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  summary: Object
});

const series = computed(() => [
  props.summary?.totalPresentDays ?? 0,
  props.summary?.totalLateCount ?? 0,
  props.summary?.totalAbsentDays ?? 0,
  props.summary?.totalLeaveDays ?? 0
]);

const total = computed(() =>
    series.value.reduce((a, b) => a + b, 0)
);

const chartOptions = computed(() => ({
  chart: {
    toolbar: {
      show: false
    }
  },

  labels: [
    "Present",
    "Late",
    "Absent",
    "Leave"
  ],

  colors: [
    "#10B981",
    "#FBBF24",
    "#EF4444",
    "#3B82F6"
  ],

  legend: {
    show: false
  },

  stroke: {
    width: 0
  },

  dataLabels: {
    enabled: false
  },

  plotOptions: {
    pie: {
      donut: {
        size: "75%",

        labels: {

          show: true,

          total: {

            show: true,

            label: "Days",

            formatter: () => total.value
          }
        }
      }
    }
  }
}));
</script>