import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import  { Model } from "mongoose"
import  { CommentDocument } from "./schemas/comment.schema"
import  { CreateCommentDto, UpdateCommentDto } from "./dto/comment.dto"
import { InjectModel } from "@nestjs/mongoose"

@Injectable()
export class CommentsService {

constructor(
  @InjectModel("Comment") private readonly commentModel: Model<CommentDocument>,
) {}


  async create(createCommentDto: CreateCommentDto & { userId: string; userName: string }) {
    const comment = new this.commentModel(createCommentDto)
    return comment.save()
  }

  async findByTask(taskId: string) {
    return this.commentModel.find({ taskId }).sort({ createdAt: -1 })
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string) {
    const comment = await this.commentModel.findById(id)
    if (!comment) {
      throw new NotFoundException("Comment not found")
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException("Only comment author can update")
    }

    return this.commentModel.findByIdAndUpdate(id, updateCommentDto, { new: true })
  }

  async remove(id: string, userId: string) {
    const comment = await this.commentModel.findById(id)
    if (!comment) {
      throw new NotFoundException("Comment not found")
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException("Only comment author can delete")
    }

    return this.commentModel.findByIdAndDelete(id)
  }
}
