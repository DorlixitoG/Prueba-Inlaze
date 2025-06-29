import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import  { Model } from "mongoose"
import  { Task, TaskDocument } from "./schemas/task.schema"
import  { CreateTaskDto, UpdateTaskDto } from "./dto/task.dto"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>
  ) {}


  async create(createTaskDto: CreateTaskDto & { createdBy: string }) {
    console.log("🔍 Tasks Service - Create method called with:", createTaskDto)

    if (!createTaskDto.assignedTo) {
      throw new Error("assignedTo is required")
    }

    if (!createTaskDto.projectId) {
      throw new Error("projectId is required")
    }

    if (!createTaskDto.createdBy) {
      throw new Error("createdBy is required")
    }

    try {
      const task = new this.taskModel({
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status || "todo",
        priority: createTaskDto.priority || "medium",
        dueDate: new Date(createTaskDto.dueDate),
        assignedTo: createTaskDto.assignedTo,
        projectId: createTaskDto.projectId,
        createdBy: createTaskDto.createdBy,
      })

      console.log("🔍 Tasks Service - Task object before save:", task.toObject())
      const savedTask = await task.save()
      console.log("✅ Tasks Service - Task created successfully:", savedTask._id)

      return savedTask
    } catch (error) {
      console.error("❌ Tasks Service - Error creating task:", error)
      throw error
    }
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
