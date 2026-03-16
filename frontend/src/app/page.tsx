'use client';

import { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Button, Card, CardContent, CircularProgress, Alert, Chip, IconButton } from '@mui/material';
import { CloudUpload, Delete, PlayArrow, Download, Refresh } from '@mui/icons-material';
import { videosApi, Video } from '../lib/api';

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await videosApi.getAll();
      setVideos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load videos. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await videosApi.upload(file);
      await fetchVideos();
      setError(null);
    } catch (err) {
      setError('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleProcess = async (id: string) => {
    try {
      await videosApi.process(id);
      await fetchVideos();
    } catch (err) {
      setError('Failed to process video');
    }
  };

  const handleVoiceover = async (id: string) => {
    try {
      await videosApi.generateVoiceover(id);
      await fetchVideos();
    } catch (err) {
      setError('Failed to generate voiceover');
    }
  };

  const handleExport = async (id: string, platform: 'tiktok' | 'reels' | 'shorts') => {
    try {
      await videosApi.exportVideo(id, platform);
      await fetchVideos();
    } catch (err) {
      setError('Failed to export video');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await videosApi.delete(id);
      await fetchVideos();
    } catch (err) {
      setError('Failed to delete video');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'success';
      case 'processing': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0a', color: '#fff', py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            🥊 FightClip AI
          </Typography>
          <Typography variant="h6" sx={{ color: '#888', mb: 4 }}>
            Automated Boxing & MMA Highlight Generator
          </Typography>
          
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
              disabled={uploading}
              sx={{ bgcolor: '#ff4444', '&:hover': { bgcolor: '#cc3333' } }}
            >
              {uploading ? 'Uploading...' : 'Upload Fight Video'}
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={handleUpload}
              />
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchVideos}
              disabled={loading}
              sx={{ borderColor: '#444', color: '#fff', '&:hover': { borderColor: '#666' } }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#ff4444' }} />
          </Box>
        ) : videos.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: '#666' }}>
            <Typography>No videos yet. Upload your first fight footage!</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {videos.map((video) => (
              <Card key={video.id} sx={{ bgcolor: '#1a1a1a', border: '1px solid #333' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: '#fff' }}>
                      {video.filename}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Chip 
                        label={video.status} 
                        size="small" 
                        color={getStatusColor(video.status) as any}
                      />
                      {video.highlightsCount > 0 && (
                        <Typography variant="body2" sx={{ color: '#888' }}>
                          {video.highlightsCount} highlights
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {video.status === 'pending' && (
                      <Button
                        size="small"
                        startIcon={<PlayArrow />}
                        onClick={() => handleProcess(video.id)}
                        sx={{ color: '#ff4444' }}
                      >
                        Detect
                      </Button>
                    )}
                    
                    {video.status === 'processed' && !video.voiceoverUrl && (
                      <Button
                        size="small"
                        onClick={() => handleVoiceover(video.id)}
                        sx={{ color: '#44ff44' }}
                      >
                        Voiceover
                      </Button>
                    )}
                    
                    {video.status === 'processed' && (
                      <>
                        <Button
                          size="small"
                          startIcon={<Download />}
                          onClick={() => handleExport(video.id, 'tiktok')}
                          sx={{ color: '#fff' }}
                        >
                          TikTok
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Download />}
                          onClick={() => handleExport(video.id, 'reels')}
                          sx={{ color: '#fff' }}
                        >
                          Reels
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Download />}
                          onClick={() => handleExport(video.id, 'shorts')}
                          sx={{ color: '#fff' }}
                        >
                          Shorts
                        </Button>
                      </>
                    )}
                    
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(video.id)}
                      sx={{ color: '#ff4444' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        <Box sx={{ mt: 6, textAlign: 'center', color: '#666' }}>
          <Typography variant="body2">
            FightClip AI © 2026 — Upload, detect highlights, add voiceover, export
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
