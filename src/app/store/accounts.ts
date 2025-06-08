import { defineStore } from 'pinia'

export interface Label {
  text: string
}

export type RecordType = 'LDAP' | 'Локальная'

export interface Account {
  id: string
  labels: Label[]
  type: RecordType
  login: string
  password: string | null
  isValid: boolean
}

export const useAccountStore = defineStore('accountStore', {
  state: () => ({
    accounts: [] as Account[]
  }),
  actions: {
    addAccount(account: Account) {
      this.accounts.push(account)
      this.saveToStorage() // сохраняем сразу
    },
    deleteAccount(id: string) {
      this.accounts = this.accounts.filter(acc => acc.id !== id)
      this.saveToStorage()
    },
    updateAccount(account: Account) {
      const index = this.accounts.findIndex(a => a.id === account.id)
      if (index !== -1) {
        this.accounts[index] = account
        this.saveToStorage()
      }
    },
    loadFromStorage() {
      const raw = localStorage.getItem('accounts')
      if (raw) {
        this.accounts = JSON.parse(raw)
      }
    },
    saveToStorage() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts))
    }
  }
})