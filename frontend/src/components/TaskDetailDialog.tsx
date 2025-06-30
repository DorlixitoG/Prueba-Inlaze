"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Users, Edit, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { TaskCommentsSection } from "./TaskCommentsSection"
import { EditTaskDialog } from "./EditTaskDialog"
import type { Task } from "@/types"

interface TaskDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  onTaskUpdated: (task: Task) => void
  onTaskDeleted: (taskId: string) => void
}

export function TaskDetailDialog({ open, onOpenChange, task, onTaskUpdated, onTaskDeleted }: TaskDetailDialogProps) {
  const [users, setUsers] = useState<any[]>([])
  const [showEditDialog, setShowEditDialog] = useState(false)
  const { token } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      fetchUsers()
    }
  }, [open])

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completada"
      case "in_progress":
        return "En Progreso"
      case "todo":
        return "Por Hacer"
      default:
        return status
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Media"
      case "low":
        return "Baja"
      default:
        return priority
    }
  }

  const handleDeleteTask = async () => {
    if (!task || !confirm("¿Estás seguro que quieres eliminar esta tarea?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:4000/tasks/${task._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        onTaskDeleted(task._id)
        onOpenChange(false)
        toast({
          title: "Éxito",
          description: "Tarea eliminada exitosamente",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Error al eliminar la tarea",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar la tarea",
        variant: "destructive",
      })
    }
  }

  if (!task) return null

  const assignedUsers = Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-xl mb-2">{task.title}</DialogTitle>
                <DialogDescription className="text-base">{task.description}</DialogDescription>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteTask}
                  className="text-red-600 hover:text-red-700 bg-transparent"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información de la tarea */}
            <div className="lg:col-span-1 space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Estado</h3>
                <Badge className={`${getStatusColor(task.status)}`}>{getStatusLabel(task.status)}</Badge>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Prioridad</h3>
                <Badge className={`${getPriorityColor(task.priority)}`}>{getPriorityLabel(task.priority)}</Badge>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Fecha Límite</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Asignado a</h3>
                <div className="space-y-2">
                  {assignedUsers.map((userId, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      {assignedUsers.length === 1 ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                      <span>{getUserName(userId)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Creado por</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{getUserName(task.createdBy)}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Fecha de Creación</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Sección de comentarios */}
            <div className="lg:col-span-2">
              <TaskCommentsSection taskId={task._id} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EditTaskDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onTaskUpdated={onTaskUpdated}
        task={task}
      />
    </>
  )
}
