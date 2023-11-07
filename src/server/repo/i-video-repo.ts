import { Video } from "@prisma/client";
import { IBaseRepository } from "./i-base-repo";

export interface IVideoRepo extends IBaseRepository<Video, Omit<Video, "id">> {
  findLatest(): Promise<Video | null>;
}
