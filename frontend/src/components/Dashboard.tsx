"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Plus, LogOut, FolderOpen } from "lucide-react"
import { ProjectList } from "./ProjectList"
import { CreateProjectDialog } from "./CreateProjectDialog"

interface Project {
  _id: string
  name: string
  description: string
  ownerId: string
  members: string[]
  createdAt: string
  updatedAt: string
}

export function Dashboard() {
  const { user, logout } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:4000/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectCreated = (newProject: Project) => {
    setProjects([newProject, ...projects])
    setShowCreateDialog(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <FolderOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Projects</h2>
          <ProjectList projects={projects} loading={loading} onRefresh={fetchProjects} />
        </div>
      </main>

      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  )
}
