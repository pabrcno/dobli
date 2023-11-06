import { Prisma, PrismaClient, Comment } from "@prisma/client";
import { BaseRepository } from "./i-base-repo";

type CommentCreateInput = {
  comment: Omit<Comment, "id" | "videoId">;
  videoId: number;
};

export class CommentRepository
  implements BaseRepository<Comment, CommentCreateInput>
{
  private static instance: CommentRepository;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): CommentRepository {
    if (!CommentRepository.instance) {
      CommentRepository.instance = new CommentRepository();
    }
    return CommentRepository.instance;
  }

  // Create a new comment
  async create(data: CommentCreateInput): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        ...data.comment,
        video: {
          connect: {
            id: data.videoId,
          },
        },
      },
    });
  }

  // Find a single comment by ID
  async findOne(id: number): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: { id },
    });
  }

  // Find all comments
  async findAll(): Promise<Comment[]> {
    return this.prisma.comment.findMany();
  }

  // Update a comment by ID
  async update(id: number, data: CommentCreateInput): Promise<Comment> {
    return this.prisma.comment.update({
      where: { id },
      data,
    });
  }

  // Delete a comment by ID
  async delete(id: number): Promise<Comment> {
    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
