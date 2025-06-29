import { IsString, IsOptional, IsEnum, IsDateString } from "class-validator"

export class CreateTaskDto {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsOptional()
  @IsEnum(["todo", "in_progress", "completed"])
  status?: string

  @IsOptional()
  @IsEnum(["low", "medium", "high"])
  priority?: string

  @IsDateString()
  dueDate: string

  @IsString()
  assignedTo: string

  @IsString()
  projectId: string

  @IsOptional()
  @IsString()
  createdBy?: string
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(["todo", "in_progress", "completed"])
  status?: string

  @IsOptional()
  @IsEnum(["low", "medium", "high"])
  priority?: string

  @IsOptional()
  @IsDateString()
  dueDate?: string

  @IsOptional()
  @IsString()
  assignedTo?: string
}
