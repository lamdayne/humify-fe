<template>
    <span :class="['px-sm py-xs font-label-mono text-label-mono rounded uppercase', getColorByCode(type)]">
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
            return 'bg-green-100 text-green-700';

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