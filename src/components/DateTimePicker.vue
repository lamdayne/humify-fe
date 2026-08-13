<template>
  <div class="relative" ref="rootRef">
    <div
        class="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 flex items-center justify-between cursor-pointer bg-white"
        @click="toggleOpen"
    >
      <span :class="displayValue ? 'text-slate-800' : 'text-slate-400'">
        {{ displayValue || effectivePlaceholder }}
      </span>
      <Calendar class="w-4 h-4 text-slate-400" />
    </div>

    <div
        v-if="open"
        class="absolute z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-3 flex gap-3 right-0 sm:right-auto"
        :class="isTop ? 'bottom-full mb-1' : 'top-full mt-1'"
        :style="{ width: dateOnly ? '260px' : '340px' }"
    >
      <!-- Calendar -->
      <div class="flex-1">
        <div class="flex items-center justify-between mb-2">
          <button type="button" class="p-1 hover:bg-slate-100 rounded cursor-pointer" @click="prevMonth">
            <ChevronLeft class="w-4 h-4" />
          </button>
          <span class="text-xs font-bold text-slate-700">{{ monthLabel }}</span>
          <button type="button" class="p-1 hover:bg-slate-100 rounded cursor-pointer" @click="nextMonth">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 mb-1">
          <span v-for="d in weekdayLabels" :key="d">{{ d }}</span>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center text-xs">
          <button
              v-for="(cell, idx) in calendarCells"
              :key="idx"
              type="button"
              class="h-7 w-7 rounded-full flex items-center justify-center cursor-pointer"
              :class="cellClass(cell)"
              @click="selectDay(cell)"
          >
            {{ cell.day }}
          </button>
        </div>

        <div class="flex justify-between mt-2 text-[11px]">
          <button type="button" class="text-blue-600 hover:underline cursor-pointer" @click="clearValue">Clear</button>
          <button type="button" class="text-blue-600 hover:underline cursor-pointer" @click="goToday">Today</button>
        </div>
      </div>

      <!-- Time -->
      <div v-if="!dateOnly" class="w-24 border-l border-slate-100 pl-3 flex flex-col items-center gap-2">
        <div class="flex items-center gap-1">
          <select v-model.number="hour12" class="border border-slate-200 rounded text-xs p-1 w-12 text-center">
            <option v-for="h in 12" :key="h" :value="h">{{ String(h).padStart(2, '0') }}</option>
          </select>
          <span class="text-xs">:</span>
          <select v-model.number="minute" class="border border-slate-200 rounded text-xs p-1 w-12 text-center">
            <option v-for="m in 60" :key="m - 1" :value="m - 1">{{ String(m - 1).padStart(2, '0') }}</option>
          </select>
        </div>

        <div class="flex gap-1">
          <button
              type="button"
              class="px-2 py-1 rounded text-xs font-bold cursor-pointer"
              :class="meridiem === 'AM' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'"
              @click="meridiem = 'AM'"
          >AM</button>
          <button
              type="button"
              class="px-2 py-1 rounded text-xs font-bold cursor-pointer"
              :class="meridiem === 'PM' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'"
              @click="meridiem = 'PM'"
          >PM</button>
        </div>

        <button
            type="button"
            class="mt-auto w-full bg-black text-white text-[11px] font-bold rounded-lg py-1.5 cursor-pointer"
            @click="applyAndClose"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { Calendar, ChevronLeft, ChevronRight } from '@lucide/vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  dateOnly: { type: Boolean, default: false },
  placement: { type: String, default: 'auto' } // 'top' | 'bottom' | 'auto'
});
const emit = defineEmits(['update:modelValue']);

const rootRef = ref(null);
const open = ref(false);
const isTop = ref(false);

const effectivePlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder;
  return props.dateOnly ? 'dd/mm/yyyy' : 'dd/mm/yyyy hh:mm AM';
});

const weekdayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const parseValue = (val) => {
  if (!val) return null;
  const [datePart, timePart] = val.split('T');
  const [y, m, d] = (datePart || '').split('-').map(Number);
  const [hh, mm] = (timePart || '00:00').split(':').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, hh, mm);
};

const initial = parseValue(props.modelValue) || new Date();

const viewYear = ref(initial.getFullYear());
const viewMonth = ref(initial.getMonth()); // 0-11
const selectedDate = ref(parseValue(props.modelValue)); // Date | null

