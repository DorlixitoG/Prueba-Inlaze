import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { ProjectsController } from "./projects.controller"
import { ProjectsService } from "./projects.service"
import { Project, ProjectSchema } from "./schemas/project.schema"

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
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class AppModule {}
