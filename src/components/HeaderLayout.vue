<script setup>
import MenuProfile from './MenuProfile.vue';
import { ref } from 'vue';
import { accountService } from '../services';
const account = ref(null);

accountService.account.subscribe(x => account.value = x);

</script>

<template lang="">
    <header class="flex justify-between items-center px-4 text-white bg-[#2a2548] dark:bg-amber-600">
      <!-- <div></div> -->
      <div>WAKIE WORD</div>
      <div class="flex items-center">
        <menu-profile v-if="account"></menu-profile>
        <a v-if="!account" href="#" @click="accountService.login">Sign In</a> 
      </div>
    </header>
</template>