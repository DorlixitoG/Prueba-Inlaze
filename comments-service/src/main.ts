import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: ["http://localhost:4000", "http://localhost:3000"],
    credentials: true,
  })

  // Ensure hooks are called at the top level
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(3004)
  console.log("Comments Service is running on http://localhost:3004")
}
bootstrap()
