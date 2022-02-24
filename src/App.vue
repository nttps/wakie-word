<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import BoardGame from './components/BoardGame.vue'
import HeaderLayout from './components/HeaderLayout.vue'
import { container as ModalContainer } from "jenesius-vue-modal"
import FooterLayout from './components/FooterLayout.vue';
</script>

<template>
    <HeaderLayout />
    <main class="container mx-auto flex flex-col items-center">
      <BoardGame />
    </main>
    <FooterLayout />
    <ModalContainer />
</template>

<style lang="postcss">
</style>