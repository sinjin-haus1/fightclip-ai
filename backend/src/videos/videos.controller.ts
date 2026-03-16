import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  UseInterceptors, 
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { VideosService } from './videos.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('api/videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
  }))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    const video = await this.videosService.createVideo(file);
    return {
      id: video._id,
      filename: video.originalFilename,
      url: video.originalUrl,
      status: video.status,
    };
  }

  @Get()
  async findAll() {
    const videos = await this.videosService.findAll();
    return videos.map(v => ({
      id: v._id,
      filename: v.originalFilename,
      url: v.originalUrl,
      status: v.status,
      highlightsCount: v.highlights.length,
      exportsCount: v.exports.length,
      createdAt: v.createdAt,
    }));
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const video = await this.videosService.findOne(id);
    return {
      id: video._id,
      filename: video.originalFilename,
      url: video.originalUrl,
      status: video.status,
      highlights: video.highlights,
      exports: video.exports,
      voiceoverUrl: video.voiceoverUrl,
      voiceoverText: video.voiceoverText,
      duration: video.duration,
      thumbnailUrl: video.thumbnailUrl,
      createdAt: video.createdAt,
    };
  }

  @Post(':id/process')
  async processVideo(@Param('id', ParseUUIDPipe) id: string) {
    const video = await this.videosService.processHighlights(id);
    return {
      id: video._id,
      status: video.status,
      highlights: video.highlights,
    };
  }

  @Post(':id/voiceover')
  async generateVoiceover(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('text') text?: string,
  ) {
    const video = await this.videosService.generateVoiceover(id, text);
    return {
      id: video._id,
      voiceoverUrl: video.voiceoverUrl,
      voiceoverText: video.voiceoverText,
    };
  }

  @Post(':id/export')
  async exportVideo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('platform') platform: 'tiktok' | 'reels' | 'shorts',
  ) {
    const video = await this.videosService.exportVideo(id, platform);
    const export_ = video.exports[video.exports.length - 1];
    return {
      id: video._id,
      platform: export_.platform,
      url: export_.url,
    };
  }

  @Delete(':id')
  async deleteVideo(@Param('id', ParseUUIDPipe) id: string) {
    await this.videosService.deleteVideo(id);
    return { success: true, message: `Video ${id} deleted` };
  }
}
