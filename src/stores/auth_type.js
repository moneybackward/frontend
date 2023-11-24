import { defineStore } from 'pinia'

export const useAuthTypeStore = defineStore('auth_type', {
  state: () => ({
    auth_type: "login"
  }),

  getters: {
    getAuthType() {
      return this.auth_type
    },
    getPrompt() {
      if (this.auth_type == "login") {
        return "Don't have an account?"
      } else {
        return "Already have an account?"
      }
    }
  },

  actions: {
    toggle() {
      if (this.auth_type == "login") {
        this.auth_type = "register"
      } else {
        this.auth_type = "login"
      }
    }
  }
})
