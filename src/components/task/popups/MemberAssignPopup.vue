<template>
    <div class="absolute left-0 top-10 w-70 bg-white shadow-xl p-3 rounded-lg border border-slate-200 z-50">
        <div class="flex justify-between items-center pb-1 border-b border-slate-100">
            <span class="text-xs font-bold text-slate-800">Members</span>
            <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700">
                <X class="w-3.5 h-3.5"></X>
            </button>
        </div>
        <input type="text"
            class="w-full p-2 mt-2 border border-slate-200 outline-none rounded-lg text-xs"
            placeholder="Search members" v-model="searchKeyword">
        <div class="w-full h-36 overflow-auto mt-2 scrollbar-none">
            <!-- Unassigned Option -->
            <div @click="$emit('select-member', null)"
                class="flex gap-2 mt-1 items-center hover:bg-slate-100 cursor-pointer p-1.5 rounded">
                <span class="p-1 border border-slate-200 rounded-full">
                    <X class="w-3.5 h-3.5"></X>
                </span>
                <span class="text-xs font-medium text-slate-700">Unassigned</span>
            </div>
            
            <!-- Member List -->
            <div v-for="member in filteredMembers" :key="member.id"
                @click="$emit('select-member', member.user.id)"
                class="flex gap-2 mt-1 items-center hover:bg-slate-100 cursor-pointer p-1.5 rounded">
                <img src="https://res.cloudinary.com/dmzsletu0/image/upload/v1782044934/453178253_471506465671661_2781666950760530985_n_wqklyb.png"
                    alt="" class="w-7 h-7 rounded-full">
                <span class="text-xs text-slate-700 font-medium">
                    {{ member.user.fullName || member.user.email }}
                </span>
            </div>
            <div v-if="filteredMembers.length === 0" class="text-center mt-5 text-slate-400 text-xs">
                No member found
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { X } from '@lucide/vue';

const props = defineProps({
    members: {
        type: Array,
        default: () => []
    }
})

defineEmits(['close', 'select-member'])

const searchKeyword = ref('')

const filteredMembers = computed(() => {
    if (!props.members) return []
    const kw = searchKeyword.value.toLowerCase().trim()
    if (!kw) return props.members

    return props.members.filter(member => {
        const email = (member.user?.email || '').toLowerCase()
        const fullName = (member.user?.fullName || '').toLowerCase()
        return email.includes(kw) || fullName.includes(kw)
    })
})
</script>
