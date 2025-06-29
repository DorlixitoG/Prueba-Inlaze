import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { User, UserSchema } from "./schemas/user.schema"

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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "24h" },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], 

})
export class AppModule {}
