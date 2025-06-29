import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Headers,Inject } from "@nestjs/common"
import  { TasksService } from "./tasks.service"
import { AuthGuard } from "../auth/auth.guard"

@Controller("tasks")
@UseGuards(AuthGuard)
export class TasksController {
  constructor(@Inject(TasksService) private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() body: any, @Headers() headers: any) {
    return this.tasksService.create(body, headers)
  }

  @Get("project/:projectId")
  async findByProject(
    @Param('projectId') projectId: string,
    @Query('status') status?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
    @Headers() headers?: any,
  ) {
    return this.tasksService.findByProject(projectId, { status, assignedTo, priority, search }, headers)
  }

  @Get(":id")
  async findOne(@Param('id') id: string, @Headers() headers: any) {
    return this.tasksService.findOne(id, headers)
  }

  @Put(":id")
  async update(@Param('id') id: string, @Body() body: any, @Headers() headers: any) {
    return this.tasksService.update(id, body, headers)
  }

  @Delete(":id")
  async remove(@Param('id') id: string, @Headers() headers: any) {
    return this.tasksService.remove(id, headers)
  }
}
