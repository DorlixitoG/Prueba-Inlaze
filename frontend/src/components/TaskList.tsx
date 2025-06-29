"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import type { Task } from "@/types"

interface TaskListProps {
  tasks: Task[]
  onTaskUpdated: (task: Task) => void
  onTaskDeleted: (taskId: string) => void
}

export function TaskList({ tasks, onTaskUpdated, onTaskDeleted }: TaskListProps) {
  const { token } = useAuth()
  const { toast } = useToast()

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

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay tareas por el momento</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task._id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-sm font-medium line-clamp-2">{task.title}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                  <DropdownMenuItem onClick={() => handleDeleteTask(task._id)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {task.description && <CardDescription className="text-xs line-clamp-2">{task.description}</CardDescription>}
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
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>Asignado: {task.assignedTo}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">ID: {task._id}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
