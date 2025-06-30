import { Controller, Get, Put, Delete, Param, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.guard'
import { NotificationsService } from './notifications.service'
import { Request } from 'express'

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

@Get()
async getUserNotifications(@Req() req: Request) {
  const user =  (req as any).user
  return this.notificationsService.getUserNotifications(user)
}

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: Request) {
    return this.notificationsService.markAsRead(id, req.headers)
  }

  @Put('mark-all-read')
  async markAllAsRead(@Req() req: Request) {
    return this.notificationsService.markAllAsRead(req.headers)
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Req() req: Request) {
    return this.notificationsService.deleteNotification(id, req.headers)
  }
}
