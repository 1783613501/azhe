import request from '@/utils/request'

export function getAllJob() {
  const params = {
    page: 0,
    size: 9999,
    enabled: true
  }
  return request({
    url: 'job',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'job',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'job',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'job',
    method: 'put',
    data
  })
}

export default { add, edit, del }
