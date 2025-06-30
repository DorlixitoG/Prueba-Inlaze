import { Controller,Post, Body,Get, Put, Delete, Param, Headers, UnauthorizedException } from "@nestjs/common"
import { NotificationsService } from "./notifications.service"

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
@Post()
  async createNotification(@Body() data: {
    userId: string
    type: string
    title: string
    message: string
    taskId?: string
    projectId?: string
  }) {
    return this.notificationsService.createNotification(data)
  }
  private extractUserIdFromHeaders(headers: any): string {
    const userId = headers["x-user-id"]
    if (!userId) {
      throw new UnauthorizedException("User ID not found in headers")
    }
    return userId
  }

  @Get()
  async getUserNotifications(@Headers("x-user-id") userId: string) {
    return this.notificationsService.getUserNotifications(userId)
  }

  @Put(":id/read")
  async markAsRead(@Param('id') id: string, @Headers() headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.notificationsService.markAsRead(id, userId)
  }

  @Put("mark-all-read")
  async markAllAsRead(@Headers() headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.notificationsService.markAllAsRead(userId)
  }

  @Delete(":id")
  async deleteNotification(@Param('id') id: string, @Headers() headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.notificationsService.deleteNotification(id, userId)
  }
}
