// api-gateway/src/notifications/notifications.controller.ts
import { Controller, Get, Put, Delete, Param, UseGuards, Req,Headers } from "@nestjs/common"
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
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.notificationsService.markAsRead(id, req.user._id)
  }

  @Put("mark-all-read")
  async markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(req.user._id)
  }

  @Delete(":id")
  async deleteNotification(@Param('id') id: string, @Req() req: any) {
    return this.notificationsService.deleteNotification(id, req.user._id)
  }
}
