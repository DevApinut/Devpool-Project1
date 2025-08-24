import axios from 'axios'
import { getSession } from 'next-auth/react'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_PATH,
})

api.interceptors.request.use(async (config) => {
  const session = await getSession()
  config.headers.Authorization = `Bearer ${session?.accessToken || ''}`
  return config
})
