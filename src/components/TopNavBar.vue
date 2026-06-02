<template>
    <header
        class="fixed top-0 right-0 h-14 w-[calc(100%-240px)] bg-surface flex justify-end px-xl border-b-2 border-slate-200 z-40">
        <div class="flex items-center gap-xs">
            <button class="relative p-xs hover:bg-surface-container-high rounded-lg transition-colors">
                <span class="material-symbols-outlined text-on-surface-variant">
                    <Bell></Bell>
                </span>
                <span class="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full"></span>
            </button>
            <div class="h-6 w-px bg-outline-variant mx-sm"></div>
            <div class="relative group">
                <img alt="User Profile" class="w-8 h-8 rounded-lg object-cover cursor-pointer"
                    data-alt="A sharp, minimalist macro shot of modern office equipment on a white desk. In the background, a large glass window reveals a bright, high-contrast cityscape in daylight. The aesthetic is clean and professional, focusing on silver and white tones with a sense of architectural precision."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfBHrYzRqN2XQOXwA5s9Qsx-IJY967pbMleFyPqAsNMaATqtG77zohyRgdmSdRk0X6FBZVn__e52CoRw1m-HxJ0SK3HNpZ-OmLivwdmi1rwpJ1LhFjuba7-6lAzFsgquJWevKeTWva0hQMgcxfWFQkdoQYJ35POblleC9TrSr5BZW7Hkugtc_VhVTiMQ6TIpgRplxyZNrY0T44Rvo2iv3sW5HkV9MjcJiAdRzUqeYf-XQqaS4OjeAxLZ-htQ9SX1fR84G8XOAVPKk" />
                <div class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md opacity-0 invisible 
                       group-hover:opacity-100 group-hover:visible 
                       transition-all duration-200 z-50">

                    <ul class="py-2 text-sm text-gray-700">
                        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                        <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">Logout</li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { Bell } from '@lucide/vue';

</script>