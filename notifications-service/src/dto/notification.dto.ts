import { IsString, IsOptional } from 'class-validator'

export class CreateNotificationDto {
  @IsString()
  userId: string

  @IsString()
  type: string

  @IsString()
  title: string

  @IsString()
  message: string

  @IsOptional()
  @IsString()
  taskId?: string

  @IsOptional()
  @IsString()
  projectId?: string
}
