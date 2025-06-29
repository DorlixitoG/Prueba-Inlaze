import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: ["http://localhost:4000", "http://localhost:3000"],
    credentials: true,
  })

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  enableDebugMessages: true, 
}));

  await app.listen(3003)
  console.log("Tasks Service is running on http://localhost:3003")
}
bootstrap()
