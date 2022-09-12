import Cookies from 'js-cookie'
// 获取cookie里面的数据
export const getCookie = (key) => {
  return Cookies.get(key)
}

/**
 * 存储数据
 */
export const setItem = (key, value) => {
  // 将数组、对象类型的数据转化为 JSON 字符串进行存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

/**
 * 获取数据
 */
export const getItem = (key) => {
  const data = window.localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

/**
 * 删除数据
 */
export const removeItem = (key) => {
  window.localStorage.removeItem(key)
}
/**
 * 存储数据session
 */
export const setSessionItem = (key, value) => {
  // 将数组、对象类型的数据转化为 JSON 字符串进行存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.sessionStorage.setItem(key, value)
}

/**
 * 获取数据session
 */
export const getSessionItem = (key) => {
  const data = window.sessionStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

/**
 * 删除数据session
 */
export const removeSessionItem = (key) => {
  window.sessionStorage.removeItem(key)
}
/**
 * 删除所有session数据
 */
export const removeSessionAllItem = () => {
  window.sessionStorage.clear()
}
/**
 * 删除所有数据
 */
export const removeAllItem = () => {
  window.localStorage.clear()
}