const hour24 = ref(initial.getHours());
const minute = ref(initial.getMinutes());

const hour12 = computed({
  get() {
    const h = hour24.value % 12;
    return h === 0 ? 12 : h;
  },
  set(val) {
    const isPM = meridiem.value === 'PM';
    hour24.value = isPM ? (val % 12) + 12 : (val % 12);
  }
});

const meridiem = computed({
  get() {
    return hour24.value >= 12 ? 'PM' : 'AM';
  },
  set(val) {
    const h12 = hour12.value;
    hour24.value = val === 'PM' ? (h12 % 12) + 12 : (h12 % 12);
  }
});

const monthLabel = computed(() => `${monthNames[viewMonth.value]} ${viewYear.value}`);

const calendarCells = computed(() => {
  const firstOfMonth = new Date(viewYear.value, viewMonth.value, 1);
  const startWeekday = firstOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear.value, viewMonth.value, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) {
    cells.push({ day: daysInPrevMonth - startWeekday + 1 + i, current: false, year: viewYear.value, month: viewMonth.value - 1 });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true, year: viewYear.value, month: viewMonth.value });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const extra = cells.length - (startWeekday + daysInMonth);
    cells.push({ day: extra + 1, current: false, year: viewYear.value, month: viewMonth.value + 1 });
  }
  return cells;
});

const isSameDay = (a, b) =>
    a && b && a.getFullYear() === b.year && a.getMonth() === b.month && a.getDate() === b.day;

const isToday = (cell) => {
  const t = new Date();
  return t.getFullYear() === cell.year && t.getMonth() === cell.month && t.getDate() === cell.day;
};

const cellClass = (cell) => {
  if (!cell.current) return 'text-slate-300';
  if (isSameDay(selectedDate.value, cell)) return 'bg-blue-600 text-white font-bold';
  if (isToday(cell)) return 'border border-blue-400 text-slate-800';
  return 'text-slate-700 hover:bg-slate-100';
};

const pad = (n) => String(n).padStart(2, '0');

const applyAndClose = () => {
  if (!selectedDate.value) { open.value = false; return; }
  const d = selectedDate.value;
  const value = props.dateOnly
    ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hour24.value)}:${pad(minute.value)}`;
  emit('update:modelValue', value);
  open.value = false;
};

const selectDay = (cell) => {
  selectedDate.value = new Date(cell.year, cell.month, cell.day);
  viewYear.value = selectedDate.value.getFullYear();
  viewMonth.value = selectedDate.value.getMonth();
  if (props.dateOnly) {
    applyAndClose();
  }
};

const prevMonth = () => {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value--; }
  else viewMonth.value--;
};
const nextMonth = () => {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++; }
  else viewMonth.value++;
};

const goToday = () => {
  const t = new Date();
  viewYear.value = t.getFullYear();
  viewMonth.value = t.getMonth();
  selectedDate.value = t;
  hour24.value = t.getHours();
  minute.value = t.getMinutes();
  if (props.dateOnly) {
    applyAndClose();
  }
};

const clearValue = () => {
  selectedDate.value = null;
  emit('update:modelValue', '');
  open.value = false;
};

const displayValue = computed(() => {
  if (!selectedDate.value) return '';
  const d = selectedDate.value;
  const h12 = hour12.value;
  if (props.dateOnly) {
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(h12)}:${pad(minute.value)} ${meridiem.value}`;
});

const toggleOpen = () => {
  if (!open.value && rootRef.value) {
    if (props.placement === 'top') {
      isTop.value = true;
    } else if (props.placement === 'bottom') {
      isTop.value = false;
    } else {
      const rect = rootRef.value.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      isTop.value = spaceBelow < 320;
    }
  }
  open.value = !open.value;
};

const handleClickOutside = (e) => {
  if (rootRef.value && !rootRef.value.contains(e.target)) open.value = false;
};
onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));

watch(() => props.modelValue, (val) => {
  const parsed = parseValue(val);
  selectedDate.value = parsed;
  if (parsed) {
    viewYear.value = parsed.getFullYear();
    viewMonth.value = parsed.getMonth();
    hour24.value = parsed.getHours();
    minute.value = parsed.getMinutes();
  }
});
</script>