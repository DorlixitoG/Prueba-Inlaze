import { Controller, Get, Post, Put, Delete, Param, UseGuards, Inject } from "@nestjs/common"
import { CommentsService } from "./comments.service"
import { AuthGuard } from "../auth/auth.guard"

@Controller("comments")
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(@Inject(CommentsService) private readonly commentsService: CommentsService) {}

  @Post()
  async create(body: any, headers: any) {
    return this.commentsService.create(body, headers)
  }

  @Get("task/:taskId")
  async findByTask(@Param('taskId') taskId: string, headers: any) {
    return this.commentsService.findByTask(taskId, headers)
  }

  @Put(":id")
  async update(@Param('id') id: string, body: any, headers: any) {
    return this.commentsService.update(id, body, headers)
  }

  @Delete(":id")
  async remove(@Param('id') id: string, headers: any) {
    return this.commentsService.remove(id, headers)
  }
}
