import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: qs.stringify({
      username: data.username,
      password: data.password
    })
  })
}

export function getInfo(token) {
  return request({
    url: '/user/getInfo',
    method: 'post',
    data: qs.stringify({
      token: token
    })
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
