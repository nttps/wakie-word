<template>
  <div class="flex justify-center">
    <div class="relative">
      <div v-if="open" class="fixed inset-0" @click="open = false"></div>
      <slot :open="open" :toggleOpen="toggleOpen"></slot>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue'

const open = ref(false)

function toggleOpen() {
    open.value = !open.value;
}
</script>