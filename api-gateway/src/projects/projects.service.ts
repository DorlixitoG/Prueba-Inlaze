import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import axios from "axios"

@Injectable()
export class ProjectsService {
  private readonly projectsServiceUrl = "http://localhost:3002"

  async create(data: any, headers: any) {
    try {
      const response = await axios.post(`${this.projectsServiceUrl}/projects`, data, {
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
        error.response?.data?.message || "Failed to create project",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findAll(headers: any) {
    try {
      const response = await axios.get(`${this.projectsServiceUrl}/projects`, {
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
        error.response?.data?.message || "Failed to get projects",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findOne(id: string, headers: any) {
    try {
      const response = await axios.get(`${this.projectsServiceUrl}/projects/${id}`, {
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
        error.response?.data?.message || "Failed to get project",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async update(id: string, data: any, headers: any) {
    try {
      const response = await axios.put(`${this.projectsServiceUrl}/projects/${id}`, data, {
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
        error.response?.data?.message || "Failed to update project",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async remove(id: string, headers: any) {
    try {
      const response = await axios.delete(`${this.projectsServiceUrl}/projects/${id}`, {
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
        error.response?.data?.message || "Failed to delete project",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async addMember(projectId: string, data: any, headers: any) {
    try {
      const response = await axios.post(`${this.projectsServiceUrl}/projects/${projectId}/members`, data, {
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
        error.response?.data?.message || "Failed to add member",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
