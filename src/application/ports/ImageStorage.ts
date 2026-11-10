export interface ImageFile {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
}

export interface ImageStorage {
  /** Sube la imagen al bucket y devuelve su URL pública. */
  upload(file: ImageFile, folder: string): Promise<string>;
}
