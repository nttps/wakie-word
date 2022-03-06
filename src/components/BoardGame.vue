<script setup>
import { reactive, ref, onMounted, nextTick, watchEffect } from 'vue'
import words from '../libs/words'
import { splitWord, validateWord, generateAlphabetStateMap, CharState, colors } from '../helper/utils'
import { setupKeyboard, initData } from '../libs/api/setupKeyboard'
import { openModal } from "jenesius-vue-modal"
import Modal from './Modal.vue';

const { keyboardData, currentKey, shiftedKey } = setupKeyboard()

const { dateIndex, solution, statistic, attempts, gameEnded, input, lose, win, splittedInput, solutionLength, dict } = initData()

const attemptLimit = 6
const attemptsLength = attempts.value.length

let validations = reactive(attempts.value.map((word) => validateWord(word, solution)))
const validation = validations.slice(-1)[0]
let alertDelay = 1500
const alphabetStateMap = ref([]);
alphabetStateMap.value = generateAlphabetStateMap([...currentKey.value, ...shiftedKey.value].flat(),validations.flat())

const copied = ref(false)

function valid(validation, validations) {

  if (validation) {
    // if all validation is correct
    let allMatched = true
    validation.forEach((v) => {
      if (v.correct !== CharState.Correct) {
        allMatched = false
      }
    })
    if (allMatched) {
      if (!gameEnded.value) {
        const score = attemptLimit + 1 - validations.length
        console.log({ score })
      }
  
      setTimeout(() => {
        showModal("คุณชนะแล้ว!")
        gameEnded.value = true
        statistic.getWin(dateIndex)
      }, alertDelay)
    } else if (attemptsLength >= attemptLimit) {
      if (!gameEnded.value) {
        const score = 0
        console.log({ score })
      }

      setTimeout(() => {
        showModal(`คุณแพ้แล้ว คำประจำวันนี้คือ "${solution}"`)
        gameEnded.value = true
        statistic.getLose(dateIndex)
      }, alertDelay)
    }

  }
}

onMounted(async () => {
  valid(validation, validations)
})

async function submit() {

  if (gameEnded.value) {
    return
  }

  // Check if the length is valid
  if (splitWord(input.value).length != solutionLength) {
    showModal("ใส่คำตอบเดี๋ยวนี้ !!~")
    return
  }

    // Check if the word is in the dict
  if (!wordExists(input.value)) {
    showModal("พิมพ์อะไรมา ?")
    return
  }


  const validation = validateWord(input.value, solution)
  statistic.updateData(dateIndex, input.value, win.value, lose.value)

  validations = attempts.value.map((word) => validateWord(word, solution))

  alphabetStateMap.value = generateAlphabetStateMap([...currentKey.value, ...shiftedKey.value].flat(),validations.flat())

  valid(validation, validations)
  input.value = ""

  await nextTick()

  document.getElementById('boardGame').scrollTop = document.getElementById('boardGame').scrollHeight

}

function showModal(title) {
  openModal(Modal, {
      title: title
  });
}

watchEffect(attempts.value, console.log(`attempts`))
watchEffect(alphabetStateMap, console.log(`alphabetStateMap`))

function inputKey(alphabet) {

  if (gameEnded.value) {
      return
  }

  if(!alphabet.match(/^[ก-๙]+$|⇧|⬅|ตกลง|Enter/u)) return false

  if (alphabet === '⇧') {
    keyboardData.shifted = !keyboardData.shifted
  } else if (alphabet === '⬅') {
    input.value = input.value.slice(0, -1)
  } else if (alphabet === 'ตกลง' || alphabet === 'Enter') {
    submit()
  } else if (
  // ตรวจสอบก่อนด้วยว่าสามารถใส่ตัวอักษรเพิ่มได้หรือไม่
  // \u0E31\u0E34-\u0E3A\u0E47-\u0EC4 คือพวกนสระบนล่างหรือวรรณยุกต์
    alphabet.match(/[\u0E31\u0E34-\u0E3A\u0E47-\u0EC4]/) ||
    splittedInput.value.length < solutionLength
  ) {  
    input.value += alphabet
    input.value = input.value.replace(/[^ก-๙]/g, "")
    keyboardData.shifted = false
  }
}

