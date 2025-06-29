import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TasksController } from "./tasks.controller"
import { TasksService } from "./tasks.service"
import { Task, TaskSchema } from "./schemas/task.schema"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class AppModule {}
