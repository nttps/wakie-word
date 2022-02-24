<script setup>
import MainDropdown from './dropdown/MainDropdown.vue';
import { ref } from 'vue'

const username = ref('NTTPS')
const email = ref('teamerze@gmail.com')

</script>

<template lang="">
    <MainDropdown v-slot="slotProps">
        <button id="user-menu-button" type="button" class="flex mr-3 text-sm bg-black dark:bg-white rounded-full md:mr-0 focus:ring-2 focus:ring-black dark:focus:ring-white" aria-expanded="false" data-dropdown-toggle="dropdown" @click="slotProps.toggleOpen">
            <span class="sr-only">Open user menu</span>
            <img class="w-8 h-8 rounded-full" src="https://avatars.githubusercontent.com/u/59824069?v=4" alt="user photo">
        </button>
        <transition
            enter-active-class="transition duration-100 ease-in-out"
            leave-active-class="transition duration-100 ease-in-out"
            enter-class="opacity-0 scale-75"
            enter-to-class="opacity-100 scale-100"
            leave-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-75"
        >
            <div v-if="slotProps.open" class="origin-top-right absolute right-0 mt-2 w-64 dark:bg-[#2a2548] dark:text-white text-black border overflow-hidden rounded-lg shadow-md">
                <ul>
                    <li>
                        <a to="/profile" class="rounded-t-lg block px-4 py-3 hover:bg-gray-100 dark:hover:bg-amber-600">
                            <div class="font-semibold">{{ username }}</div>
                            <div class="text-gray-100">{{ email }}</div>
                        </a>
                    </li>
                    <li class="hover:bg-gray-100 dark:hover:bg-amber-600">
                        <a class="font-semibold block px-4 py-3" to="/profile">Profile</a>
                    </li>
                    <li class="hover:bg-gray-100 dark:hover:bg-amber-600">
                        <a class="font-semibold block px-4 py-3" to="/profile">Sign Out</a>
                    </li>
                </ul>
            </div>
        </transition>
    </MainDropdown>
</template>
<style lang="">
    
</style>