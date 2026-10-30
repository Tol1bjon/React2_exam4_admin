import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export const saveToken = (token: string) => {
  localStorage.setItem('token', token)
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const removeToken = () => {
  localStorage.removeItem('token')
}

export const axiosRequest = axios.create({
  baseURL: import.meta.env.VITE_API,
})

axiosRequest.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

axiosRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()

      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }

    return Promise.reject(error)
  },
)



export const GetUser = () => {
    const token = getToken()

    if(!token) return null

    try {
        const decoded = jwtDecode(token)
        return decoded
        console.log(decoded)
    } catch (error) {
        console.log(error)
    }
}
