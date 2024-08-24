import { request, HOSTNAME } from "./api"
export const useApiBookings = () => {
    const path = '/api/bookings'

    function index(queryString: string) {
        const url = HOSTNAME + path + queryString ?? ''
        return request('get', url, {}, true)
    }

    function store(params: {}) {
        const url = HOSTNAME + path
        return request('post', url, params, true)
    }

    function show(id: number) {
        const url = HOSTNAME + path + '/' + id
        return request('get', url, {}, true)
    }

    function update(id: number, params: {}) {
        const url = HOSTNAME + path + '/' + id
        return request('put', url, params, true)
    }

    function destroy(id: number) {
        const url = HOSTNAME + path + '/' + id
        return request('delete', url, {}, true)
    }

    function deposit(params: {}) {
        const url = HOSTNAME + path + '/deposit'
        return request('post', url, params, true)
    }

    return { index, store, show, update, destroy, deposit }
}
