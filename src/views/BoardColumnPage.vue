<template>
    <MainContent>
        <div class="flex items-start p-3 overflow-x-auto gap-3 hide-scrollbar">
            <div v-for="(col, index) in columns" :key="col.id" draggable="true" @dragover.prevent
                @dragstart="onColumnDragStart(index)" @drop="onColumnDrop(index)"
                class="w-60 shrink-0 bg-gray-300 p-3 rounded-xl space-y-2 flex flex-col max-h-[85vh]">
                <div class="font-bold flex justify-between relative">
                    <span class="">{{ col.title }}</span>
                    <button @click="col.showMenu = !col.showMenu"
                        class="px-1 rounded-full hover:bg-slate-200 cursor-pointer">
                        <EllipsisVertical class="w-4"></EllipsisVertical>
                    </button>

                    <div v-if="col.showMenu" @click="col.showMenu = false" class="fixed inset-0 z-10 cursor-default">
                    </div>
                    <div v-if="col.showMenu"
                        class="absolute top-8 right-0 bg-white shadow-lg rounded-lg w-32 border border-gray-200 z-20 text-sm font-normal overflow-hidden">
                        <button @click="col.showMenu = false"
                            class="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer transition">Rename</button>
                        <button @click="deleteColumn(col.id)"
                            class="w-full text-left px-3 py-2 hover:bg-red-100 text-red-600 cursor-pointer border-t border-gray-100 transition">Delete</button>
                    </div>
                </div>
                <div class="space-y-2 flex-1 overflow-y-auto hide-scrollbar" @dragover.prevent
                    @drop.stop="onTaskDrop(col.id, col.tasks.length)">
                    <div v-for="(task, i) in col.tasks" :key="task.id" draggable="true" @dragover.prevent.stop
                        @dragstart.stop="onTaskDragStart(col.id, i)" @drop.stop="onTaskDrop(col.id, i)"
                        class="group bg-white p-3 rounded-lg shadow-sm cursor-pointer border-2 border-transparent hover:border-slate-400 flex items-start gap-2">
                        <input type="checkbox" name="" id="" draggable="false"
                            class="mt-1 opacity-0 group-hover:opacity-100 checked:opacity-100 transition cursor-pointer">
                        <div class="flex-1">
                            {{ task.title }}
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <button v-if="!col.isAdding" @click="col.isAdding = true"
                        class="w-full text-left cursor-pointer hover:bg-slate-200 p-2 rounded-lg transition">
                        + Add a card
                    </button>

                    <div v-else>
                        <textarea name="" id="" placeholder="Enter a title" v-model="col.newTask"
                            class="bg-white rounded-lg w-full p-2 resize-none focus:outline-none"></textarea>
                        <div class="flex gap-2">
                            <button @click="addTask(col)" class="bg-slate-900 text-white px-3 py-1 rounded-lg">
                                Add card
                            </button>
                            <button @click="cancelTask(col)" class="cursor-pointer">
                                <X></X>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-60 shrink-0">
                <button v-if="!isAddingColumn" @click="isAddingColumn = true"
                    class="w-full bg-gray-300 p-3 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-gray-400">
                    <Plus class="w-4" />
                    <span>Add a column</span>
                </button>
                <div v-else class="bg-gray-300 p-3 rounded-xl space-y-2">
                    <input v-model="newColumnTitle" placeholder="Enter column title..."
                        class="w-full p-2 rounded-lg focus:outline-none" />

                    <div class="flex gap-2">
                        <button @click="addColumn" class="bg-slate-900 text-white px-3 py-1 rounded-lg">
                            Add column
                        </button>

                        <button @click="cancelColumn">
                            <X></X>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </MainContent>
</template>

<script setup>
import { EllipsisVertical, Plus, X } from '@lucide/vue';
import MainContent from '../components/MainContent.vue';
import { onMounted, ref } from 'vue';
import { useColumnStore } from '../store/columnStore.js'
import { useRoute } from 'vue-router';
import { useTaskStore } from '../store/taskStore.js';

