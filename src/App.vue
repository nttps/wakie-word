<script setup>

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import HeaderLayout from './components/HeaderLayout.vue'
import { container as ModalContainer } from "jenesius-vue-modal"
import FooterLayout from './components/FooterLayout.vue';

</script>

<template>
    <HeaderLayout />
    <router-view class="container mx-auto flex flex-col items-center main"></router-view>
    <FooterLayout />
    <ModalContainer />
</template>

<style lang="postcss">
.main {
  height: calc(100vh - 96px);
}
 
</style>