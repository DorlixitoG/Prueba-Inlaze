import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import axios from "axios"

@Injectable()
export class NotificationsService {
  private readonly notificationsServiceUrl = "http://localhost:3005"

  async getUserNotifications(headers: any) {
    try {
      const response = await axios.get(`${this.notificationsServiceUrl}/notifications`, {
        headers: {
          "x-user-id": headers["x-user-id"],
          "x-user-email": headers["x-user-email"],
          "x-user-name": headers["x-user-name"],
          "x-user-role": headers["x-user-role"],
        },
      })
      return response.data
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || "Failed to get notifications",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async markAsRead(id: string, headers: any) {
    try {
      const response = await axios.put(`${this.notificationsServiceUrl}/notifications/${id}/read`, {}, {
        headers: {
          "x-user-id": headers["x-user-id"],
          "x-user-email": headers["x-user-email"],
          "x-user-name": headers["x-user-name"],
          "x-user-role": headers["x-user-role"],
        },
      })
      return response.data
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || "Failed to mark notification as read",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async markAllAsRead(headers: any) {
    try {
      const response = await axios.put(`${this.notificationsServiceUrl}/notifications/mark-all-read`, {}, {
        headers: {
          "x-user-id": headers["x-user-id"],
          "x-user-email": headers["x-user-email"],
          "x-user-name": headers["x-user-name"],
          "x-user-role": headers["x-user-role"],
        },
      })
      return response.data
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || "Failed to mark all notifications as read",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async deleteNotification(id: string, headers: any) {
    try {
      const response = await axios.delete(`${this.notificationsServiceUrl}/notifications/${id}`, {
        headers: {
          "x-user-id": headers["x-user-id"],
          "x-user-email": headers["x-user-email"],
          "x-user-name": headers["x-user-name"],
          "x-user-role": headers["x-user-role"],
        },
      })
      return response.data
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || "Failed to delete notification",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}