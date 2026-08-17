<template>
  <StatCard>

    <h2 class="text-sm font-semibold text-slate-700 mb-4">
      Quick Actions
    </h2>

    <div class="space-y-1">

      <RouterLink
          to="/attendance"
          class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
      >
        <CalendarDays class="w-4 h-4 text-slate-400 shrink-0" />
        Attendance History
      </RouterLink>

      <RouterLink
          to="/pay-roll"
          class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
      >
        <Banknote class="w-4 h-4 text-slate-400 shrink-0" />
        My Payslips
      </RouterLink>

      <RouterLink
          to="/profile"
          class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
      >
        <CircleUser class="w-4 h-4 text-slate-400 shrink-0" />
        My Profile
      </RouterLink>

    </div>

  </StatCard>
</template>

<script setup>
import StatCard from "../StatCard.vue";
import { RouterLink } from "vue-router";
import { CalendarDays, Banknote, CircleUser } from '@lucide/vue';
</script>