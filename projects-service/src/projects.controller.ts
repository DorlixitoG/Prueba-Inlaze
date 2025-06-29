import { Controller, Get, Post, Put, Delete, Param, UnauthorizedException } from "@nestjs/common"
import  { ProjectsService } from "./projects.service"
import  { CreateProjectDto, UpdateProjectDto } from "./dto/project.dto"

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  private extractUserIdFromHeaders(headers: any): string {
    const userId = headers["x-user-id"]
    if (!userId) {
      throw new UnauthorizedException("User ID not found in headers")
    }
    return userId
  }

  @Post()
  async create(createProjectDto: CreateProjectDto, headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.projectsService.create({ ...createProjectDto, ownerId: userId })
  }

  @Get()
  async findAll(headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.projectsService.findAll(userId)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Put(":id")
  async update(@Param('id') id: string, updateProjectDto: UpdateProjectDto, headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.projectsService.update(id, updateProjectDto, userId)
  }

  @Delete(":id")
  async remove(@Param('id') id: string, headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.projectsService.remove(id, userId)
  }

  @Post(":id/members")
  async addMember(@Param('id') projectId: string, body: { memberId: string }, headers: any) {
    const userId = this.extractUserIdFromHeaders(headers)
    return this.projectsService.addMember(projectId, body.memberId, userId)
  }
}
