import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import axios from "axios"

@Injectable()
export class CommentsService {
  private readonly commentsServiceUrl = "http://localhost:3004"

  async create(data: any, headers: any) {
    try {
      const response = await axios.post(`${this.commentsServiceUrl}/comments`, data, {
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
        error.response?.data?.message || "Failed to create comment",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findByTask(taskId: string, headers: any) {
    try {
      const response = await axios.get(`${this.commentsServiceUrl}/comments/task/${taskId}`, {
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
        error.response?.data?.message || "Failed to get comments",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async update(id: string, data: any, headers: any) {
    try {
      const response = await axios.put(`${this.commentsServiceUrl}/comments/${id}`, data, {
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
        error.response?.data?.message || "Failed to update comment",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async remove(id: string, headers: any) {
    try {
      const response = await axios.delete(`${this.commentsServiceUrl}/comments/${id}`, {
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
        error.response?.data?.message || "Failed to delete comment",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
