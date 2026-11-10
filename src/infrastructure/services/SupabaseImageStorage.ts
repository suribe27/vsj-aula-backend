import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../../application/errors/AppError';
import { ImageFile, ImageStorage } from '../../application/ports/ImageStorage';

export class SupabaseImageStorage implements ImageStorage {
  private readonly client: SupabaseClient;

  constructor(
    url: string,
    serviceRoleKey: string,
    private readonly bucket: string,
  ) {
    this.client = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  }

  async upload(file: ImageFile, folder: string): Promise<string> {
    const extension = extname(file.originalName).toLowerCase() || '.jpg';
    const path = `${folder}/${randomUUID()}${extension}`;

    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(path, file.buffer, { contentType: file.mimeType, upsert: false });
    if (error) {
      throw new AppError('No se pudo subir la imagen, intenta de nuevo', 502);
    }

    const { data } = this.client.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
