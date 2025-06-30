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

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated: (task: Task) => void
  projectId: string
}

export function CreateTaskDialog({ open, onOpenChange, onTaskCreated, projectId }: CreateTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [status, setStatus] = useState("todo")
  const [dueDate, setDueDate] = useState("")
  const [assignedTo, setAssignedTo] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { token, user } = useAuth()
  const { toast } = useToast()

  // Pre-seleccionar al usuario actual cuando se abre el diálogo
  useEffect(() => {
    if (open && user?._id && assignedTo.length === 0) {
      setAssignedTo([user._id])
    }
  }, [open, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "User not loaded. Try again shortly.",
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
        projectId,
      }

      console.log("🔍 Frontend - Creating task with data:", taskData)

      const response = await fetch("http://localhost:4000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      })

      const data = await response.json()
      console.log("🔍 Frontend - Response:", data)

      if (!response.ok) {
        console.error("❌ Frontend - Error al crear tarea:", data)
        toast({
          title: "Error",
          description: Array.isArray(data.message) ? data.message.join(", ") : data.message || "Failed to create task",
          variant: "destructive",
        })
        return
      }

      onTaskCreated(data)
      resetForm()
      onOpenChange(false)
      toast({
        title: "Completado",
        description: "Tarea creada exitosamente",
      })
    } catch (error) {
      console.error("❌ Frontend - Error general:", error)
      toast({
        title: "Error",
        description: "Something went wrong while creating the task.",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Tarea</DialogTitle>
          <DialogDescription>Añade una nueva tarea a este proyecto.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Título de la Tarea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción de la Tarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Prioridad</Label>
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
              <Label htmlFor="status">Estado</Label>
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
            <Label htmlFor="dueDate">Fecha Límite</Label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="assignedTo">Asignar a</Label>
            <UserSelector
              selectedUsers={assignedTo}
              onUsersChange={setAssignedTo}
              placeholder="Seleccionar usuarios para asignar la tarea"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Tarea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
