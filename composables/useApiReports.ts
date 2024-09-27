import { request, HOSTNAME } from "./api"
export const useApiReports = () => {
    const path = '/api/reports'

    function bookingsByMonth(params: {}) {
        const url = HOSTNAME + path + '/bookingsByMonth'
        return request('post', url, params, true)
    }

    return { bookingsByMonth }
}
