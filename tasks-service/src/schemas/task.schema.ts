import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type TaskDocument = Task & Document

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ enum: ["todo", "in_progress", "completed"], default: "todo" })
  status: string

  @Prop({ enum: ["low", "medium", "high"], default: "medium" })
  priority: string

  @Prop({ required: true })
  dueDate: Date

  @Prop({ type: [String], required: true })
  assignedTo: string[]

  @Prop({ required: true })
  projectId: string

  @Prop({ required: true })
  createdBy: string
}

export const TaskSchema = SchemaFactory.createForClass(Task)
