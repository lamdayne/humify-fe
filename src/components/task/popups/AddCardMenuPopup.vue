<template>
    <div class="absolute left-0 top-10 w-72 bg-white shadow-2xl p-3 rounded-xl border border-slate-200 z-50 text-slate-700">
        <div class="flex justify-between items-center pb-2 border-b border-slate-100">
            <span class="text-xs font-bold text-slate-800">Add to card</span>
            <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700">
                <X class="w-4 h-4"></X>
            </button>
        </div>
        <div class="flex flex-col gap-1 mt-2 text-xs">
            <button @click="$emit('select-priority')"
                class="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-100 text-left transition cursor-pointer">
                <Tag class="w-4 h-4 text-slate-500 mt-0.5 shrink-0"></Tag>
                <div class="flex flex-col">
                    <span class="font-semibold text-slate-800">Priority</span>
                    <span class="text-[11px] text-slate-400">Set task urgency (Low, Medium, High, Urgent)</span>
                </div>
            </button>

            <button @click="$emit('select-type')"
                class="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-100 text-left transition cursor-pointer">
                <Layers class="w-4 h-4 text-slate-500 mt-0.5 shrink-0"></Layers>
                <div class="flex flex-col">
                    <span class="font-semibold text-slate-800">Type</span>
                    <span class="text-[11px] text-slate-400">Categorize task (Task, Bug, Feature, Story)</span>
                </div>
            </button>

            <button @click="$emit('select-points')"
                class="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-100 text-left transition cursor-pointer">
                <Hash class="w-4 h-4 text-slate-500 mt-0.5 shrink-0"></Hash>
                <div class="flex flex-col">
                    <span class="font-semibold text-slate-800">Story Points</span>
                    <span class="text-[11px] text-slate-400">Estimate complexity points</span>
                </div>
            </button>

            <button @click="$emit('select-estimated-hours')"
                class="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-100 text-left transition cursor-pointer">
                <Clock class="w-4 h-4 text-slate-500 mt-0.5 shrink-0"></Clock>
                <div class="flex flex-col">
                    <span class="font-semibold text-slate-800">Estimated Hours</span>
                    <span class="text-[11px] text-slate-400">Set work hours estimate (e.g. 8.5h)</span>
                </div>
            </button>

            <button @click="$emit('select-checklist')"
                class="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-100 text-left transition cursor-pointer">
                <CircleCheckBig class="w-4 h-4 text-slate-500 mt-0.5 shrink-0"></CircleCheckBig>
                <div class="flex flex-col">
                    <span class="font-semibold text-slate-800">Checklist</span>
                    <span class="text-[11px] text-slate-400">Add subtasks & todo list</span>
                </div>
            </button>

            <button @click="$emit('select-members')"
                class="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-100 text-left transition cursor-pointer">
                <UserPlus class="w-4 h-4 text-slate-500 mt-0.5 shrink-0"></UserPlus>
                <div class="flex flex-col">
                    <span class="font-semibold text-slate-800">Members</span>
                    <span class="text-[11px] text-slate-400">Assign project members</span>
                </div>
            </button>

            <button @click="$emit('select-attachment')"
                class="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-100 text-left transition cursor-pointer">
                <Paperclip class="w-4 h-4 text-slate-500 mt-0.5 shrink-0"></Paperclip>
                <div class="flex flex-col">
                    <span class="font-semibold text-slate-800">Attachment</span>
                    <span class="text-[11px] text-slate-400">Attach files and documents</span>
                </div>
            </button>
        </div>
    </div>
</template>

<script setup>
import { CircleCheckBig, Clock, Hash, Layers, Paperclip, Tag, UserPlus, X } from '@lucide/vue';

defineEmits([
    'close',
    'select-priority',
    'select-type',
    'select-points',
    'select-estimated-hours',
    'select-checklist',
    'select-members',
    'select-attachment'
])
</script>
