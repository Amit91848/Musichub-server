import axios from "axios"

interface axiosInstanceInterface {
    baseURL: string,
    providerId?: string,
    accessToken?: string,
    refreshToken?: string,
    params?: boolean
}

export const createAxiosIntance = ({ accessToken, baseURL, params = false }: axiosInstanceInterface) => {
    if (!params) {
        return axios.create({
            baseURL: baseURL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        })
    } else {
        return axios.create({
            baseURL: baseURL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                part: 'snippet',
                mine: true
            }
        })
    }
}