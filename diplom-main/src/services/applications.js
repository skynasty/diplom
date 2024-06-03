import axios from '@/helpers/axiosInstance'

export const getAllApplications = async () => {
    const res =
        await axios.get(
            "/applications"
        )
        console.log(res)
        return res.data
}

export const getMyApplications = async () => {
    const res =
        await axios.get(
            "/my-applications"
        )
        console.log(res)
        return res.data
}

export const createApplication = async (data) => {
    const res =
        await axios.post(
            "/applications",
            data
        )
        console.log(res)
        return res.data
}

export const changeStatus = async (data) => {
    const res =
        await axios.patch(
            "/applications",
            data
        )
        console.log(res)
        return res.data
}

export const deleteApp = async (id) => {
    const res =
        await axios.delete(
            `/applications/${id}`
        )
        console.log(res)
        return res.data
}

