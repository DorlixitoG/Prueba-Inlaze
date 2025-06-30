import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import axios from "axios"

@Injectable()
export class AuthService {
  private readonly authServiceUrl = "http://localhost:3001"

  async register(data: { email: string; password: string; name: string; role?: string }) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/register`, data)
      return response.data
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || "Registration failed",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async login(data: { email: string; password: string }) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/login`, data)
      return response.data
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || "Login failed",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

async validateToken(token: string) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/validate`, { token }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      return { valid: false, user: null }
    }
  }

async getProfile(authorization: string) {
    try {
      const response = await axios.get(`${this.authServiceUrl}/auth/profile`, {
        headers: { 
          authorization,
          'Content-Type': 'application/json'
        },
      })
      return response.data
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || "Failed to get profile",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
  async getAllUsers(authorization: string) {
  try {
    const response = await axios.get(`${this.authServiceUrl}/auth/users`, {
      headers: {
        authorization,
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (error) {
    throw new HttpException(
      error.response?.data?.message || "Failed to get users",
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    )
  }
}
}
