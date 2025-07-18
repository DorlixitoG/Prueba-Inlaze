import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { ProjectsModule } from "./projects/projects.module"
import { TasksModule } from "./tasks/tasks.module"
import { CommentsModule } from "./comments/comments.module"
import { NotificationsModule } from "./notifications/notifications.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProjectsModule,
    TasksModule,
    CommentsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
