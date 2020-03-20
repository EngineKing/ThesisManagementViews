import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { asyncRoutes, constantRoutes } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    addRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { loginUserVO } = response
        commit('SET_TOKEN', loginUserVO.token)
        // commit('SET_NAME', loginUserVO.user.account)
        // commit('SET_AVATAR', avatar)
        setToken(loginUserVO.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { urls } = response
        if (!urls) {
          reject('Verification failed, please Login again.')
        }
        commit('SET_NAME', 'admin')
        resolve(urls)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  generateRoutes({ commit }, urls) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, urls)
      commit('SET_ROUTES', accessedRoutes)
      // console.log(accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

function filterAsyncRoutes(routes, urls) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    // console.log('has:' + hasPermission(urls, tmp))
    if (hasPermission(urls, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, urls)
      }
      res.push(tmp)
    }
  })
  return res
}

function hasPermission(urls, route) {
  // console.log('urls:' + urls)
  // console.log('route:' + route.meta.url)
  if (route.meta && route.meta.url) {
    return urls.some(url => route.meta.url.includes(url))
  } else {
    return true
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

