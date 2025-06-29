import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Headers,
  UnauthorizedException,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto, UpdateProjectDto } from "./dto/project.dto";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  private extractUserIdFromHeaders(headers: Record<string, string>): string {
    const userId = headers["x-user-id"];
    if (!userId) {
      throw new UnauthorizedException("User ID not found in headers");
    }
    return userId;
  }

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Headers() headers: Record<string, string>
  ) {
    const userId = this.extractUserIdFromHeaders(headers);
    return this.projectsService.create({
      ...createProjectDto,
      ownerId: userId,
    });
  }

  @Get()
  async findAll(@Headers() headers: Record<string, string>) {
    const userId = this.extractUserIdFromHeaders(headers);
    return this.projectsService.findAll(userId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.projectsService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Headers() headers: Record<string, string>
  ) {
    const userId = this.extractUserIdFromHeaders(headers);
    return this.projectsService.update(id, updateProjectDto, userId);
  }

  @Delete(":id")
  async remove(
    @Param("id") id: string,
    @Headers() headers: Record<string, string>
  ) {
    const userId = this.extractUserIdFromHeaders(headers);
    return this.projectsService.remove(id, userId);
  }

  @Post(":id/members")
  async addMember(
    @Param("id") projectId: string,
    @Body() body: { memberId: string },
    @Headers() headers: Record<string, string>
  ) {
    const userId = this.extractUserIdFromHeaders(headers);
    return this.projectsService.addMember(projectId, body.memberId, userId);
  }
}
