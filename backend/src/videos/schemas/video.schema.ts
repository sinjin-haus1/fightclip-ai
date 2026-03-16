import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema()
export class Highlight {
  @Prop({ required: true })
  startTime: number;

  @Prop({ required: true })
  endTime: number;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true, enum: ['knockout', 'combo', 'defense', 'action'] })
  type: string;
}

export const HighlightSchema = SchemaFactory.createForClass(Highlight);

@Schema()
export class Export {
  @Prop({ required: true, enum: ['tiktok', 'reels', 'shorts'] })
  platform: string;

  @Prop()
  format: string;

  @Prop()
  url: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ExportSchema = SchemaFactory.createForClass(Export);

@Schema({ timestamps: true })
export class Video {
  @Prop({ required: true })
  originalFilename: string;

  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, enum: ['pending', 'processing', 'processed', 'error'] })
  status: string;

  @Prop({ type: [HighlightSchema], default: [] })
  highlights: Highlight[];

  @Prop({ type: [ExportSchema], default: [] })
  exports: Export[];

  @Prop()
  duration: number;

  @Prop()
  thumbnailUrl: string;

  @Prop()
  voiceoverUrl: string;

  @Prop()
  voiceoverText: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
