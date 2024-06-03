import { defineStore } from 'pinia'
import * as api from '../services/apartments'

export const useApartmentsStore = defineStore('apartmentsStore', {
    state: () => ({
        apartments: []
    }),
    actions: {
        async getAllApartments() {
            const apartments = await api.getAllApartments()
            this.apartments = apartments
        },
        async createApartment(data) {
            const apartment = await api.createApartment(data)
            this.apartments.push(apartment)
        },
        async deleteApartment(id) {
            await api.deleteApartment(id)
            const idx = this.apartments.findIndex((apartment) => apartment._id === id)
            if (idx !== -1) {
                this.apartments.splice(idx, 1)
            }
        },
        async updateApartment(data) {
            const apartment = await api.updateApartment(data)
            const idx = this.apartments.findIndex((apartment) => apartment._id === data._id)
            if (idx !== -1) {
                this.apartments[idx] = apartment
            }
        },
    }
})