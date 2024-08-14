import { request, HOSTNAME } from "./api"
export const useApiUsers = () => {
    const path = '/api/users'

    function index() {
        const url = HOSTNAME + path
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

    function me() {
        const url = HOSTNAME + '/api/me'
        return request('get', url, {}, true)
    }

    function login(params: {}) {
        const url = HOSTNAME + '/api/auth/login'
        return request('post', url, params, true)
    }

    return { index, store, show, update, destroy, me, login }
}