function wordExists(input) {
    if (dict.includes(input)) {
      return true
    }
    for (let i = 2; i < input.length - 1; i++) {
      const left = input.slice(0, i)
      const right = input.slice(i)

      console.log('left' , left);
      console.log('right' , right);
      if (dict.includes(left) && dict.includes(right)) {
        return true
      }
    }

    // if (words.includes(input)) {
    //   return true
    // }

    return false
}

function isMobile() {
   if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
     return true
   } else {
     return false
   }
}

document.addEventListener("keydown", ({ key }) => {

  if (key == "Backspace") {
    inputKey("⬅")
  } else if (key == "Enter") {
    inputKey("ตกลง")
  } else {
    inputKey(key)
  }
})

</script>

<template lang="">
  <div class="board-game">    
    <div class="board-continer">
      <div id="boardGame" class="board-inner">
          <div v-for="i in attempts" :key="i" class="flex justify-center my-1">
            <div v-for="{ correct, char } , idx in validateWord(i, solution)" :key="idx" class="empty" :class="colors[correct] || 'bg-white'">{{ char }}</div>
          </div>

          <div class="flex justify-center my-1">
            <div
    v-for="(_, i ) in new Array(solutionLength).fill(0)" :key="i"
                  class="empty"
                >
                  {{ splittedInput[i] || "" }}
                </div>
          </div>
          <div v-for="v, i in new Array(Math.max(0, attemptLimit - attempts.length - 1))" :key="i" class="flex justify-center my-1" >
            <div v-for="_ in new Array(solutionLength).fill(0)" :key="_" class="empty" />
          </div>
      </div>
    </div>
    <div class="keyboard-container">
      <input
        v-if="!isMobile()"
        v-model="input"
        type="text"
        class="keyboard-type"
        placeholder="คลิกที่นี่เพื่อใช้คีย์บอร์ด"
        :disable="!gameEnded"
        @keydown.prevent=""
      />
      <div class="keyboard">
        <div
          v-for="row, rowIndex in currentKey"
          :key="rowIndex"
          class="key-row"
        >
          
            <button
             v-for="alphabet, alphabetIndex in row"
              :key="alphabetIndex"
              :class="[{'border-gray-500': '⇧⬅'.includes(alphabet) || alphabet === 'ตกลง' , 'button-enter': alphabet === 'ตกลง'}, colors[alphabetStateMap[alphabet]] ]"
              class="key"
              @click="inputKey(alphabet)"

            >
              <div
                class="no-shift"
              >
                {{ alphabet }}
              </div>

              <!-- Inverse character -->
              <div
                v-if="currentKey[rowIndex][alphabetIndex] !== shiftedKey[rowIndex][alphabetIndex]"
                :class="colors[alphabetStateMap[shiftedKey[rowIndex][alphabetIndex]]]"
                class="shift"
              >
                {{ shiftedKey[rowIndex][alphabetIndex] }}
              </div>
            </button>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="postcss">
  .board-game {
    @apply w-full flex flex-col justify-between pt-4;
    height: calc(100vh - 96px);
  }
  .board-continer {
    @apply items-center justify-center overflow-y-auto
  }

  .keyboard {
    @apply w-full my-4 
  }

  .keyboard-container {
    @apply px-4 w-full max-w-2xl mx-auto
  }
  .keyboard-type {
    @apply w-full sm:w-[400px] block border mb-1 px-6 py-2 mx-auto text-center dark:bg-gray-500 dark:text-white dark:placeholder:text-white
  }

  .keyboard .key-row {
    @apply w-full flex touch-manipulation
  }
  .keyboard .key-no-shift {
      @apply h-10;
  }

  .keyboard .key {
      @apply relative px-1 m-0.5 h-16 flex-grow border-solid border-2 flex text-xl font-sans font-bold rounded text-black dark:text-white;
  }
  .keyboard .key.button-enter {
    @apply w-12 md:w-20
  }
  .keyboard .key .no-shift {
      @apply absolute bottom-2 right-1 p-0.5
  }

  .keyboard .key .shift {
      @apply absolute top-1 left-1 border-solid rounded text-sm leading-4 p-0.5 w-4
  }
  .empty {
    @apply w-12 h-12 md:w-14 md:h-14 placeholder:border-solid border-2 flex items-center justify-center mx-0.5 text-2xl md:text-3xl font-bold rounded dark:bg-[#211e34] dark:text-white
  }
 
</style>
