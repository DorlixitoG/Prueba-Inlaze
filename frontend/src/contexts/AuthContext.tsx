"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  _id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role?: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    if (savedToken) {
      setToken(savedToken)
      fetchProfile(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProfile = async (authToken: string) => {
    try {
      const response = await fetch("http://localhost:4000/auth/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        localStorage.removeItem("token")
        setToken(null)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      localStorage.removeItem("token")
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    console.log("🔍 AuthContext - Login attempt:", { email, password: "***" })

    const response = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("❌ AuthContext - Login failed:", errorData)
      throw new Error("Login failed")
    }

    const data = await response.json()
    console.log("✅ AuthContext - Login success:", data)
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem("token", data.token)
  }

  const register = async (email: string, password: string, name: string, role = "member") => {
    console.log("🔍 AuthContext - Register attempt:", { email, name, role, password: "***" })

    const response = await fetch("http://localhost:4000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name, role }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("❌ AuthContext - Register failed:", errorData)
      throw new Error("Registration failed")
    }

    const data = await response.json()
    console.log("✅ AuthContext - Register success:", data)

    // Auto login after registration
    await login(email, password)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
