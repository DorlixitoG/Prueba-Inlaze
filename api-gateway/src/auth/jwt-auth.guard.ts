// api-gateway/src/auth/jwt-auth.guard.ts
import { Injectable, type CanActivate, type ExecutionContext, UnauthorizedException, Inject } from "@nestjs/common"
import { AuthService } from "./auth.service"

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const result = await this.authService.validateToken(token)
      if (!result.valid) {
        throw new UnauthorizedException()
      }
      request.user = result.user
      return true
    } catch {
      throw new UnauthorizedException()
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? []
    return type === "Bearer" ? token : undefined
  }
}