import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Video, VideoDocument } from './schemas/video.schema';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';
import * as fs from 'fs';

const pump = promisify(pipeline);

@Injectable()
export class VideosService {
  private uploadDir = join(process.cwd(), '..', 'uploads');

  constructor(@InjectModel(Video.name) private videoModel: Model<VideoDocument>) {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async createVideo(file: Express.Multer.File): Promise<VideoDocument> {
    const video = new this.videoModel({
      originalFilename: file.originalname,
      originalUrl: `/uploads/${file.filename}`,
      status: 'pending',
      highlights: [],
      exports: [],
    });
    return video.save();
  }

  async findAll(): Promise<VideoDocument[]> {
    return this.videoModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<VideoDocument> {
    const video = await this.videoModel.findById(id).exec();
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return video;
  }

  async processHighlights(id: string): Promise<VideoDocument> {
    const video = await this.findOne(id);
    
    video.status = 'processing';
    await video.save();

    // Simulate AI highlight detection
    // In production, this would call OpenAI API or use ML model
    const highlights = this.generateMockHighlights();
    
    video.highlights = highlights;
    video.status = 'processed';
    
    return video.save();
  }

  private generateMockHighlights() {
    // Mock highlights for demo purposes
    // Real implementation would analyze video frames
    return [
      { startTime: 5, endTime: 12, score: 0.95, type: 'knockout' },
      { startTime: 45, endTime: 52, score: 0.88, type: 'combo' },
      { startTime: 120, endTime: 128, score: 0.82, type: 'action' },
      { startTime: 180, endTime: 190, score: 0.78, type: 'defense' },
    ];
  }

  async generateVoiceover(id: string, text?: string): Promise<VideoDocument> {
    const video = await this.findOne(id);
    
    // In production, this would call OpenAI TTS API
    const voiceoverText = text || this.generateVoiceoverText(video.highlights);
    
    video.voiceoverText = voiceoverText;
    video.voiceoverUrl = `/uploads/voiceover-${video._id}.mp3`;
    
    return video.save();
  }

  private generateVoiceoverText(highlights: any[]): string {
    const highlightCount = highlights.length;
    return `This compilation contains ${highlightCount} highlight${highlightCount > 1 ? 's' : ''} from the fight. ` +
      highlights.map((h, i) => `Highlight ${i + 1}: ${h.type} at ${Math.floor(h.startTime / 60)}:${(h.startTime % 60).toString().padStart(2, '0')}`).join('. ');
  }

  async exportVideo(id: string, platform: 'tiktok' | 'reels' | 'shorts'): Promise<VideoDocument> {
    const video = await this.findOne(id);
    
    // In production, this would use FFmpeg to actually process the video
    const exportConfig = {
      tiktok: { format: '9:16', maxDuration: 60 },
      reels: { format: '9:16', maxDuration: 90 },
      shorts: { format: '9:16', maxDuration: 60 },
    };
    
    const config = exportConfig[platform];
    
    video.exports.push({
      platform,
      format: config.format,
      url: `/uploads/export-${video._id}-${platform}.mp4`,
      createdAt: new Date(),
    });
    
    return video.save();
  }

  async deleteVideo(id: string): Promise<void> {
    const result = await this.videoModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
  }
}
