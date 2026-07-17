<template>
    <span :class="['px-sm py-xs text-xs font-mono font-medium uppercase', getColorByCode(type)]">
        {{ content }}
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
            return 'bg-green-100 text-green-700';

        case 'LATE':
        case 'HALF_DAY':
        case 'REMOTE':
          return 'bg-amber-100 text-amber-700 border border-amber-200';

        case 'ABSENT':
        case 'REJECTED':
          return 'bg-rose-100 text-rose-700 border border-rose-200';

        case 'INACTIVE':
            return 'bg-gray-100 text-gray-500';

        case 'PENDING':
            return 'bg-yellow-100 text-yellow-700';

        case 'COMPLETED':
            return 'bg-blue-100 text-blue-700';

        case 'CANCELLED':
            return 'bg-red-100 text-red-700';

        default:
            return 'bg-gray-100 text-gray-500';
    }
}
</script>