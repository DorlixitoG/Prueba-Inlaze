"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Calendar, User, AlertCircle } from "lucide-react"
import { CreateTaskDialog } from "@/components/CreateTaskDialog"
import { TaskList } from "@/components/TaskList"
import { useToast } from "@/hooks/use-toast"
import type { Project, Task } from "@/types"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false)

  useEffect(() => {
    if (params.id && token) {
      fetchProject()
      fetchTasks()
    }
  }, [params.id, token])

  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:4000/projects/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load project",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching project:", error)
      toast({
        title: "Error",
        description: "Failed to load project",
        variant: "destructive",
      })
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:4000/tasks/project/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("🔍 Frontend - Tasks fetched:", data)
        setTasks(data)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (newTask: Task) => {
    console.log("🔍 Frontend - New task created:", newTask)
    setTasks([newTask, ...tasks])
    setShowCreateTaskDialog(false)
    toast({
      title: "Success",
      description: "Task created successfully",
    })
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    console.log("🔍 Frontend - Task updated:", updatedTask)
    console.log("🔍 Frontend - Current tasks before update:", tasks.length)

    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) => {
        // Comparar usando _id
        if (task._id === updatedTask._id) {
          console.log("✅ Frontend - Updating task:", task._id, "->", updatedTask.status)
          return { ...updatedTask, _id: updatedTask._id }
        }
        return task
      })

      console.log("🔍 Frontend - Tasks after update:", newTasks.length)
      return newTasks
    })
  }

  const handleTaskDeleted = (taskId: string) => {
    console.log("🔍 Frontend - Deleting task:", taskId)
    setTasks((prevTasks) => {
      const newTasks = prevTasks.filter((task) => task._id !== taskId)
      console.log("🔍 Frontend - Tasks after delete:", newTasks.length)
      return newTasks
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  console.log("🔍 Frontend - Task distribution:", {
    total: tasks.length,
    todo: todoTasks.length,
    inProgress: inProgressTasks.length,
    completed: completedTasks.length,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/")} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-500">{project.description}</p>
              </div>
            </div>
            <Button onClick={() => setShowCreateTaskDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tarea
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tareas</p>
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Por Hacer</p>
                  <p className="text-2xl font-bold text-gray-900">{todoTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <User className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En Progreso</p>
                  <p className="text-2xl font-bold text-gray-900">{inProgressTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completadas</p>
                  <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Badge variant="secondary" className="mr-2">
                {todoTasks.length}
              </Badge>
              Por Hacer
            </h3>
            <TaskList tasks={todoTasks} onTaskUpdated={handleTaskUpdated} onTaskDeleted={handleTaskDeleted} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Badge variant="secondary" className="mr-2">
                {inProgressTasks.length}
              </Badge>
              En Progreso
            </h3>
            <TaskList tasks={inProgressTasks} onTaskUpdated={handleTaskUpdated} onTaskDeleted={handleTaskDeleted} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Badge variant="secondary" className="mr-2">
                {completedTasks.length}
              </Badge>
              Completadas
            </h3>
            <TaskList tasks={completedTasks} onTaskUpdated={handleTaskUpdated} onTaskDeleted={handleTaskDeleted} />
          </div>
        </div>
      </main>

      <CreateTaskDialog
        open={showCreateTaskDialog}
        onOpenChange={setShowCreateTaskDialog}
        onTaskCreated={handleTaskCreated}
        projectId={params.id as string}
      />
    </div>
  )
}
