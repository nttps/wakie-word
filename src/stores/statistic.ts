
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'


interface Store {
    data: Record<string, State>
}
interface State {
    attempts: []
    win?: boolean
    lose?: boolean
}

let DATA: Store = {
    data: {}
}

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
         * @param {string} index
         * @param {string} word
         * @param {boolean} win
         * @param {boolean} lose
         */
        updateData(index: string, word: string, win: boolean, lose: boolean) {

            let data = this.getAttempts(index) || []

            let attempts = [...data, word]
            
            this.data[index] = { attempts , win, lose }
        },

        /**
         * Add word to the statistic
         * @param {string} state
         * @param {string} word
         * @param {boolean} win
         * @param {boolean} lose
         */
         updateState(state: string, word: string, win: boolean, lose: boolean) {

            let data = this.getAttempts(state) || []

            let attempts = [...data, word]
            
            this.data[state] = { attempts , win, lose }
        },
        getWin(index: string) {
            this.data[index].win = true
        },
        getLose(index: string) {
            this.data[index].lose = true
        }
    },
})

