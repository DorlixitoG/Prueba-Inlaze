import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import  { Model } from "mongoose"
import  { CommentDocument } from "./schemas/comment.schema"
import  { CreateCommentDto, UpdateCommentDto } from "./dto/comment.dto"
import { InjectModel } from "@nestjs/mongoose"
import axios from 'axios' 

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



// comments-service/src/comments.service.ts - método createCommentNotifications
private async createCommentNotifications(comment: any) {
  try {
    console.log("🔔 Creando notificaciones para comentario:", comment._id)
    
    const taskResponse = await axios.get(`http://localhost:3003/tasks/${comment.taskId}`)
    const task = taskResponse.data
    console.log("📋 Tarea obtenida:", task.title)

    const assignedUsers = Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo]
    const usersToNotify = assignedUsers.filter((userId: string) => userId !== comment.userId)

    if (task.createdBy !== comment.userId && !usersToNotify.includes(task.createdBy)) {
      usersToNotify.push(task.createdBy)
    }

    console.log("👥 Usuarios a notificar:", usersToNotify)

    for (const userId of usersToNotify) {
      console.log("📤 Enviando notificación a usuario:", userId)
      
      const notificationData = {
        userId,
        type: "comment",
        title: "Nuevo comentario",
        message: `${comment.userName} comentó en la tarea "${task.title}"`,
        taskId: comment.taskId,
        projectId: task.projectId
      }
      
      console.log("📋 Datos de notificación:", notificationData)
      
      const response = await axios.post("http://localhost:3005/notifications", notificationData)
      console.log("✅ Notificación creada:", response.data)
    }
  } catch (error) {
  if (axios.isAxiosError(error)) {
    console.error("❌ Error creating comment notifications:", error.response?.data || error.message)
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
