import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import  { Model } from "mongoose"
import  { TaskDocument } from "./schemas/task.schema"
import  { CreateTaskDto, UpdateTaskDto } from "./dto/task.dto"
import { InjectModel } from "@nestjs/mongoose"



@Injectable()
export class TasksService {

constructor(
  @InjectModel("Task") private readonly taskModel: Model<TaskDocument>,
) {}

  async create(createTaskDto: CreateTaskDto & { createdBy: string }) {
    const task = new this.taskModel(createTaskDto)
    return task.save()
  }

  async findByProject(projectId: string, filters?: any) {
    const query: any = { projectId }

    if (filters?.status) {
      query.status = filters.status
    }

    if (filters?.assignedTo) {
      query.assignedTo = filters.assignedTo
    }

    if (filters?.priority) {
      query.priority = filters.priority
    }

    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
      ]
    }

    return this.taskModel.find(query).sort({ createdAt: -1 })
  }

  async findOne(id: string) {
    const task = await this.taskModel.findById(id)
    if (!task) {
      throw new NotFoundException("Task not found")
    }
    return task
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.taskModel.findById(id)
    if (!task) {
      throw new NotFoundException("Task not found")
    }

    // Solo el creador o el asignado pueden actualizar la tarea
    if (task.createdBy !== userId && task.assignedTo !== userId) {
      throw new ForbiddenException("Not authorized to update this task")
    }

    return this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true })
  }

  async remove(id: string, userId: string) {
    const task = await this.taskModel.findById(id)
    if (!task) {
      throw new NotFoundException("Task not found")
    }

    if (task.createdBy !== userId) {
      throw new ForbiddenException("Only task creator can delete")
    }

    return this.taskModel.findByIdAndDelete(id)
  }
}
