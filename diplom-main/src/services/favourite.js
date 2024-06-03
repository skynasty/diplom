import axios from '@/helpers/axiosInstance'

export const getMyFavourites = async () => {
    try {
        const res = await axios.get('/favourite')
        return res.data
    } catch (error) {
        return Promise.reject(error)
    }
}

export const create = async (apartmentId) => {
    try {
        const res = await axios.post(`/favourite/${apartmentId}`)
        return res.data
    } catch (error) {
        return Promise.reject(error)
    }
}

export const remove = async (favouriteId) => {
    try {
        const res = await axios.delete(`/favourite/${favouriteId}`)
        return res.data
    } catch (error) {
        return Promise.reject(error)
    }
}