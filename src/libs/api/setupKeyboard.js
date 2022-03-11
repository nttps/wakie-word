import { reactive, computed, ref } from 'vue'
import { layouts } from '../../helpers/layouts'
import words from '../words'
import { statisticStore } from '../../stores/statistic'
import { splitWord, validateWord } from '../../helpers/utils'

export function setupKeyboard() {
    const keyboardData = reactive({
        layouts,
        key: layouts.Kedmanee.rows,
        keyShifted: layouts.Kedmanee.rowsShifted,
        shifted: false,
    })

    const currentKey = computed(() => (keyboardData.shifted ? keyboardData.keyShifted : keyboardData.key))
    const shiftedKey = computed(() => (keyboardData.shifted ? keyboardData.key : keyboardData.keyShifted))
    
    return {
        currentKey,
        shiftedKey,
        keyboardData
    }   
}

export function initData() {
    const epochMs = Math.round(new Date('2022/02/22').getTime()) // 22 02 2022
    const now = Date.now()
    const msInDay = 86400000
    const dateIndex = Math.floor((now - epochMs) / msInDay)
    const solution = words[dateIndex % words.length]
    const solutionLength = splitWord(solution).length
    const statistic = statisticStore()
    let attempts = computed(() => statistic.getAttempts(dateIndex) || [])

    let validations = reactive(attempts.value.map((word) => validateWord(word, solution)))
    const validation = validations.slice(-1)[0]

    let gameEnded = ref(!!statistic.win(dateIndex) || !!statistic.lose(dateIndex)) 

    const input = ref('')
    const splittedInput = computed(() => (splitWord(input.value)))
 
    const lose = ref(false)
    const win = ref(false)


    return {
        solution,
        statistic,
        attempts,
        validations,
        validation,
        gameEnded,
        splittedInput,
        input,
        lose,
        win,
        solutionLength,
        dateIndex
    }
}