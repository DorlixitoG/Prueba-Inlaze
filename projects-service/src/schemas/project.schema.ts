import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type ProjectDocument = Project & Document

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  ownerId: string

  @Prop({ type: [String], default: [] })
  members: string[]
}

export const ProjectSchema = SchemaFactory.createForClass(Project)
