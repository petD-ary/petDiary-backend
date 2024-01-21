import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(@UploadedFiles() files) {
    const imageUrls: string[] = [];
    await Promise.all(
      files.map(async (file: any) => {
        const key = await this.uploadsService.uploadImage(file);
        imageUrls.push(process.env.AWS_BUCKET_ADDRESS + key);
      }),
    );

    return {
      message: `이미지 등록 성공`,
      data: imageUrls,
    };
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    const key = await this.uploadsService.uploadImage(file);
    const imageUrl = process.env.AWS_BUCKET_ADDRESS + key;

    return {
      message: `이미지 등록 성공`,
      data: imageUrl,
    };
  }
}
