import { IStorageService } from "./i-storage-service";
import { Storage } from "@google-cloud/storage";

export class GCPStorageService implements IStorageService {
  private static instance: GCPStorageService;
  private storage: Storage;
  private bucketName: string;

  // Make the constructor private.
  private constructor(
    bucketName: string,
    projectId: string,
    credentials: string
  ) {
    this.storage = new Storage({
      projectId,
      credentials: JSON.parse(credentials),
    });
    this.bucketName = bucketName;
  }

  // Static method to get the instance of the class.
  public static getInstance(
    bucketName: string,
    projectId: string,
    credentials: string
  ): GCPStorageService {
    if (!GCPStorageService.instance) {
      if (!projectId) {
        throw new Error("GCP Project ID must be provided");
      }
      GCPStorageService.instance = new GCPStorageService(
        bucketName,
        projectId,
        credentials
      );
    }
    return GCPStorageService.instance;
  }

  async uploadFile(fileBuffer: Buffer, destination: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(destination);
    await file.save(fileBuffer);
    return file.publicUrl();
  }

  async downloadFile(srcFilename: string, destFilename: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(srcFilename);
    await file.download({ destination: destFilename });
  }
}
