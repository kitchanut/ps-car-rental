import axios from 'axios'
const config = useRuntimeConfig();
export const HOSTNAME = config.public.serverUrl

export async function request(method: string, url: string, data: {}, auth = false,) {
    const token = localStorage.getItem('token')
    const headers: any = {}
    if (token) {
        headers['authorization'] = token
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
        console.log('api-error', error)
        // if (error.response.status === 401) {
        //     localStorage.removeItem('token')
        //     window.location.href = '/login'
        // }
        return error
    }
}
