<script setup>

import BoardGame from '../components/BoardGame.vue'
import StateGame from '../components/StateGame.vue'


import { ref } from 'vue'
import { accountService } from '../services';

const account = ref(null);
accountService.account.subscribe(x => account.value = x);

</script>


<template lang="">
    <div>
       <StateGame v-if="account"/>
       <BoardGame v-else />
      
    </div>
</template>

<style lang="">
    
</style>