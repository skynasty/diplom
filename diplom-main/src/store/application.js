import { defineStore } from 'pinia'
import * as api from '../services/applications'

export const useApplicationStore = defineStore('applicationStore', {
  state: () => ({
    applications: []
  }),
  actions: {
    async getAllApplications() {
      const applications = await api.getAllApplications()
      this.applications = applications
      return applications
    },
    async getMyApplications() {
        const applications = await api.getMyApplications()
        this.applications = applications
        return applications
      },
    async createApplication(data) {
        const application = await api.createApplication(data)
        console.log(application)
        this.applications.push(application)
        return application
      },
      async changeStatus(data) {
        const resData = await api.changeStatus(data)
        const application = this.applications.find((app) => app._id === resData._id)
        application.status = resData.status
        return resData
      },
      async delete(_id) {
        await api.deleteApp(_id)
        const applicationIndex = this.applications.findIndex((app) => app._id === _id)
        if(applicationIndex !== -1 ){
          this.applications.splice(applicationIndex, 1)
        }
      },
      clearApps() {
        this.applications = []
      }
  }
})