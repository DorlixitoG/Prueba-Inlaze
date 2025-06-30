"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, MoreHorizontal, Trash2, Edit, Users, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import type { Task } from "@/types"
import { EditTaskDialog } from "./EditTaskDialog"
import { TaskDetailDialog } from "./TaskDetailDialog"
import { useState, useEffect } from "react"

interface TaskListProps {
  tasks: Task[]
  onTaskUpdated: (task: Task) => void
  onTaskDeleted: (taskId: string) => void
}

export function TaskList({ tasks, onTaskUpdated, onTaskDeleted }: TaskListProps) {
  const { token } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    if (!token) return

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

  const getUserName = (userId: string) => {
    const user = users.find((u) => u._id === userId)
    return user ? user.name : userId
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "todo":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusChange = async (task: Task, newStatus: string) => {
    try {
      console.log("🔍 Frontend - Updating task:", { taskId: task._id, newStatus })

      const response = await fetch(`http://localhost:4000/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        console.log("✅ Frontend - Task updated successfully:", updatedTask)

        // Asegurar que el task actualizado tenga el ID correcto
        const taskWithId = {
          ...updatedTask,
          _id: updatedTask._id || task._id,
          id: updatedTask._id || task._id,
        }

        onTaskUpdated(taskWithId)
        toast({
          title: "Completado",
          description: "Estado de la tarea fue actualizado",
        })
      } else {
        const errorData = await response.json()
        console.error("❌ Frontend - Update failed:", errorData)
        toast({
          title: "Error",
          description: errorData.message || "Failed to update task",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Frontend - Update error:", error)
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Estás seguro que quieres eliminar esta tarea?")) {
      return
    }

    try {
      console.log("🔍 Frontend - Deleting task:", taskId)

      const response = await fetch(`http://localhost:4000/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        console.log("✅ Frontend - Task deleted successfully")
        onTaskDeleted(taskId)
        toast({
          title: "Completado",
          description: "Tarea eliminada exitosamente",
        })
      } else {
        const errorData = await response.json()
        console.error("❌ Frontend - Delete failed:", errorData)
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete task",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Frontend - Delete error:", error)
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const handleEditTask = (task: Task) => {
    console.log("🔍 Frontend - Opening edit dialog for task:", task)
    setSelectedTask(task)
    setShowEditDialog(true)
  }

  const handleViewTask = (task: Task) => {
    console.log("🔍 Frontend - Opening detail dialog for task:", task)
    setSelectedTask(task)
    setShowDetailDialog(true)
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay tareas por el momento</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        // Manejar tanto el formato antiguo (string) como el nuevo (array)
        const assignedUsers = Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo]

        return (
          <Card key={task._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle
                  className="text-sm font-medium line-clamp-2 cursor-pointer hover:text-blue-600"
                  onClick={() => handleViewTask(task)}
                >
                  {task.title}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewTask(task)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalles
                    </DropdownMenuItem>
                    {task.status !== "todo" && (
                      <DropdownMenuItem onClick={() => handleStatusChange(task, "todo")}>
                        Mover a Por Hacer
                      </DropdownMenuItem>
                    )}
                    {task.status !== "in_progress" && (
                      <DropdownMenuItem onClick={() => handleStatusChange(task, "in_progress")}>
                        Mover a En progreso
                      </DropdownMenuItem>
                    )}
                    {task.status !== "completed" && (
                      <DropdownMenuItem onClick={() => handleStatusChange(task, "completed")}>
                        Mover a completado
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleEditTask(task)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteTask(task._id)} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {task.description && (
                <CardDescription className="text-xs line-clamp-2">{task.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-1">
                  <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                </div>
              </div>

              {/* Mostrar usuarios asignados */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  {assignedUsers.length === 1 ? <User className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                  <span>Asignado a:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {assignedUsers.map((userId, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {getUserName(userId)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-400 mt-2">ID: {task._id}</div>
            </CardContent>
          </Card>
        )
      })}

      <EditTaskDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onTaskUpdated={onTaskUpdated}
        task={selectedTask}
      />

      <TaskDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        task={selectedTask}
        onTaskUpdated={onTaskUpdated}
        onTaskDeleted={onTaskDeleted}
      />
    </div>
  )
}
