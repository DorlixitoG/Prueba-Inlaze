import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Headers
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("projects")
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() body: any, @Headers() headers: any) {
    return this.projectsService.create(body, headers);
  }

  @Get()
  async findAll(@Headers() headers: any) {
    return this.projectsService.findAll(headers);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Headers() headers: any) {
    return this.projectsService.findOne(id, headers);
  }

  @Put(":id")
  async update(@Param('id') id: string, @Body() body: any, @Headers() headers: any) {
    return this.projectsService.update(id, body, headers);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Headers() headers: any) {
    return this.projectsService.remove(id, headers);
  }

  @Post(":id/members")
  async addMember(
    @Param('id') projectId: string,
    @Body() body: { memberId: string },
    @Headers() headers: any
  ) {
    return this.projectsService.addMember(projectId, body, headers);
  }
}
