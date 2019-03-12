import axios from '@/libs/api.request'

export const login = ({ name, telephone ,password }) => {
  const data = {
    key:'diuber2017',
    secret_key:'09e8b1b88e615f0d9650886977af33e9',
    name, 
    telephone,
    password
  }
  return axios.request({
    url: '/company/login/login',
    data,
    method: 'post'
  })
}

export const logout = () => {
  return axios.request({
    url: '/company/login/logout',
    method: 'post'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
