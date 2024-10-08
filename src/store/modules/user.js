import { login, getInfo, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.pwd, userInfo.code, userInfo.uuid).then(res => {
          console.log(res)
          if(res.code == 0){
            reject(res.msg)
          }
          localStorage.setItem("userName",res.data.userName);
          localStorage.setItem("userDetail", JSON.stringify(res.data));
          setToken(getToken(), rememberMe)
          commit('SET_TOKEN', getToken())
          setUserInfo(res.data, commit)
          // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
          commit('SET_LOAD_MENUS', true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      setUserInfo({}, commit)
      // returnnew Promise((resolve, reject) => {
      //   getInfo().then(res => {
      // setUserInfo({}, commit)
      //     resolve(res)
      //   }).catch(error => {
      //     reject(error)
      //   })
      // })
    },
    // 登出
    LogOut({ commit }) {
      removeToken();
      // return new Promise((resolve, reject) => {
      //   logout().then(res => {
      //     logOut(commit)
      //     resolve()
      //   }).catch(error => {
      //     logOut(commit)
      //     reject(error)
      //   })
      // })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const logOut = (commit) => {
  commit('SET_TOKEN', '')
  commit('SET_ROLES', [])
  removeToken()
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  // if (res.roles.length === 0 || !res.roles) {
  //   commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  // } else {
  //   commit('SET_ROLES', res.roles)
  // }
  commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT']);
  commit('SET_USER', res);
}

export default user
