import { Prisma, PrismaClient, Video } from "@prisma/client";

import { IVideoRepo } from "./i-video-repo";

export class VideoRepository implements IVideoRepo {
  private static instance: VideoRepository;
  private prisma: PrismaClient;

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  static getInstance(prisma: PrismaClient): VideoRepository {
    if (!VideoRepository.instance) {
      VideoRepository.instance = new VideoRepository(prisma);
    }
    return VideoRepository.instance;
  }

  async create(data: Prisma.VideoCreateInput): Promise<Video> {
    return this.prisma.video.create({ data });
  }

  async findOne(id: number): Promise<Video | null> {
    return this.prisma.video.findUnique({ where: { id } });
  }

  async findAll(): Promise<Video[]> {
    return this.prisma.video.findMany();
  }

  async update(
    id: number,
    data: Partial<Prisma.VideoCreateInput>
  ): Promise<Video> {
    return this.prisma.video.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Video> {
    return this.prisma.video.delete({ where: { id } });
  }

  async findLatest(): Promise<Video | null> {
    return this.prisma.video.findFirst({
      orderBy: { updatedAt: "desc" },
    });
  }
}