const route = useRoute()
const isAddingColumn = ref(false)
const newColumnTitle = ref('')
const draggedColumn = ref(null)
const draggedTask = ref(null)

const columns = ref([
    {
        id: 1,
        title: 'To do',
        tasks: [],
        isAdding: false,
        newTask: '',
        showMenu: false
    }
])

const columnStore = useColumnStore()
const taskStore = useTaskStore()

const onColumnDragStart = (index) => {
    draggedColumn.value = index
    draggedTask.value = null
}

const onColumnDrop = async (index) => {
    if (draggedTask.value !== null) {
        const targetCol = columns.value[index]
        onTaskDrop(targetCol.id, targetCol.tasks.length)
        return
    }

    if (draggedColumn.value === null) return
    const from = draggedColumn.value
    const to = index

    if (from === to) {
        draggedColumn.value = null
        return
    }

    const moved = columns.value.splice(from, 1)[0]
    columns.value.splice(to, 0, moved)
    draggedColumn.value = null

    const projectId = route.params?.id
    const columnIds = {
        columnIds: columns.value.map(c => c.id)
    }
    await columnStore.reorderColumn(projectId, columnIds)
}

const onTaskDragStart = (colId, index) => {
    draggedTask.value = { colId, index }
    draggedColumn.value = null
}

const onTaskDrop = (targetColId, targetIndex) => {
    if (!draggedTask.value) return;

    const { colId: sourceColId, index: sourceIndex } = draggedTask.value;

    const sourceCol = columns.value.find(c => c.id === sourceColId);
    const targetCol = columns.value.find(c => c.id === targetColId);

    if (sourceCol && targetCol) {
        const [movedTask] = sourceCol.tasks.splice(sourceIndex, 1);

        if (sourceColId === targetColId && sourceIndex < targetIndex) {
            targetIndex--;
        }

        targetCol.tasks.splice(targetIndex, 0, movedTask);
    }

    draggedTask.value = null;
}

const addTask = (col) => {
    if (!col.newTask.trim()) return

    col.tasks.push({
        id: Date.now(),
        title: col.newTask,
        position: col.tasks.length
    })
    col.newTask = ''
    col.isAdding = false
}

const cancelTask = (col) => {
    col.newTask = ''
    col.isAdding = false
}

const addColumn = async () => {
    if (!newColumnTitle.value.trim()) return

    const columnInfo = {
        name: newColumnTitle.value,
        category: 'IN_PROGRESS'
    }

    const projectId = route.params?.id;
    const res = await columnStore.createColumn(projectId, columnInfo)

    const newCol = res.data?.data;
    columns.value.push({
        id: newCol.id,
        title: newColumnTitle.value,
        tasks: [],
        isAdding: false,
        newTask: "",
        showMenu: false
    })

    newColumnTitle.value = ""
    isAddingColumn.value = false
}

const cancelColumn = () => {
    newColumnTitle.value = ""
    isAddingColumn.value = false
}

const deleteColumn = (colId) => {
    const index = columns.value.findIndex(c => c.id === colId);
    if (index !== -1) {
        columns.value.splice(index, 1);
    }
}

onMounted(async () => {
    const projectId = route.params?.id;
    const res = await columnStore.fetchColumnsByProjectId(projectId)
    columns.value = res.data?.data.map((col) => ({
        id: col.id,
        title: col.name,
        position: col.position,
        tasks: [],
        isAdding: false,
        newTask: '',
        showMenu: false
    })).sort((a, b) => a.position - b.position)

    const taskRes = await taskStore.fetchTaskByProjectId(projectId)
    const tasksCol = taskRes.data?.data?.items || []

    tasksCol.forEach(task => {
        const col = columns.value.find((c => c.id === task.columnId))

        if (col) {
            col.tasks.push({
                id: task.id,
                title: task.title,
                position: task.position,
                priority: task.priority,
                assignee: task.assignee,
                dueDate: task.dueDate
            })
        }
    })

    columns.value.forEach(col => {
        col.tasks.sort((a, b) => a.position - b.position)
    })
})
</script>