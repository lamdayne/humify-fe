<template>
    <div class="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50/70 border-b border-slate-200">

                        <th
                            class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[15%]">
                            Employee Code
                        </th>
                        <th
                            class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[25%]">
                            Full name
                        </th>
                        <th
                            class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[25%]">
                            Email
                        </th>
                        <th
                            class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[15%]">
                            Start Date
                        </th>
                        <th
                            class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[10%]">
                            Gender
                        </th>
                        <th
                            class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[10%]">
                            Status
                        </th>
                        <th
                            class="py-4 px-6 text-[10px] font-semibold text-slate-400 uppercase tracking-widest w-[10%] text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="i in 10" :key="i" class="hover:bg-slate-50/40 transition-colors group">
                        <td class="py-5 px-6">
                            <div class="w-full rounded-2xl h-5 bg-slate-200 animate-pulse"></div>
                        </td>

                        <td class="py-5 px-6">
                            <div class="w-full rounded-2xl h-5 bg-slate-200 animate-pulse"></div>
                        </td>

                        <td class="py-5 px-6">
                            <div class="w-full rounded-2xl h-5 bg-slate-200 animate-pulse"></div>

                        </td>

                        <td class="py-5 px-6">
                            <div class="w-full rounded-2xl h-5 bg-slate-200 animate-pulse"></div>

                        </td>

                        <td class="py-5 px-6">
                            <div class="w-full rounded-2xl h-5 bg-slate-200 animate-pulse"></div>

                        </td>

                        <td class="py-5 px-6">
                            <div class="w-full rounded-2xl h-5 bg-slate-200 animate-pulse"></div>

                        </td>

                        <td class="py-5 px-6">
                            <div class="w-full rounded-2xl h-5 bg-slate-200 animate-pulse"></div>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>