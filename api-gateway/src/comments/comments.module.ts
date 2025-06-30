import { Module } from "@nestjs/common"
import { CommentsController } from "./comments.controller"
import { CommentsService } from "./comments.service"
import { AuthModule } from "../auth/auth.module"
import { AuthGuard } from "../auth/auth.guard"; // ✅ Correcto si estás en src/comments

@Module({
  imports: [AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
