
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'

interface SubState {
    attempts: []
    win?: boolean
    lose?: boolean
}

interface State {
    state: Record<string, SubState>
}

interface Store {
    data: Record<string, State>
}


let DATA: Store


export const statisticStore = defineStore('statistic', {
    state: () => ({
      data: useStorage('wakie-word', DATA),
    }),
    getters: {
        getAttempts: (state) => {
            return (index: string | number) => state.data[`${index}`]?.attempts
        },
        win: (state) => {
            return (index: any) => state.data[`${index}`]?.win
        },
        lose: (state) => {
            return (index: any) => state.data[`${index}`]?.lose
        }
    },
    actions: {
        /**
         * Add word to the statistic
         * @param {string} state
         * @param {string} word
         * @param {boolean} win
         * @param {boolean} lose
         */
        updateSubState(stateIndex: number, subIndex: number, word: string, win: boolean, lose: boolean) {

            let data = this.getSubstateAttempts(stateIndex) || []

            let attempts = [...data, word]
            
            let state = this.data[stateIndex]
            state[subIndex] = { attempts , win, lose }

        },
        getWin(index: string) {
            this.data[index].win = true
        },
        getLose(index: string) {
            this.data[index].lose = true
        }
    },
})
