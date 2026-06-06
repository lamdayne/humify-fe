<template>
  <MainContent>
    <div class="p-6 md:p-8 max-w-7xl mx-auto font-sans antialiased text-slate-900 relative">


      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between justify-start gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-semibold text-slate-900 tracking-tight mb-1">Positions</h1>
          <nav class="flex items-center gap-1.5 text-xs text-slate-400 font-light">
            <span class="hover:text-slate-600 cursor-pointer transition-colors">Organization</span>
            <span>&gt;</span>
            <span class="text-slate-600 font-normal">Positions</span>
          </nav>
        </div>

        <div class="w-auto min-w-[120px]">
          <PrimaryButton :content="'+ Add Position'" @click="openModal" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Total
            Positions</span>
          <span class="text-4xl font-semibold text-slate-900 tracking-tight">{{ totalPositions }}</span>
        </div>

        <div
          class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Open
            Vacancies</span>
          <span class="text-4xl font-semibold text-slate-900 tracking-tight">{{ openVacancies }}</span>
        </div>

        <div
          class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200">
          <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Avg. Tenure</span>
          <span class="text-4xl font-semibold text-slate-900 tracking-tight">2.4y</span>
        </div>
      </div>

      <div class="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/70 border-b border-slate-200/80">
                <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[30%]">
                  Position Name</th>
                <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[20%]">Company
                </th>
                <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[35%]">
                  Description</th>
                <th class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[15%]">Created
                  At</th>
                <th
                  class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[10%] text-right">
                  Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(position, index) in positions" :key="index"
                class="hover:bg-slate-50/40 transition-colors group">
                <td class="py-5 px-6">
                  <span
                    class="font-bold text-slate-900 text-[15px] tracking-tight group-hover:text-black transition-colors">{{
                      position.name }}</span>
                </td>

                <td class="py-5 px-6 text-sm text-slate-600 font-normal">
                  {{ position.company }}
                </td>

                <td class="py-5 px-6 text-sm text-slate-400 font-light max-w-xs truncate animate-fade"
                  :title="position.description">
                  {{ position.description || 'No description provided' }}
                </td>

                <td class="py-5 px-6 text-xs md:text-sm text-slate-500 font-light whitespace-nowrap">
                  {{ position.createdAt }}
                </td>

                <td class="py-5 px-6 text-right">
                  <button
                    class="text-slate-400 hover:text-black p-1.5 rounded-md hover:bg-slate-100 transition-all duration-150"
                    title="More Actions">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
                      stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex items-center justify-between text-xs text-slate-400 font-light">
          <span>Showing {{ positions.length }} of {{ totalPositions }} positions</span>
          <div class="flex items-center gap-2">
            <button
              class="border border-slate-200 hover:border-slate-300 hover:text-slate-800 rounded p-1.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="w-3.5 h-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              class="border border-slate-200 hover:border-slate-300 hover:text-slate-800 rounded p-1.5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-150 cursor-pointer active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="w-3.5 h-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  </MainContent>

  <Teleport to="body">
    <div v-if="isModalOpen" class="fixed inset-0 z-[999] grid place-items-center p-4 overflow-y-auto">

      <div class="fixed inset-0 bg-[#09090b]/40 backdrop-blur-sm transition-opacity duration-300" @click="closeModal">
      </div>


      <div
        class="bg-white border border-slate-200 rounded-xl custom-modal-card relative z-[1000] overflow-hidden shadow-xl transform transition-all duration-300 scale-100 flex flex-col my-8">


        <div class="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white">
          <h2 class="text-[17px] font-semibold text-slate-900 tracking-tight">Add New Position</h2>
          <button @click="closeModal" class="text-slate-400 hover:text-black p-1 rounded-md transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
              stroke="currentColor" class="w-4.5 h-4.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleSubmit" class="bg-white">
          <div class="p-6 space-y-6">
            <div>
              <label for="position_name"
                class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Position Name</label>
              <input type="text" id="position_name" v-model="form.name" placeholder="e.g. Senior Frontend Developer"
                class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light"
                required />
            </div>

            <div>
              <label for="description"
                class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
              <textarea id="description" v-model="form.description" rows="4"
                placeholder="Briefly describe the key responsibilities..."
                class="w-full border border-slate-200 hover:border-slate-300 focus:border-black rounded-md p-3 text-sm transition-colors duration-200 outline-none placeholder:text-slate-400 font-light resize-none"></textarea>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
            <button type="button" @click="closeModal"
              class="px-5 py-2.5 text-xs font-medium text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-md transition-all duration-150">
              Cancel
            </button>
            <button type="submit"
              class="bg-black hover:bg-slate-900 text-white text-xs font-semibold py-2.5 px-5 rounded-md transition-all duration-200 shadow-sm active:scale-[0.98]">
              Save Position
            </button>
          </div>
        </form>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import MainContent from "../components/MainContent.vue";
import PrimaryButton from "../components/PrimaryButton.vue";

const isModalOpen = ref(false);
const totalPositions = ref(24);
const openVacancies = ref(8);


const companies = ref([
  { id: 1, name: 'Humify Inc.' },
  { id: 2, name: 'Humify Tech' },
  { id: 3, name: 'Humify Global' }
]);


const form = ref({
  name: '',
  company: 'Humify Inc.',
  description: ''
});

const positions = ref([
  {
    name: 'Senior Product Designer',
    company: 'Humify Inc.',
    description: 'Lead the design system initiatives and core platform...',
    createdAt: 'Oct 12, 2023'
  },
  {
    name: 'Engineering Manager',
    company: 'Humify Inc.',
    description: 'Scaling our infrastructure and mentoring a team of 1...',
    createdAt: 'Sep 28, 2023'
  },
  {
    name: 'HR Operations Specialist',
    company: 'Humify Inc.',
    description: 'Managing employee lifecycle and compliance report...',
    createdAt: 'Nov 05, 2023'
  },
  {
    name: 'Backend Developer',
    company: 'Humify Inc.',
    description: 'Working with Node.js and Postgres to build high-pe...',
    createdAt: 'Dec 01, 2023'
  }
]);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  form.value = {
    name: '',
    company: 'Humify Inc.',
    description: ''
  };
};

const getFormattedDate = () => {
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  return new Date().toLocaleDateString('en-US', options);
};

const handleSubmit = () => {
  if (form.value.name && form.value.company) {
    positions.value.unshift({
      name: form.value.name,
      company: form.value.company,
      description: form.value.description,
      createdAt: getFormattedDate()
    });

    totalPositions.value += 1;
    openVacancies.value += 1;

    closeModal();
  }
};
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-modal-card {
  width: 100% !important;
  max-width: 520px !important;
  min-width: 280px !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>