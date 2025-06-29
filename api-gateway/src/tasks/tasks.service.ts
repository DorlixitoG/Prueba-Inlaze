import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import axios from "axios"

@Injectable()
export class TasksService {
  private readonly tasksServiceUrl = "http://localhost:3003"
  
  async create(data: any, headers: any) {
    try {
      const response = await axios.post(`${this.tasksServiceUrl}/tasks`, data, {
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
        error.response?.data?.message || "Failed to create task",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findByProject(projectId: string, filters: any, headers: any) {
    try {
      const queryParams = new URLSearchParams()
      if (filters.status) queryParams.append("status", filters.status)
      if (filters.assignedTo) queryParams.append("assignedTo", filters.assignedTo)
      if (filters.priority) queryParams.append("priority", filters.priority)
      if (filters.search) queryParams.append("search", filters.search)

      const response = await axios.get(`${this.tasksServiceUrl}/tasks/project/${projectId}?${queryParams.toString()}`, {
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
        error.response?.data?.message || "Failed to get tasks",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findOne(id: string, headers: any) {
    try {
      const response = await axios.get(`${this.tasksServiceUrl}/tasks/${id}`, {
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
        error.response?.data?.message || "Failed to get task",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async update(id: string, data: any, headers: any) {
    try {
      const response = await axios.put(`${this.tasksServiceUrl}/tasks/${id}`, data, {
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
        error.response?.data?.message || "Failed to update task",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async remove(id: string, headers: any) {
    try {
      const response = await axios.delete(`${this.tasksServiceUrl}/tasks/${id}`, {
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
        error.response?.data?.message || "Failed to delete task",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
