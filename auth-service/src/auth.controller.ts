import { Controller, Post, Get, Body, Param, Headers, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, LoginDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("validate")
  async validateToken(@Body() body: { token: string }) {
    return this.authService.validateToken(body.token);
  }

  @Get("profile")
  async getProfile(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException("No token provided");
    }

    const token = authorization.replace("Bearer ", "");
    const validation = await this.authService.validateToken(token);

    if (!validation.valid) {
      throw new UnauthorizedException("Invalid token");
    }

    return validation.user;
  }

  @Get("user/:id")
  async getUser(@Param("id") id: string) {
    return this.authService.getUserById(id);
  }
}
