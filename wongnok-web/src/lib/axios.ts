import axios from 'axios'
import { getSession ,signIn } from 'next-auth/react'


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_PATH,
})

api.interceptors.request.use(async (config) => {
  const session = await getSession()
  config.headers.Authorization = `Bearer ${session?.accessToken || ''}`
  return config
})

api.interceptors.response.use(
  response => response,
  async error => {
    // ถ้า token หมดอายุ
    if (error.response?.status === 401) {
      const session = await getSession()
      // ถ้ามี refreshToken ให้เรียก endpoint refresh
      if (session?.refreshToken) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_PATH}/auth/refresh`,
            { refresh_token: session.refreshToken }
          )
          // สมมติว่า response มี accessToken ใหม่
          session.accessToken = res.data.accessToken
          // retry request เดิม
          error.config.headers.Authorization = `Bearer ${session.accessToken}`
          return api.request(error.config)
        } catch (refreshError) {
          // refresh ไม่สำเร็จ ให้ redirect ไป login
          signIn()
        }
      } else {
        // ไม่มี refreshToken ให้ login ใหม่
        signIn()
      }
    }
    return Promise.reject(error)
  }
)
