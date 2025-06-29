import { IsString } from "class-validator"

export class CreateCommentDto {
  @IsString()
  content: string

  @IsString()
  taskId: string
}

export class UpdateCommentDto {
  @IsString()
  content: string
}
