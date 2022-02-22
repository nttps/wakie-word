
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'

type Store = {
    data: Record<string, Day>
}
type Day = {
    attempts: any[]
    win?: boolean
    lose?: boolean
}

export const statisticStore = defineStore('statistic', {
    state: () => {    
        return useStorage('wakie-word-data', {
            data: {} 
        } as Store) 
    },
    getters: {
        attempts: (state) => {
            return (index: any) => state.data[`${index}`]?.attempts
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
         * @param {string} word
         * @param {string} attemps
         * @param {boolean} win
         * @param {boolean} lose
         */
        addWord(word: string, attemps: string, win: boolean, lose: boolean) {
          this.data[word] = { attemps , win, lose }
        },
    },
})
