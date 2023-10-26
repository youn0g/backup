import { login, register, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
// import { reject, resolve } from 'core-js/fn/promise'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
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
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { email, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        email: email.trim(),
        password: password.trim()
        // grant_type: 'password',
        // client_id: 'client',
        // client_secret: '123456'
      }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user register
  register({ commit }, userInfo) {
    const { name, email, password } = userInfo
    return new Promise((resolve, reject) => {
      register({ name, email, password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
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
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // TODO:
  // query all users
  queryAllUsers({ commit, state }) {
    return new Promise((resolve, reject) => {
      this.queryAllUsers(state.token).then(response => {
        if (response.code === 20000) {
          const pageNum = response.data.pageNum
          const pageSize = response.data.pageSize
          const userList = response.data.list
          // 将返回的数据更新到 state
          commit('SET_USER_LIST', userList)
          commit('SET_PAGE_NUM', pageNum)
          commit('SET_PAGE_SIZE', pageSize)

          resolve(userList)
        } else {
          reject(response.msg)
        }
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
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

