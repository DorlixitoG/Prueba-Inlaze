import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import  { Model } from "mongoose"
import  { ProjectDocument } from "./schemas/project.schema"
import  { CreateProjectDto, UpdateProjectDto } from "./dto/project.dto"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class ProjectsService {

constructor(
  @InjectModel("Project") private readonly projectModel: Model<ProjectDocument>,
) {}

  async create(createProjectDto: CreateProjectDto & { ownerId: string }) {
    const project = new this.projectModel({
      ...createProjectDto,
      members: [createProjectDto.ownerId],
    })
    return project.save()
  }

  async findAll(userId: string) {
    return this.projectModel.find({
      $or: [{ ownerId: userId }, { members: userId }],
    })
  }

  async findOne(id: string) {
    const project = await this.projectModel.findById(id)
    if (!project) {
      throw new NotFoundException("Project not found")
    }
    return project
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {
    const project = await this.projectModel.findById(id)
    if (!project) {
      throw new NotFoundException("Project not found")
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException("Only project owner can update")
    }

    return this.projectModel.findByIdAndUpdate(id, updateProjectDto, { new: true })
  }

  async remove(id: string, userId: string) {
    const project = await this.projectModel.findById(id)
    if (!project) {
      throw new NotFoundException("Project not found")
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException("Only project owner can delete")
    }

    return this.projectModel.findByIdAndDelete(id)
  }

  async addMember(projectId: string, memberId: string, userId: string) {
    const project = await this.projectModel.findById(projectId)
    if (!project) {
      throw new NotFoundException("Project not found")
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException("Only project owner can add members")
    }

    if (!project.members.includes(memberId)) {
      project.members.push(memberId)
      await project.save()
    }

    return project
  }
}
