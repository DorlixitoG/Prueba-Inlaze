"use client"

import { useAuth } from "@/contexts/AuthContext"
import { LoginForm } from "@/components/LoginForm"
import { Dashboard } from "@/components/Dashboard"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return user ? <Dashboard /> : <LoginForm />
}
