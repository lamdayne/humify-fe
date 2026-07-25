<template>
    <span :class="['px-sm py-xs text-xs font-mono font-medium uppercase rounded-sm inline-flex items-center gap-1', getColorByCode(type)]">
        <slot name="icon"></slot>
        <span>{{ content }}</span>
    </span>
</template>

<script setup>

defineProps({
    content: {
        type: String,
        default: 'Content'
    },
    type: {
        type: String,
        default: 'ACTIVE'
    }
})

const getColorByCode = (typeCode) => {
    switch (typeCode) {
        case 'ACTIVE':
        case 'SUCCESS':
        case 'PRESENT':
        case 'APPROVED':
        case 'LOW':
        case 'GREEN':
            return 'bg-green-100 text-green-700 border border-green-200';

        case 'LATE':
        case 'HALF_DAY':
        case 'REMOTE':
        case 'MEDIUM':
        case 'AMBER':
        case 'WARNING':
            return 'bg-amber-100 text-amber-700 border border-amber-200';

        case 'ABSENT':
        case 'REJECTED':
            return 'bg-rose-100 text-rose-700 border border-rose-200';

        case 'HIGH':
        case 'URGENT':
        case 'CANCELLED':
        case 'RED':
        case 'DANGER':
            return 'bg-red-100 text-red-700 border border-red-200';

        case 'COMPLETED':
        case 'BLUE':
        case 'INFO':
        case 'DUE_DATE':
            return 'bg-blue-100 text-blue-700 border border-blue-200';

        case 'PURPLE':
        case 'TYPE':
            return 'bg-purple-100 text-purple-700 border border-purple-200';

        case 'SLATE':
        case 'POINTS':
            return 'bg-slate-200 text-slate-700 border border-slate-300';

        case 'PENDING':
            return 'bg-yellow-100 text-yellow-700 border border-yellow-200';

        case 'INACTIVE':
        default:
            return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
}
</script>