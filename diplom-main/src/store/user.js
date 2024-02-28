import { defineStore } from 'pinia'
import * as api from '../services/user'
import { useApplicationStore } from './application'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null
  }),
  actions: {
    async getMe() {
      const user = await api.getMe()
      this.user = user
      return user
    },
    async updateMe(data) {
      this.user = data
      await api.updateMe(data)
    },
    async uploadAvatar(formData) {
      const URL = await api.uploadAvatar(formData)
      return URL
    },
    logout() {
      localStorage.removeItem('accessToken')
      this.user = null
      const applicationStore = useApplicationStore()
      applicationStore.clearApps()
    }
  }
})