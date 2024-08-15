import { request, HOSTNAME } from "./api"
export const useApiUploads = () => {
  const path = '/api/upload'

  function index(id: Number, type: String) {
    const url = HOSTNAME + path + `?id=${id}&type=${type}`
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
    return request('post', url, params, true)
  }

  function destroy(id: number) {
    const url = HOSTNAME + path + '/' + id
    return request('delete', url, {}, true)
  }

  return { index, store, show, update, destroy }
}
