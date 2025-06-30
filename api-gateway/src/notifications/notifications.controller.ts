import { Controller, Get, Put, Delete, Param, UseGuards, Headers } from "@nestjs/common"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { NotificationsService } from "./notifications.service"

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(@Headers() headers: any) {
    console.log("📥 Headers recibidos en Gateway:", headers)
    return this.notificationsService.getUserNotifications(headers)
  }

  @Put(":id/read")
  async markAsRead(@Param('id') id: string, @Headers() headers: any) {
    return this.notificationsService.markAsRead(id, headers)
  }

  @Put("mark-all-read")
  async markAllAsRead(@Headers() headers: any) {
    return this.notificationsService.markAllAsRead(headers)
  }

  @Delete(":id")
  async deleteNotification(@Param('id') id: string, @Headers() headers: any) {
    return this.notificationsService.deleteNotification(id, headers)
  }
}