import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Headers,
  UnauthorizedException,
  Body,
} from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { CreateNotificationDto } from './dto/notification.dto'

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async createNotification(@Body() data: CreateNotificationDto) {
    console.log('📥 Notification Service - Creating notification:', data)
    try {
      const result = await this.notificationsService.createNotification(data)
      console.log('✅ Notification Service - Notification created:', result._id)
      return result
    } catch (error) {
      console.error('❌ Notification Service - Error creating notification:', error)
      throw error
    }
  }

  private extractUserIdFromHeaders(headers: any): string {
    const userId = headers['x-user-id']
    if (!userId) {
      console.error('❌ User ID not found in headers:', headers)
      throw new UnauthorizedException('User ID not found in headers')
    }
    return userId
  }

  @Get()
  async getUserNotifications(@Headers() headers: any) {
    console.log('📥 Notification Service - Get notifications, headers:', headers)
    const userId = this.extractUserIdFromHeaders(headers)
    try {
      const notifications = await this.notificationsService.getUserNotifications(userId)
      console.log('✅ Notification Service - Found notifications:', notifications.length)
      return notifications
    } catch (error) {
      console.error('❌ Notification Service - Error getting notifications:', error)
      throw error
    }
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Headers() headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.notificationsService.markAsRead(id, userId)
  }

  @Put('mark-all-read')
  async markAllAsRead(@Headers() headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.notificationsService.markAllAsRead(userId)
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Headers() headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.notificationsService.deleteNotification(id, userId)
  }
}
