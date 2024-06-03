import axios from '@/helpers/axiosInstance'


export const register = async (data) => {
    try {
        const res =
            await axios.post(
                "/auth/register",
                data
            )
        console.log(res)
        return res.data
    } catch (error) {
        return Promise.reject(error)
    }
}

export const login = async (data) => {
    try {
        const res =
            await axios.post(
                "/auth/login",
                data
            )
        console.log(res)
        localStorage.setItem('accessToken', res.data.token)
        return res.data
    } catch (error) {
        return Promise.reject(error)
    }
}

export const getMe = async () => {
    try {
        const token = localStorage.getItem('accessToken')
        if (!token)
            return
        const res =
            await axios.get(
                "/auth/me"
            )
        console.log(res)
        return res.data
    } catch (error) {
        return Promise.reject(error)
    }
} 