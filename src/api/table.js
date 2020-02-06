import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/table/userList',
    method: 'get',
    params
  })
}

export function getDepartmentList(params) {
  return request({
    url: 'table/departmentList',
    method: 'get',
    params
  })
}
