import axios from 'axios'
const config = useRuntimeConfig();
export const HOSTNAME = config.public.serverUrl

export async function request(method: string, url: string, data: {}, auth = false,) {
    const token = localStorage.getItem('token')
    const headers: any = {}
    if (token) {
        headers['Authorization'] = 'Bearer ' + token
    }
    try {
        const response = await axios({
            method,
            url,
            data,
            headers,
        })
        return response
    } catch (error) {
        return error
    }
}
