<template>
    <header class="fixed top-0 left-0 right-0 z-50 h-14 border-b border-slate-300 backdrop-blur-lg bg-white/70">
        <div class="w-full mx-auto h-full flex items-center justify-between px-4 md:px-16 lg:px-36">
            <div class="flex items-center gap-xl">
                <router-link to="/" class="text-[20px] font-semibold text-primary tracking-tight">Humify</router-link>
                <nav class="hidden md:flex items-center gap-lg ml-xl">
                    <a class="font-body-md text-on-surface-variant hover:text-primary transition-colors duration-200"
                        href="#features">Features</a>
                    <!-- <a class="font-body-md text-on-surface-variant hover:text-primary transition-colors duration-200"
                        href="#pricing">Pricing</a> -->
                    <a class="font-body-md text-on-surface-variant hover:text-primary transition-colors duration-200"
                        href="#team">Team</a>
                </nav>
            </div>
            <div class="flex items-center gap-md">
                <PrimaryButton @click="getStarted" :content="'Get started'"></PrimaryButton>
            </div>
        </div>
    </header>

    <main>
        <section id="home"
            class="w-full mx-auto h-full flex items-center justify-between px-4 md:px-16 lg:px-36 min-h-120 md:min-h-150 lg:min-h-180">
            <div class="flex justify-between items-center w-full">
                <div class="flex flex-col gap-lg items-start">
                    <span class="uppercase text-xs font-medium font-mono p-1 border rounded-full">
                        Hr & project management
                    </span>
                    <h1 class="text-2xl md:text-4xl lg:text-5xl">
                        Run your team,<br>
                        not your spreadsheets.
                    </h1>
                    <p class="text-[18px] text-on-surface-variant max-w-120">
                        Humify brings employees,
                        attendance, projects, and tasks into one clean workspace built for
                        growing teams.
                    </p>
                    <div>
                        <PrimaryButton @click="getStarted" :content="'Started for free'"></PrimaryButton>
                    </div>
                </div>
                <div class="hidden md:flex">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzJYxMg9JXo0UjjsclGM8ftdv0eX0SjE57WzCTQn6hMdRaCySP6SvginCqb7yKrLmNPmiRKtZiC939kElH55JYW4KZUDztoTfMnYNPLpw9VDAf9fr4eE_WavKyoc1ppZ7B-By0nSSxSxz0VZriutyek3OhsPLlKkEaH-4nfFJRpMQCR_qifrZR-QLPFb2hR4yEDucK8_SiwuuSg18rOptLZBYvS3jv0DH8kY0cIuRDqScP-2hB9HEUh-6TDQ8sWIWYFqWvs3eue5w"
                        alt="" class="rounded-lg shadow-gray-300">
                </div>
            </div>
        </section>

        <section class="mt-2 px-4 md:px-16 lg:px-36 min-h-120 md:min-h-150 lg:min-h-180" id="features">
            <div class="border border-slate-300"></div>
            <div class="text-center mb-4xl mt-2xl">
                <h2 class="text-[32px] text-primary mb-sm">Everything your team needs</h2>
                <p class="font-body-lg text-gray-700">Built around how real teams actually work.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-xl mt-xl">
                <div class="p-xl border rounded-xl flex flex-col gap-md">
                    <span class="material-symbols-outlined text-primary">
                        <Users></Users>
                    </span>
                    <h2 class="text-primary">Employee Management</h2>
                    <p class="text-slate-600">
                        Centralize all employee records,
                        contracts, and personal data in one secure, accessible location.
                    </p>
                </div>
                <div class="p-xl border rounded-xl flex flex-col gap-md">
                    <span class="material-symbols-outlined text-primary">
                        <Calendar></Calendar>
                    </span>
                    <h2 class="text-primary">Attendance Tracking</h2>
                    <p class="text-slate-600">
                        Monitor clock-ins, leaves, and overtime with automated tracking that eliminates manual data
                        entry.
                    </p>
                </div>
                <div class="p-xl border rounded-xl flex flex-col gap-md">
                    <span class="material-symbols-outlined text-primary">
                        <FolderKanban></FolderKanban>
                    </span>
                    <h2 class="text-primary">Project &amp; Task Management</h2>
                    <p class="text-slate-600">
                        Bridge the gap between HR and operations by managing workflows and individual tasks in the same
                        app.
                    </p>
                </div>
                <div class="p-xl border rounded-xl flex flex-col gap-md">
                    <span class="material-symbols-outlined text-primary">
                        <Network></Network>
                    </span>
                    <h2 class="text-primary">Branch &amp; Department Structure</h2>
                    <p class="text-slate-600">
                        Map your entire organization hierarchy effortlessly, regardless of how many locations you
                        operate.
                    </p>
                </div>
                <div class="p-xl border rounded-xl flex flex-col gap-md">
                    <span class="material-symbols-outlined text-primary">
                        <UserLock></UserLock>
                    </span>
                    <h2 class="text-primary">Roles &amp; Permissions</h2>
                    <p class="text-slate-600">
                        Granular access controls ensure that managers and employees only see exactly what they need.
                    </p>
                </div>
                <div class="p-xl border rounded-xl flex flex-col gap-md">
                    <span class="material-symbols-outlined text-primary">
                        <ChartLine></ChartLine>
                    </span>
                    <h2 class="text-primary">Reports &amp; Analytics</h2>
                    <p class="text-slate-600">
                        Gain insights into team performance and turnover rates with beautifully simplified automated
                        reporting.
                    </p>
                </div>
            </div>
        </section>

        <section class="px-4 md:px-16 lg:px-36 min-h-100" id="team">
            <div class="text-center mb-4xl">
                <h2 class="text-[32px] text-primary mb-sm">Built by people who've felt the pain</h2>
                <p class="font-body-lg text-gray-700">
                    A small team obsessed with making HR less painful for growing businesses.
                </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-xl mt-2xl">
                <div class="flex flex-col items-center gap-xs">
                    <img src="https://avatars.githubusercontent.com/u/142385587?v=4" class="w-36 rounded-full" alt="">
                    <h4 class="font-headline-sm text-primary text-[15px]">lamdayne</h4>
                    <p class="font-body-sm text-on-surface-variant">Backend Developer</p>
                </div>
                <div class="flex flex-col items-center gap-xs">
                    <img src="https://avatars.githubusercontent.com/u/204664566?v=4" class="w-36 rounded-full" alt="">
                    <h4 class="font-headline-sm text-primary text-[15px]">KhiemLee</h4>
                    <p class="font-body-sm text-on-surface-variant">Backend Developer</p>
                </div>
                <div class="flex flex-col items-center gap-xs">
                    <img src="https://avatars.githubusercontent.com/u/204741757?v=4" class="w-36 rounded-full" alt="">
                    <h4 class="font-headline-sm text-primary text-[15px]">ThienStyle</h4>
                    <p class="font-body-sm text-on-surface-variant">Backend Developer</p>
                </div>
                <div class="flex flex-col items-center gap-xs">
                    <img src="https://avatars.githubusercontent.com/u/204741757?v=4" class="w-36 rounded-full" alt="">
                    <h4 class="font-headline-sm text-primary text-[15px]">KhoaVu</h4>
                    <p class="font-body-sm text-on-surface-variant">Backend Developer</p>
                </div>
                <div class="flex flex-col items-center gap-xs">
                    <img src="https://avatars.githubusercontent.com/u/204741757?v=4" class="w-36 rounded-full" alt="">
                    <h4 class="font-headline-sm text-primary text-[15px]">ThanhXuan</h4>
                    <p class="font-body-sm text-on-surface-variant">Backend Developer</p>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import PrimaryButton from '../components/PrimaryButton.vue'
import { Calendar, ChartLine, FolderKanban, Network, UserLock, Users } from '@lucide/vue';

const router = useRouter()

const getStarted = () => {
    router.push('/login')
}
</script>