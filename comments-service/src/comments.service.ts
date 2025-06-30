import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { Model } from "mongoose"
import { CommentDocument } from "./schemas/comment.schema"
import { CreateCommentDto, UpdateCommentDto } from "./dto/comment.dto"
import axios from "axios"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class CommentsService {
constructor(
  @InjectModel("Comment") private readonly commentModel: Model<CommentDocument>,
) {}

  async create(createCommentDto: CreateCommentDto & { userId: string; userName: string }) {
    if (!createCommentDto.taskId || !createCommentDto.userId || !createCommentDto.userName) {
      console.error("❌ Missing required fields in comment DTO:", createCommentDto)
      throw new Error("Missing required fields in comment")
    }

    const comment = new this.commentModel(createCommentDto)
    const savedComment = await comment.save()

    try {
      await this.createCommentNotifications(savedComment)
    } catch (err) {
      console.error("⚠️ Failed to send notifications:", err)
    }

    return savedComment
  }

  private async createCommentNotifications(comment: any) {
    try {
      console.log("🔔 Creando notificaciones para comentario:", comment._id)

      // Obtener información de la tarea
      const taskResponse = await axios.get(`http://localhost:3003/tasks/${comment.taskId}`)
      const task = taskResponse.data
      console.log("📋 Tarea obtenida:", task.title)

      // Obtener usuarios a notificar
      const assignedUsers = Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo]
      const usersToNotify = assignedUsers.filter((userId: string) => userId !== comment.userId)

      // Agregar el creador de la tarea si no está en la lista
      if (task.createdBy !== comment.userId && !usersToNotify.includes(task.createdBy)) {
        usersToNotify.push(task.createdBy)
      }

      console.log("👥 Usuarios a notificar:", usersToNotify)

      // Crear notificaciones para cada usuario
      for (const userId of usersToNotify) {
        console.log("📤 Enviando notificación a usuario:", userId)

        const notificationData = {
          userId,
          type: "comment",
          title: "Nuevo comentario",
          message: `${comment.userName} comentó en la tarea "${task.title}"`,
          taskId: comment.taskId,
          projectId: task.projectId,
        }

        console.log("📋 Datos de notificación:", notificationData)

        try {
          const response = await axios.post("http://localhost:3005/notifications", notificationData, {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 5000,
          })
          console.log("✅ Notificación creada exitosamente:", response.data._id)
        } catch (notificationError: unknown) {
          console.error(
            "❌ Error específico al crear notificación para usuario",
            userId,
            ":",
            notificationError instanceof Error ? notificationError.message : notificationError,
          )

          if (axios.isAxiosError(notificationError)) {
            console.error("Response data:", notificationError.response?.data)
            console.error("Response status:", notificationError.response?.status)
          }
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Error creando notificaciones:", error.response?.data || error.message)
        console.error("Request config:", error.config)
      } else if (error instanceof Error) {
        console.error("❌ Error creando notificaciones (no Axios):", error.message)
      } else {
        console.error("❌ Error desconocido al crear notificaciones:", error)
      }
    }
  }

  async findByTask(taskId: string) {
    return this.commentModel.find({ taskId }).sort({ createdAt: -1 })
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string) {
    const comment = await this.commentModel.findById(id)
    if (!comment) {
      throw new NotFoundException("Comment not found")
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException("Only comment author can update")
    }

    return this.commentModel.findByIdAndUpdate(id, updateCommentDto, { new: true })
  }

  async remove(id: string, userId: string) {
    const comment = await this.commentModel.findById(id)
    if (!comment) {
      throw new NotFoundException("Comment not found")
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException("Only comment author can delete")
    }

    return this.commentModel.findByIdAndDelete(id)
  }
}
