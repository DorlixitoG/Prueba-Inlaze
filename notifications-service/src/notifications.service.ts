import { Injectable } from "@nestjs/common"
import { Model } from "mongoose"
import { InjectModel } from "@nestjs/mongoose"
import { NotificationDocument } from "./schemas/notification.schema"

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
    const notification = new this.notificationModel(data)
    return notification.save()
  }

  async getUserNotifications(userId: string) {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    )
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { userId, read: false },
      { read: true }
    )
  }

  async deleteNotification(notificationId: string, userId: string) {
    return this.notificationModel.findOneAndDelete({
      _id: notificationId,
      userId
    })
  }
}