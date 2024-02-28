import axios from '@/helpers/axiosInstance'

export const getMe = async () => {
    try {
        const res = await axios.get('/auth/me')
        return res.data
    } catch (error) {
        return Promise.reject(error)
    }
}

export const uploadAvatar = async (formData) => {
    try {
        const res = await axios.post('/upload', formData)
        return res.data.url
    } catch (error) {
        return Promise.reject(error)
    }
}

export const updateMe = async (data) => {
    try {
        const res = await axios.patch('/user/me', data)
        return res.data
    } catch (error) {
        return Promise.reject(error)
    }
}