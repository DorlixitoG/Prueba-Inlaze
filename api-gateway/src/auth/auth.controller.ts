import { Controller, Post, Get, UseGuards, Body, Headers, Inject } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthGuard } from "./auth.guard"

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() body: { email: string; password: string; name: string; role?: string }) {
    console.log('🔍 API Gateway Controller - Body received:', body)
    return this.authService.register(body)
  }

  @Post("login")
  async login(@Body() body: { email: string; password: string }) {
    console.log('🔍 API Gateway Controller - Login body:', body)
    return this.authService.login(body)
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  async getProfile(@Headers('authorization') authorization: string) {
    return this.authService.getProfile(authorization)
  }
}