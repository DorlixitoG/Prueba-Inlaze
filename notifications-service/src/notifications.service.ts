import { Injectable } from "@nestjs/common"
import  { Model } from "mongoose"
import  { NotificationDocument } from "./schemas/notification.schema"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class NotificationsService {

constructor(
  @InjectModel("Notification") private readonly notificationModel: Model<NotificationDocument>,
) {}

  async createNotification(data: {
    userId: string
    type: string
    title: string
    message: string
    taskId?: string
    projectId?: string
  }) {
    console.log("🔍 Notification Service - Creating notification with data:", data)

    try {
      const notification = new this.notificationModel(data)
      const savedNotification = await notification.save()
      console.log("✅ Notification Service - Notification saved:", savedNotification._id)
      return savedNotification
    } catch (error) {
      console.error("❌ Notification Service - Error saving notification:", error)
      throw error
    }
  }

  async getUserNotifications(userId: string) {
    console.log("🔍 Notification Service - Getting notifications for user:", userId)

    try {
      const notifications = await this.notificationModel.find({ userId }).sort({ createdAt: -1 }).limit(50)

      console.log("✅ Notification Service - Found notifications:", notifications.length)
      return notifications
    } catch (error) {
      console.error("❌ Notification Service - Error getting notifications:", error)
      throw error
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notificationModel.findOneAndUpdate({ _id: notificationId, userId }, { read: true }, { new: true })
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany({ userId, read: false }, { read: true })
  }

  async deleteNotification(notificationId: string, userId: string) {
    return this.notificationModel.findOneAndDelete({
      _id: notificationId,
      userId,
    })
  }
}
