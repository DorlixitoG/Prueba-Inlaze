import { Controller, Get, Post, Put, Delete, Param, Query, Headers, UnauthorizedException } from "@nestjs/common"
import  { TasksService } from "./tasks.service"
import  { CreateTaskDto, UpdateTaskDto } from "./dto/task.dto"

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  private extractUserIdFromHeaders(headers: any): string {
    const userId = headers["x-user-id"]
    if (!userId) {
      throw new UnauthorizedException("User ID not found in headers")
    }
    return userId
  }

  @Post()
  async create(createTaskDto: CreateTaskDto, @Headers() headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.tasksService.create({ ...createTaskDto, createdBy: userId })
  }

  @Get("project/:projectId")
  async findByProject(
    @Param('projectId') projectId: string,
    @Query('status') status?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
  ) {
    const filters = { status, assignedTo, priority, search }
    return this.tasksService.findByProject(projectId, filters)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Put(":id")
  async update(@Param('id') id: string, updateTaskDto: UpdateTaskDto, @Headers() headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.tasksService.update(id, updateTaskDto, userId)
  }

  @Delete(":id")
  async remove(@Param('id') id: string, @Headers() headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.tasksService.remove(id, userId)
  }
}
