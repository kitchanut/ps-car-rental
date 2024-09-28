import { request, HOSTNAME } from "./api"
export const useApiDashboards = () => {
    const path = '/api/dashboard'

    function card(params: {}) {
        const url = HOSTNAME + path + '/card'
        return request('post', url, params, true)
    }

    function bookingByMonth(params: {}) {
        const url = HOSTNAME + path + '/bookingByMonth'
        return request('post', url, params, true)
    }


    return { card, bookingByMonth }
}
