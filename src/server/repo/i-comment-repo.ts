import { IBaseRepository } from "./i-base-repo";
import { Comment } from "@prisma/client";
export type CommentCreateInput = {
  comment: Omit<Comment, "id" | "videoId">;
  videoId: number;
};

export interface ICommentRepo
  extends IBaseRepository<Comment, CommentCreateInput> {}
