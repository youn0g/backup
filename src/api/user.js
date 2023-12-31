import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 查询所有用户信息
// data: {search}
export function query(data) {
  return request({
    url: '/user/query',
    method: 'get',
    data
  })
}

// 查询当前用户信息
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: '/user/{id}',
    method: 'delete'
  })
}

// 修改用户基本信息
// data: {name, email}
export function updateInfo(data) {
  return request({
    url: 'user',
    method: 'put',
    data
  })
}

// 管理员修改用户密码
// data: newPassword
export function changePassword(data) {
  return request({
    url: '/root/password',
    method: 'put',
    data
  })
}

// 发送验证码
export function sendVerifyCode(email) {
  return request({
    url: '/email/sendCode/{email}',
    method: 'get'
  })
}

// 当前用户修改自身密码
export function changeCurrentPassword({ oldPassword, newPassword }) {
  const data = { oldPassword, newPassword }
  return request({
    url: '/user/password',
    method: 'put',
    data
  })
}
