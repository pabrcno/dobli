export interface IStorageService {
  uploadFile(fileBuffer: Buffer, destination: string): Promise<string>;
  downloadFile(srcFilename: string, destFilename: string): Promise<void>;
}
