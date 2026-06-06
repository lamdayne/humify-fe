<template>
    <footer class="mt-xl flex items-center justify-between">
        <span class="text-on-surface-variant font-body-sm">
            Showing {{ startIndex }} – {{ endIndex }} of {{ totalItems }} {{ itemLabel }}
        </span>
        <div class="flex items-center gap-xs">
            <button :disabled="currentPage <= 1"
                class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-surface-container-high transition-colors disabled:opacity-50 cursor-pointer">
                <span class="">
                    <ChevronLeft class="w-4"></ChevronLeft>
                </span>
            </button>
            <div class="flex gap-xs mx-sm">
                <template v-for="(page, idx) in pageRange" :key="idx">
                    <span v-if="page === DOTS"
                        class="w-8 h-8 flex items-center justify-center text-on-surface-variant">...</span>

                    <button v-else @click="goTo(page)"
                        :class="page === currentPage
                            ? 'w-8 h-8 flex items-center justify-center bg-black text-white rounded font-mono text-xs cursor-pointer'
                            : 'w-8 h-8 flex items-center justify-center border border-gray-300 rounded font-mono text-xs cursor-pointer'">
                        {{ page }}
                    </button>
                </template>
            </div>
            <button :disabled="currentPage >= totalPage"
                class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-surface-container-high transition-colors cursor-pointer">
                <span class="material-symbols-outlined">
                    <ChevronRight class="w-4"></ChevronRight>
                </span>
            </button>
        </div>
    </footer>
</template>

<script setup>
import { ChevronLeft, ChevronRight } from '@lucide/vue';
import { computed } from 'vue';


const props = defineProps({
    currentPage: {
        type: Number,
        default: 1
    },
    totalItems: {
        type: Number,
        default: 0
    },
    totalPage: {
        type: Number,
        default: 0
    },
    pageSize: {
        type: Number,
        default: 10
    },
    siblingCount: {
        type: Number,
        default: 1
    },
    itemLabel: {
        type: String,
        default: 'items'
    }
})

const emit = defineEmits(['update:currentPage', 'changePage'])

const DOTS = '...'

const startIndex = computed(() => {
    if (props.totalItems === 0) return 0;
    return (props.currentPage - 1) * props.pageSize + 1;
})

const endIndex = computed(() => {
    return Math.min(props.currentPage * props.pageSize, props.totalItems)
})

const pageRange = computed(() => {
    const total = props.totalPage

    if (total <= 7) {
        return Array.from({ length: { total } }, (_, i) => i + 1)
    }

    return [1, 2, 3, DOTS, total - 2, total - 1, total]
})

const nextPage = () => {
    if (props.currentPage < props.totalPage) {
        emit('changePage', props.currentPage + 1)
        emit('update:currentPage', props.currentPage + 1)
    }
}

const previousPage = () => {
    if (props.currentPage > 1) {
        emit('update:currentPage', props.currentPage - 1)
        emit('changePage', props.currentPage - 1)
    }
}

const goTo = (page) => {
    if (page != props.currentPage) {
        emit('changePage', page)
        emit('update:currentPage', page)
    }
}
</script>