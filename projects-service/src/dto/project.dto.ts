import { IsString, IsOptional, IsArray } from "class-validator"

export class CreateProjectDto {
  @IsString()
  name: string

  @IsString()
  description: string
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsArray()
  members?: string[]
}
