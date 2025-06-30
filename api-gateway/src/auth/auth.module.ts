// api-gateway/src/auth/auth.module.ts
import { Module } from "@nestjs/common"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { AuthGuard } from "./auth.guard"
import { JwtAuthGuard } from "./jwt-auth.guard"

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, JwtAuthGuard],
  exports: [AuthService, AuthGuard, JwtAuthGuard]
})
export class AuthModule {}