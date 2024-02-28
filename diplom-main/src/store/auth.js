import { defineStore } from 'pinia'
import * as api from '../services/auth'

export const useAuthStore = defineStore('authStore', {
    actions: {
        async onRegister(data) {
            await api.register(data)

        },
        async onLogin(data) {
            await api.login(data)

        },
        logout() {
            localStorage.removeItem('accessToken')
            this.user = null
        }
    }
})