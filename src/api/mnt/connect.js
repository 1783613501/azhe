import request from '@/utils/request'

export function testDbConnect(data) {
  return request({
    url: 'database/testConnect',
    method: 'post',
    data
  })
}

export function testServerConnect(data) {
  return request({
    url: 'serverDeploy/testConnect',
    method: 'post',
    data
  })
}
