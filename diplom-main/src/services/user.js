import axios from '@/helpers/axiosInstance'

export const getMe = async () => {
    try {
        const res = await axios.get('/auth/me')
        return res.data
    } catch (error) {
        return Promise.reject(error)
    }
}

export const uploadFile = async (formData) => {
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

export const getAllUsers = async () => {
    const res =
        await axios.get(
            "/users-list"
        )
    return res.data
}

export const deleteUser = async (id) => {
    const res =
        await axios.delete(
            `/users/${id}`
        )
    return res.data
}

export const changeRole = async (id, role) => {
    await axios.patch(
        `/users/${id}/role`, { role }
    )
}

export const changePassword = async (id, password) => {
    const res =
        await axios.patch(
            `/users/${id}/password`, { password }
        )
    return res.data
}