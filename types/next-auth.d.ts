import { DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    token: string
    user: {
      id: number
      email: string
      username: string
      isStaff: boolean
    } & DefaultSession["user"]
  }

  interface User {
    token: string
    user: {
      id: number
      email: string
      username: string
      is_staff: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: number
    email: string
    username: string
    isStaff: boolean
    token: string
  }
}