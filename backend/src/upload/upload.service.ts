import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class UploadService {
  private readonly uploadDir: string;
  private readonly maxSize: number;
  private readonly allowedTypes: string[];

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get('UPLOAD_DIR', './uploads');
    this.maxSize = parseInt(this.configService.get('UPLOAD_MAX_SIZE', '5242880'), 10); // 5MB
    this.allowedTypes = this.configService
      .get('ALLOWED_IMAGE_TYPES', 'image/jpeg,image/png,image/webp')
      .split(',');
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: 'avatars' | 'posters' | 'backdrops',
  ): Promise<string> {
    // Validate file type
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed: ${this.allowedTypes.join(', ')}`,
      );
    }

    // Validate file size
    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `File too large. Maximum size: ${this.maxSize / 1024 / 1024}MB`,
      );
    }

    // Create upload directory if it doesn't exist
    const folderPath = path.join(this.uploadDir, folder);
    await fs.mkdir(folderPath, { recursive: true });

    // Generate unique filename
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
    const filepath = path.join(folderPath, filename);

    // Process image with sharp
    try {
      let sharpInstance = sharp(file.buffer);

      // Resize based on folder type
      switch (folder) {
        case 'avatars':
          sharpInstance = sharpInstance.resize(200, 200, {
            fit: 'cover',
            position: 'center',
          });
          break;
        case 'posters':
          sharpInstance = sharpInstance.resize(500, 750, {
            fit: 'cover',
            withoutEnlargement: true,
          });
          break;
        case 'backdrops':
          sharpInstance = sharpInstance.resize(1920, 1080, {
            fit: 'cover',
            withoutEnlargement: true,
          });
          break;
      }

      // Convert to WebP and save
      await sharpInstance
        .webp({ quality: 85 })
        .toFile(filepath);

      // Return relative URL
      return `/${folder}/${filename}`;
    } catch (error) {
      throw new BadRequestException(`Failed to process image: ${error.message}`);
    }
  }

  async deleteImage(url: string): Promise<void> {
    try {
      const filepath = path.join(this.uploadDir, url);
      await fs.unlink(filepath);
    } catch (error) {
      // Ignore if file doesn't exist
      console.error(`Failed to delete image: ${error.message}`);
    }
  }
}
