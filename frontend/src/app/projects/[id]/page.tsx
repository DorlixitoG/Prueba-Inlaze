"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Calendar, User, AlertCircle, Search, Filter, X } from "lucide-react"
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
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false)
  const [users, setUsers] = useState<any[]>([])

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [dueDateFilter, setDueDateFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (params.id && token) {
      fetchProject()
      fetchTasks()
      fetchUsers()
    }
  }, [params.id, token])

  // Aplicar filtros cuando cambien los criterios o las tareas
  useEffect(() => {
    applyFilters()
  }, [allTasks, searchTerm, statusFilter, priorityFilter, assigneeFilter, dueDateFilter])

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
        setAllTasks(data)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const applyFilters = () => {
    let filtered = [...allTasks]

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (task) => task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search),
      )
    }

    // Filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    // Filtro por prioridad
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    // Filtro por asignado
    if (assigneeFilter !== "all") {
      filtered = filtered.filter((task) => {
        const assignedUsers = Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo]
        return assignedUsers.includes(assigneeFilter)
      })
    }

    // Filtro por fecha límite
    if (dueDateFilter !== "all") {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      filtered = filtered.filter((task) => {
        const dueDate = new Date(task.dueDate)

        switch (dueDateFilter) {
          case "overdue":
            return dueDate < today && task.status !== "completed"
          case "today":
            return dueDate.toDateString() === today.toDateString()
          case "tomorrow":
            return dueDate.toDateString() === tomorrow.toDateString()
          case "this_week":
            return dueDate >= today && dueDate <= nextWeek
          case "completed":
            return task.status === "completed"
          default:
            return true
        }
      })
    }

    setFilteredTasks(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPriorityFilter("all")
    setAssigneeFilter("all")
    setDueDateFilter("all")
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (searchTerm.trim()) count++
    if (statusFilter !== "all") count++
    if (priorityFilter !== "all") count++
    if (assigneeFilter !== "all") count++
    if (dueDateFilter !== "all") count++
    return count
  }

  const getUserName = (userId: string) => {
    const user = users.find((u) => u._id === userId)
    return user ? user.name : userId
  }

  const handleTaskCreated = (newTask: Task) => {
    console.log("🔍 Frontend - New task created:", newTask)
    setAllTasks([newTask, ...allTasks])
    setShowCreateTaskDialog(false)
    toast({
      title: "Success",
      description: "Task created successfully",
    })
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    console.log("🔍 Frontend - Task updated:", updatedTask)
    console.log("🔍 Frontend - Current tasks before update:", allTasks.length)

    setAllTasks((prevTasks) => {
      const newTasks = prevTasks.map((task) => {
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
    setAllTasks((prevTasks) => {
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

  const todoTasks = filteredTasks.filter((task) => task.status === "todo")
  const inProgressTasks = filteredTasks.filter((task) => task.status === "in_progress")
  const completedTasks = filteredTasks.filter((task) => task.status === "completed")

  console.log("🔍 Frontend - Task distribution:", {
    total: filteredTasks.length,
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
        {/* Filtros y Búsqueda */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
              {/* Barra de búsqueda */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar tareas por título o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                  {getActiveFiltersCount() > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
                {getActiveFiltersCount() > 0 && (
                  <Button variant="ghost" onClick={clearFilters} size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Limpiar
                  </Button>
                )}
              </div>

              {/* Panel de filtros */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Estado</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="todo">Por Hacer</SelectItem>
                        <SelectItem value="in_progress">En Progreso</SelectItem>
                        <SelectItem value="completed">Completadas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Prioridad</label>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las prioridades</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="low">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Asignado a</label>
                    <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los usuarios</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Fecha límite</label>
                    <Select value={dueDateFilter} onValueChange={setDueDateFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las fechas</SelectItem>
                        <SelectItem value="overdue">Vencidas</SelectItem>
                        <SelectItem value="today">Hoy</SelectItem>
                        <SelectItem value="tomorrow">Mañana</SelectItem>
                        <SelectItem value="this_week">Esta semana</SelectItem>
                        <SelectItem value="completed">Completadas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas del proyecto */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tareas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredTasks.length}
                    {filteredTasks.length !== allTasks.length && (
                      <span className="text-sm text-gray-500 ml-1">de {allTasks.length}</span>
                    )}
                  </p>
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

        {/* Mensaje cuando no hay resultados */}
        {filteredTasks.length === 0 && allTasks.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron tareas</h3>
              <p className="text-gray-500 mb-4">No hay tareas que coincidan con los filtros aplicados.</p>
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Board de tareas */}
        {filteredTasks.length > 0 && (
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
        )}
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
