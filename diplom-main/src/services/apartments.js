import axios from '@/helpers/axiosInstance'

export const getAllApartments = async () => {
    const res =
        await axios.get(
            "/apartments"
        )
    console.log(res)
    return res.data
}

export const createApartment = async (data) => {
    const res =
        await axios.post(
            "/apartments", data
        )
    console.log(res)
    return res.data
}

export const deleteApartment = async (id) => {
    await axios.delete(
        `/apartments/${id}`
    )
}

export const updateApartment = async (data) => {
    const res =
        await axios.patch(
            "/apartments", data
        )
    console.log(res)
    return res.data
}