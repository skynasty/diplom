import axios from '@/helpers/axiosInstance'

export const getAllApartments = async () => {
    const res =
        await axios.get(
            "/apartments"
        )
        console.log(res)
        return res.data
}