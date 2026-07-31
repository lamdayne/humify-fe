<template>
  <StatCard>

    <h2 class="text-lg font-semibold mb-5">
      Quick Actions
    </h2>

    <div class="space-y-3">

      <RouterLink
          to="/attendance"
          class="block rounded-lg  border border-slate-300 p-4 hover:bg-slate-50 transition "
      >

        📅 Attendance History
      </RouterLink>

      <RouterLink
          to="/pay-roll"
          class="block rounded-lg border border-slate-300 p-4 hover:bg-slate-50 transition"
      >
        💰 My Payslips
      </RouterLink>

      <RouterLink
          to="/profile"
          class="block rounded-lg border border-slate-300 p-4 hover:bg-slate-50 transition"
      >
        👤 My Profile
      </RouterLink>

    </div>

  </StatCard>
</template>

<script setup>
import StatCard from "../StatCard.vue";
import { RouterLink } from "vue-router";
</script>