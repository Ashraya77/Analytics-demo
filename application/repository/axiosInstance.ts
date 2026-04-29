import axios from "axios"
import { getSession, signOut } from "next-auth/react"

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// Request interceptor — attach token
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      signOut({ callbackUrl: "/login" })
    }

    if (status === 403) console.error("Forbidden:", error.response?.data?.message)
    if (status === 404) console.error("Not found:", error.response?.data?.message)
    if (status === 500) console.error("Server error:", error.response?.data?.message)

    return Promise.reject(error)
  }
)



export default apiClient