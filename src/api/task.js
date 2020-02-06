import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/task/list',
    method: 'get',
    params: query
  })
}
