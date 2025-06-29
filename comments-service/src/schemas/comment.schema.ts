import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type CommentDocument = Comment & Document

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  content: string

  @Prop({ required: true })
  taskId: string

  @Prop({ required: true })
  userId: string

  @Prop({ required: true })
  userName: string
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
