import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/topic/list',
    method: 'get',
    params: query
  })
}
