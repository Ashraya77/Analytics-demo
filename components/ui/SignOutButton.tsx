"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-5 py-2 text-sm rounded-lg bg-secondary hover:bg-muted text-secondary-foreground border border-border transition-colors"
    >
      Sign out
    </button>
  )
}
