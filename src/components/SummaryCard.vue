<template>
  <div
      class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm
             transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
  >
    <div class="flex items-start justify-between gap-4">

      <!-- CONTENT -->
      <div>
        <p class="text-sm font-medium text-slate-500">
          {{ title }}
        </p>

        <p class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {{ value ?? 0 }}
        </p>
      </div>

      <!-- ICON -->
      <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          :class="iconWrapperClass"
      >

        <!-- ALL REVIEWS -->
        <svg
            v-if="icon === 'all'"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414A1 1 0 0118 8.414V19a2 2 0 01-2 2z"
          />
        </svg>

        <!-- SELF REVIEW -->
        <svg
            v-else-if="icon === 'self'"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>

        <!-- MANAGER REVIEW -->
        <svg
            v-else-if="icon === 'manager'"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5a3 3 0 016 0m-6 8l2 2 4-4"
          />
        </svg>

        <!-- COMPLETED -->
        <svg
            v-else-if="icon === 'completed'"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true
  },

  value: {
    type: [Number, String],
    default: 0
  },

  icon: {
    type: String,
    default: "all"
  }
});

const iconWrapperClass = computed(() => {
  const classes = {
    all: "bg-blue-50 text-blue-600",

    self: "bg-violet-50 text-violet-600",
    pending: "bg-amber-50 text-amber-600",
    manager: "bg-orange-50 text-orange-600",

    completed: "bg-green-50 text-green-600"
  };

  return classes[props.icon] ??
      "bg-slate-100 text-slate-600";
});
</script>