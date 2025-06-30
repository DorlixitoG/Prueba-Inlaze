import { Controller, Get, Post, Put, Delete, Param, UseGuards,Body,Headers } from "@nestjs/common"
import  { CommentsService } from "./comments.service"
import { AuthGuard } from "../auth/auth.guard"

@Controller("comments")
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

@Post()
async create(@Body() body: any, @Headers() headers: any) {
  console.log("📥 API Gateway Comments - Body:", body)
  console.log("📥 API Gateway Comments - Headers:", {
    "x-user-id": headers["x-user-id"],
    "x-user-name": headers["x-user-name"],
  })

  return this.commentsService.create(body, headers)
}


@Get("task/:taskId")
async findByTask(@Param('taskId') taskId: string, @Headers() headers: any) {
  return this.commentsService.findByTask(taskId, headers)
}

@Put(":id")
async update(@Param('id') id: string, @Body() body: any, @Headers() headers: any) {
  return this.commentsService.update(id, body, headers)
}

@Delete(":id")
async remove(@Param('id') id: string, @Headers() headers: any) {
  return this.commentsService.remove(id, headers)
}

}
