<script setup>
import { reactive, computed, ref } from 'vue'
import { layouts } from '../helper/layouts'
import words from '../libs/words'
import { statisticStore } from '../stores/statistic'
import { splitWord, validateWord, generateAlphabetStateMap, CharState } from '../helper/utils'

const keyboardData = reactive({
  layouts,
  key: layouts.Kedmanee.rows,
  keyShifted: layouts.Kedmanee.rowsShifted,
  shifted: false,
})
const statistic = statisticStore()
const epochMs = 1642525200000
const now = Date.now()
const msInDay = 86400000
const dateIndex = Math.floor((now - epochMs) / msInDay)
const attemptLimit = 6


let input = ref('')
let solution = words[dateIndex % words.length]
let attempts = statistic.attempts(dateIndex) || []
let validations = attempts.map((word) => validateWord(word, solution))
let gameEnded = !!statistic.win(dateIndex) || !!statistic.lose(dateIndex)
let attemptsContainer
let copied = ref(false)
let lose = ref(false)
let win = ref(false)


function submit() {
  alert('Tadaaa ~~')
}

const attemptsLength = attempts.length
const solutionLength = splitWord(solution).length
const currentKey = computed(() => (keyboardData.shifted ? keyboardData.keyShifted : keyboardData.key))
const shiftedKey = computed(() => (keyboardData.shifted ? keyboardData.key : keyboardData.keyShifted))


const alphabetStateMap = generateAlphabetStateMap(
    [...currentKey.value, ...shiftedKey.value].flat(),
    validations.flat()
)

const splittedInput = computed(() => (splitWord(input.value)))

statistic.addWord(dateIndex, attempts, win.value, lose.value)

function inputKey(alphabet) {

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

function isMobile() {
   if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
     return true
   } else {
     return false
   }
 }

const colors = {
  [CharState.Correct]: "bg-green-500 border-green-500 text-white",
  [CharState.OutOfPlace]: "bg-yellow-500 border-yellow-500 text-white",
  [CharState.Wrong]: "bg-gray-500 border-gray-500 text-white dark:bg-gray-700 dark:text-white",
  [CharState.NotUsed]: "bg-white text-black dark:bg-gray-500 dark:text-white",
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
      <div class="board-inner">
          <div v-for="i in attempts" :key="i" class="flex justify-center my-1">
            <div v-for="{ correct, char } , idx in validateWord(i, solution)" :key="idx" class="empty" :class="colors[correct] || 'bg-white'">{{ char }}</div>
          </div>

          <div v-if="!gameEnded" class="flex justify-center my-1">
            <div
    v-for="(_, i ) in new Array(solutionLength).fill(0)" :key="i"
                  class="empty"
                >
                  {{ splittedInput[i] || "" }}
                </div>
          </div>
          <div v-for="v, i in new Array(Math.max(0, attemptLimit - attempts.length - 1))" :key="i" class="flex justify-center my-1">
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
             :class="{ 'border-gray-500': '⇧⬅'.includes(alphabet) || alphabet === 'ตกลง' , 'button-enter': alphabet === 'ตกลง'}"
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
    @apply w-full flex flex-col;
    height: calc(100vh - 112px);
  }
  .board-continer {
    @apply grow items-center justify-center overflow-y-auto flex
  }

  .keyboard {
    @apply w-full my-4 px-1
  }

  .keyboard-container {
    @apply mx-auto w-full max-w-2xl
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
    @apply w-14 md:w-24
  }
  .keyboard .key .no-shift {
      @apply absolute bottom-2 right-1 p-0.5
  }

  .keyboard .key .shift {
      @apply absolute top-1 left-1 border-solid rounded text-sm leading-4 p-0.5 w-4
  }
  .empty {
    @apply w-14 h-14 placeholder:border-solid border-2 flex items-center justify-center mx-0.5 text-3xl font-bold text-white rounded dark:bg-[#211e34] dark:text-white
  }
 
</style>
