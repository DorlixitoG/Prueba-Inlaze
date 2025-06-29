import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { CommentsController } from "./comments.controller"
import { CommentsService } from "./comments.service"
import { Comment, CommentSchema } from "./schemas/comment.schema"

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
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class AppModule {}
