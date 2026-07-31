<template>
    <span :class="['px-sm py-xs text-xs font-mono font-medium uppercase rounded-sm inline-flex items-center gap-1', getColorByCode(type)]">
        <slot name="icon"></slot>
        <span>{{ content }}</span>
    </span>
</template>

<script setup>

const props = defineProps({
    content: {
        type: String,
        default: 'Content'
    },
    type: {
        type: String,
        default: ''
    }
})

const getColorByCode = (typeCode) => {
    const code = (typeCode || props.content || '').toUpperCase();
    switch (code) {
        case 'ACTIVE':
        case 'SUCCESS':
        case 'PRESENT':
        case 'APPROVED':
        case 'LOW':
        case 'GREEN':
            return 'bg-green-100 text-green-700 border border-green-200';

        case 'PROBATION':
        case 'COMPLETED':
        case 'BLUE':
        case 'INFO':
        case 'DUE_DATE':
            return 'bg-blue-100 text-blue-700 border border-blue-200';

        case 'ON_LEAVE':
        case 'LATE':
        case 'HALF_DAY':
        case 'REMOTE':
        case 'MEDIUM':
        case 'AMBER':
        case 'WARNING':
            return 'bg-amber-100 text-amber-700 border border-amber-200';

        case 'TERMINATED':
        case 'ABSENT':
        case 'REJECTED':
        case 'HIGH':
        case 'URGENT':
        case 'CANCELLED':
        case 'RED':
        case 'DANGER':
            return 'bg-rose-100 text-rose-700 border border-rose-200';

        case 'PENDING':
            return 'bg-yellow-100 text-yellow-700 border border-yellow-200';

        case 'RESIGNED':
        case 'SLATE':
        case 'POINTS':
        case 'INACTIVE':
        default:
            return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
}
</script>