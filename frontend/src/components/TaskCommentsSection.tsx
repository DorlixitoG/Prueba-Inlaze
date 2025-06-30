"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import type { Comment } from "@/types"

interface TaskCommentsSectionProps {
  taskId: string
}

export function TaskCommentsSection({ taskId }: TaskCommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const { token, user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (taskId && token) {
      fetchComments()
      fetchUsers()
    }
  }, [taskId, token])

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

  const fetchComments = async () => {
    if (!token || !taskId) return

    setLoading(true)
    try {
      console.log("🔍 Frontend - Fetching comments for task:", taskId)
      const response = await fetch(`http://localhost:4000/comments/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("✅ Frontend - Comments fetched:", data)
        setComments(data)
      } else {
        const errorText = await response.text()
        console.error("❌ Frontend - Error fetching comments:", errorText)
        toast({
          title: "Error",
          description: "Error al cargar los comentarios",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Frontend - Network error fetching comments:", error)
      toast({
        title: "Error",
        description: "Error de conexión al cargar los comentarios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim() || !user || !taskId) {
      console.log("❌ Frontend - Missing data:", { newComment: !!newComment.trim(), user: !!user, taskId: !!taskId })
      return
    }

    setSubmitting(true)
    try {
      console.log("🔍 Frontend - Submitting comment:", {
        content: newComment.trim(),
        taskId,
        user: user.name,
      })

const response = await fetch("http://localhost:4000/comments", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "x-user-id": user?._id ?? "",
    "x-user-name": user?.name ?? "",
  },
  body: JSON.stringify({
    content: newComment.trim(),
    taskId,
  }),
})

      if (response.ok) {
        const comment = await response.json()
        console.log("✅ Frontend - Comment created:", comment)
        setComments([comment, ...comments])
        setNewComment("")
        toast({
          title: "Éxito",
          description: "Comentario agregado exitosamente",
        })
      } else {
        const errorData = await response.json()
        console.error("❌ Frontend - Error creating comment:", errorData)
        toast({
          title: "Error",
          description: errorData.message || "Error al agregar el comentario",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("❌ Frontend - Network error creating comment:", error)
      toast({
        title: "Error",
        description: "Error de conexión al agregar el comentario",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      const response = await fetch(`http://localhost:4000/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: editContent.trim(),
        }),
      })

      if (response.ok) {
        const updatedComment = await response.json()
        setComments(comments.map((c) => (c._id === commentId ? updatedComment : c)))
        setEditingComment(null)
        setEditContent("")
        toast({
          title: "Éxito",
          description: "Comentario actualizado exitosamente",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Error al actualizar el comentario",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el comentario",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("¿Estás seguro que quieres eliminar este comentario?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:4000/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setComments(comments.filter((c) => c._id !== commentId))
        toast({
          title: "Éxito",
          description: "Comentario eliminado exitosamente",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Error al eliminar el comentario",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar el comentario",
        variant: "destructive",
      })
    }
  }

  const startEditing = (comment: Comment) => {
    setEditingComment(comment._id)
    setEditContent(comment.content)
  }

  const cancelEditing = () => {
    setEditingComment(null)
    setEditContent("")
  }

  const getUserName = (userId: string) => {
    const foundUser = users.find((u) => u._id === userId)
    return foundUser ? foundUser.name : "Usuario desconocido"
  }

  const getUserInitials = (userId: string) => {
    const foundUser = users.find((u) => u._id === userId)
    if (foundUser) {
      return foundUser.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    }
    return "U"
  }

  if (!taskId) {
    return <div>No se pudo cargar los comentarios</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="font-semibold">Comentarios ({comments.length})</h3>
      </div>

      {/* Formulario para nuevo comentario */}
      <Card>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <Textarea
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting || !newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                {submitting ? "Enviando..." : "Comentar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de comentarios */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Cargando comentarios...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">No hay comentarios aún</p>
            <p className="text-sm text-gray-400">Sé el primero en comentar</p>
          </div>
        ) : (
          comments.map((comment) => (
            <Card key={comment._id} className="relative">
              <CardContent className="pt-4">
                <div className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{getUserInitials(comment.userId)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{getUserName(comment.userId)}</span>
                        <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>

                      {user?._id === comment.userId && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEditing(comment)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteComment(comment._id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    {editingComment === comment._id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[60px]"
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditComment(comment._id)}
                            disabled={!editContent.trim()}
                          >
                            Guardar
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditing}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
