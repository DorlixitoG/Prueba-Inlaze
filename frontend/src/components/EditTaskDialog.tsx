"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { UserSelector } from "./UserSelector"
import type { Task } from "@/types"

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskUpdated: (task: Task) => void
  task: Task | null
}

export function EditTaskDialog({ open, onOpenChange, onTaskUpdated, task }: EditTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [status, setStatus] = useState("todo")
  const [dueDate, setDueDate] = useState("")
  const [assignedTo, setAssignedTo] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const { toast } = useToast()

  // Cargar datos de la tarea cuando se abre el diálogo
  useEffect(() => {
    if (open && task) {
      setTitle(task.title)
      setDescription(task.description)
      setPriority(task.priority)
      setStatus(task.status)
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "")
      // Manejar tanto el formato antiguo (string) como el nuevo (array)
      if (Array.isArray(task.assignedTo)) {
        setAssignedTo(task.assignedTo)
      } else {
        setAssignedTo([task.assignedTo])
      }
    }
  }, [open, task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!task) {
      toast({
        title: "Error",
        description: "No hay tarea seleccionada para editar",
        variant: "destructive",
      })
      return
    }

    if (assignedTo.length === 0) {
      toast({
        title: "Error",
        description: "Please assign the task to at least one person.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        dueDate,
        assignedTo,
      }

      console.log("🔍 Frontend - Updating task with data:", taskData)

      const response = await fetch(`http://localhost:4000/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      })

      const data = await response.json()
      console.log("🔍 Frontend - Update response:", data)

      if (!response.ok) {
        console.error("❌ Frontend - Error al actualizar tarea:", data)
        toast({
          title: "Error",
          description: Array.isArray(data.message) ? data.message.join(", ") : data.message || "Failed to update task",
          variant: "destructive",
        })
        return
      }

      // Asegurar que el task actualizado tenga el ID correcto
      const updatedTask = {
        ...data,
        _id: data._id || task._id,
        id: data._id || task._id,
      }

      onTaskUpdated(updatedTask)
      onOpenChange(false)
      toast({
        title: "Éxito",
        description: "Tarea actualizada correctamente",
      })
    } catch (error) {
      console.error("❌ Frontend - Error general:", error)
      toast({
        title: "Error",
        description: "Algo salió mal al actualizar la tarea.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setPriority("medium")
    setStatus("todo")
    setDueDate("")
    setAssignedTo([])
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Tarea</DialogTitle>
          <DialogDescription>Modifica la información de la tarea.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Título</Label>
            <Input
              id="edit-title"
              placeholder="Título de la Tarea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-description">Descripción</Label>
            <Textarea
              id="edit-description"
              placeholder="Descripción de la Tarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-priority">Prioridad</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Mediana</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-status">Estado</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Por Hacer</SelectItem>
                  <SelectItem value="in_progress">En Progreso</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="edit-dueDate">Fecha Límite</Label>
            <Input
              id="edit-dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-assignedTo">Asignar a</Label>
            <UserSelector
              selectedUsers={assignedTo}
              onUsersChange={setAssignedTo}
              placeholder="Seleccionar usuarios para asignar la tarea"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Tarea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
