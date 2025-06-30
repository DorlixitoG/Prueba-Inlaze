import { IsString, IsOptional, IsEnum, IsDateString, IsArray } from "class-validator"

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

 @IsArray()
  @IsString({ each: true })
  assignedTo: string[]


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
  @IsArray()
  @IsString({ each: true })
  assignedTo?: string[]
}
