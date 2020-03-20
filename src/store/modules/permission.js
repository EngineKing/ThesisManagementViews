import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param urls
 * @param route
 */
function hasPermission(urls, route) {
  if (route.meta && route.meta.url) {
    return urls.some(url => route.meta.url.includes(url))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param urls
 */
export function filterAsyncRoutes(routes, urls) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(urls, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, urls)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, urls) {
    alert('生成路由')
    return new Promise(resolve => {
      let accessedRoutes
      accessedRoutes = filterAsyncRoutes(asyncRoutes, urls)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}