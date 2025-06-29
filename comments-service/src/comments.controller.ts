import { Controller, Get, Post, Put, Delete, Param, UnauthorizedException } from "@nestjs/common"
import  { CommentsService } from "./comments.service"
import  { CreateCommentDto, UpdateCommentDto } from "./dto/comment.dto"

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  private extractUserIdFromHeaders(headers: any): string {
    const userId = headers["x-user-id"]
    if (!userId) {
      throw new UnauthorizedException("User ID not found in headers")
    }
    return userId
  }

  private extractUserNameFromHeaders(headers: any): string {
    const userName = headers["x-user-name"]
    if (!userName) {
      throw new UnauthorizedException("User name not found in headers")
    }
    return userName
  }

  @Post()
  async create(createCommentDto: CreateCommentDto, headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    const userName = this.extractUserNameFromHeaders(headers)
    return this.commentsService.create({ ...createCommentDto, userId, userName })
  }

  @Get('task/:taskId')
  async findByTask(@Param('taskId') taskId: string) {
    return this.commentsService.findByTask(taskId);
  }

  @Put(":id")
  async update(@Param('id') id: string, updateCommentDto: UpdateCommentDto, headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.commentsService.update(id, updateCommentDto, userId)
  }

  @Delete(":id")
  async remove(@Param('id') id: string, headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.commentsService.remove(id, userId)
  }
}
