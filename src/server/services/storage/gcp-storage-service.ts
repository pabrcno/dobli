import { IStorageService } from "./i-storage-service";
import { Storage } from "@google-cloud/storage";
export class GCPStorageService implements IStorageService {
  private storage: Storage;
  private bucketName: string;

  constructor(bucketName: string) {
    this.storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: "service-account.json",
    });
    this.bucketName = bucketName;
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
    await file.download({
      destination: destFilename,
    });
  }
}
