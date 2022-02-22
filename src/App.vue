<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import BoardGame from './components/BoardGame.vue'
</script>

<template>
  <main class="container mx-auto h-screen flex flex-col items-center">
      <header> WAKIE WORD</header>
      <BoardGame />
      <footer> FOOTER </footer>
  </main>
</template>

<style lang="postcss">
  header, footer {
    @apply py-4
  }
</style>