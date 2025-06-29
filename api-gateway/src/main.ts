import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })

  // Ensure hooks are called at the top level
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(4000)
  console.log("API Gateway is running on http://localhost:4000")
}
bootstrap()
