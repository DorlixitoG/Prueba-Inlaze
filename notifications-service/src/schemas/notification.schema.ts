import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type NotificationDocument = Notification & Document

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  userId: string

  @Prop({ enum: ["comment", "task_update", "task_assigned"], required: true })
  type: string

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  message: string

  @Prop()
  taskId?: string

  @Prop()
  projectId?: string

  @Prop({ default: false })
  read: boolean
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)