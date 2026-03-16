import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

export interface Highlight {
  startTime: number;
  endTime: number;
  score: number;
  type: 'knockout' | 'combo' | 'defense' | 'action';
}

export interface Export {
  platform: 'tiktok' | 'reels' | 'shorts';
  format: string;
  url: string;
  createdAt: string;
}

export interface Video {
  id: string;
  filename: string;
  url: string;
  status: 'pending' | 'processing' | 'processed' | 'error';
  highlights: Highlight[];
  exports: Export[];
  voiceoverUrl?: string;
  voiceoverText?: string;
  duration?: number;
  thumbnailUrl?: string;
  createdAt: string;
}

export const videosApi = {
  upload: async (file: File): Promise<Video> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getAll: async (): Promise<Video[]> => {
    const response = await api.get('/api/videos');
    return response.data;
  },

  getOne: async (id: string): Promise<Video> => {
    const response = await api.get(`/api/videos/${id}`);
    return response.data;
  },

  process: async (id: string): Promise<{ status: string; highlights: Highlight[] }> => {
    const response = await api.post(`/api/videos/${id}/process`);
    return response.data;
  },

  generateVoiceover: async (id: string, text?: string): Promise<{ voiceoverUrl: string; voiceoverText: string }> => {
    const response = await api.post(`/api/videos/${id}/voiceover`, { text });
    return response.data;
  },

  exportVideo: async (id: string, platform: 'tiktok' | 'reels' | 'shorts'): Promise<{ url: string }> => {
    const response = await api.post(`/api/videos/${id}/export`, { platform });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/videos/${id}`);
  },
};

export default api;
