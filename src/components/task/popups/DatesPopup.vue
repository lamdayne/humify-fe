<template>
    <div class="absolute left-0 top-10 w-80 bg-white shadow-2xl p-4 rounded-xl border border-slate-200 z-50 text-slate-700 flex flex-col gap-3">
        <div class="flex justify-between items-center pb-2 border-b border-slate-100">
            <span class="text-xs font-bold text-slate-800">Dates</span>
            <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700">
                <X class="w-4 h-4"></X>
            </button>
        </div>

        <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-slate-700">Due date</label>
            <div class="flex items-center gap-2">
                <input type="checkbox" :checked="!!tempDate" @change="onToggleCheck"
                    class="w-4 h-4 accent-slate-800 cursor-pointer shrink-0">
                <input type="date" v-model="tempDate"
                    class="flex-1 border border-slate-300 p-2 rounded-lg text-xs outline-none focus:border-slate-500 min-w-0">
                <input type="time" v-model="tempTime"
                    class="w-28 border border-slate-300 p-2 rounded-lg text-xs outline-none focus:border-slate-500 shrink-0">
            </div>
        </div>

        <div class="flex flex-col gap-2 mt-2">
            <button @click="onSave"
                class="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition cursor-pointer">
                Save
            </button>
            <button @click="onRemove"
                class="w-full h-9 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-lg transition cursor-pointer">
                Remove
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { X } from '@lucide/vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['close', 'save', 'remove'])

const tempDate = ref('')
const tempTime = ref('12:00')

watch(() => props.modelValue, (val) => {
    if (val) {
        const d = new Date(val)
        if (!isNaN(d.getTime())) {
            const year = d.getFullYear()
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            const hours = String(d.getHours()).padStart(2, '0')
            const mins = String(d.getMinutes()).padStart(2, '0')
            tempDate.value = `${year}-${month}-${day}`
            tempTime.value = `${hours}:${mins}`
        } else {
            tempDate.value = ''
            tempTime.value = '12:00'
        }
    } else {
        tempDate.value = ''
        tempTime.value = '12:00'
    }
}, { immediate: true })

const onToggleCheck = (e) => {
    if (!e.target.checked) {
        tempDate.value = ''
    } else if (!tempDate.value) {
        tempDate.value = new Date().toISOString().split('T')[0]
        tempTime.value = '12:00'
    }
}

const onSave = () => {
    if (!tempDate.value) {
        emit('save', null)
    } else {
        const dateStr = tempDate.value
        const timeStr = tempTime.value || '12:00'
        const fullDate = new Date(`${dateStr}T${timeStr}:00`)
        emit('save', isNaN(fullDate.getTime()) ? null : fullDate.toISOString())
    }
}

const onRemove = () => {
    tempDate.value = ''
    tempTime.value = '12:00'
    emit('remove')
}
</script>
