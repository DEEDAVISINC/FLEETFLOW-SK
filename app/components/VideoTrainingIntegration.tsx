'use client';

import { useEffect, useState } from 'react';
import {
  VideoMetadata,
  videoManagementService,
} from '../services/video-management-service';
import FleetFlowVideoPlayer from './FleetFlowVideoPlayer';

interface VideoTrainingIntegrationProps {
  moduleId: string;
  moduleName: string;
  category?: 'training' | 'demo' | 'onboarding';
  showPlaylist?: boolean;
}

export default function VideoTrainingIntegration({
  moduleId,
  moduleName,
  category = 'training',
  showPlaylist = true,
}: VideoTrainingIntegrationProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoMetadata | null>(
    null
  );
  const [moduleVideos, setModuleVideos] = useState<VideoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load videos for this module
    const loadModuleVideos = () => {
      const allVideos = videoManagementService.getVideosByCategory(category);
      const relevantVideos = allVideos.filter(
        (video) =>
          video.tags.includes(moduleId) ||
          video.title.toLowerCase().includes(moduleName.toLowerCase())
      );

      setModuleVideos(relevantVideos);
      if (relevantVideos.length > 0 && !selectedVideo) {
        setSelectedVideo(relevantVideos[0]);
      }
      setIsLoading(false);
    };

    loadModuleVideos();
  }, [moduleId, moduleName, category, selectedVideo]);

  const handleVideoSelect = (video: VideoMetadata) => {
    setSelectedVideo(video);
    // Record view analytics
    videoManagementService.recordView(video.id);
  };

  if (isLoading) {
    return (
      <div
        style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          color: '#3b82f6',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>🔄</div>
        <div>Loading training videos...</div>
      </div>
    );
  }

  if (moduleVideos.length === 0) {
    return (
      <div
        style={{
          background: 'rgba(168, 85, 247, 0.1)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          color: '#a855f7',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>🎬</div>
        <h3
          style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '600' }}
        >
          Video Content Coming Soon
        </h3>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
          Training videos for {moduleName} will be available soon.
          <br />
          Check back later for comprehensive video tutorials.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Module Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            color: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          🎥 {moduleName} - Video Training
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          {moduleVideos.length} video{moduleVideos.length !== 1 ? 's' : ''}{' '}
          available for this module
        </p>
      </div>

      {/* Video Player */}
      {selectedVideo && (
        <div style={{ marginBottom: '32px' }}>
          <FleetFlowVideoPlayer
            video={selectedVideo}
            width='100%'
            height={450}
            autoplay={false}
            controls={true}
            showInfo={true}
          />
        </div>
      )}

      {/* Video Playlist */}
      {showPlaylist && moduleVideos.length > 1 && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            📋 Module Playlist
          </h3>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {moduleVideos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => handleVideoSelect(video)}
                style={{
                  background:
                    selectedVideo?.id === video.id
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(255, 255, 255, 0.03)',
                  border:
                    selectedVideo?.id === video.id
                      ? '1px solid #3b82f6'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background:
                      selectedVideo?.id === video.id
                        ? '#3b82f6'
                        : 'rgba(255, 255, 255, 0.1)',
                    color:
                      selectedVideo?.id === video.id
                        ? 'white'
                        : 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      margin: '0 0 4px 0',
                      fontSize: '16px',
                      fontWeight: '600',
                      color:
                        selectedVideo?.id === video.id
                          ? '#3b82f6'
                          : 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    {video.title}
                  </h4>
                  <p
                    style={{
                      margin: '0 0 4px 0',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {video.description}
                  </p>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      display: 'flex',
                      gap: '12px',
                    }}
                  >
                    <span>⏱️ {video.duration}</span>
                    <span>👁️ {video.viewCount} views</span>
                    <span>📱 {video.type.toUpperCase()}</span>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '20px',
                    color:
                      selectedVideo?.id === video.id
                        ? '#3b82f6'
                        : 'rgba(255, 255, 255, 0.4)',
                  }}
                >
                  {selectedVideo?.id === video.id ? '▶️' : '⏸️'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Progress Tracking */}
      <div
        style={{
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          marginTop: '24px',
        }}
      >
        <h3
          style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#22c55e',
          }}
        >
          📊 Training Progress
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '4px',
              }}
            >
              Videos Watched
            </div>
            <div
              style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}
            >
              {moduleVideos.filter((v) => v.viewCount > 0).length} /{' '}
              {moduleVideos.length}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '4px',
              }}
            >
              Total Watch Time
            </div>
            <div
              style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}
            >
              {Math.floor(
                moduleVideos.reduce((total, video) => {
                  const [minutes, seconds] = (video.duration || '0:0')
                    .split(':')
                    .map(Number);
                  return total + minutes * 60 + (seconds || 0);
                }, 0) / 60
              )}{' '}
              min
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '4px',
              }}
            >
              Completion Rate
            </div>
            <div
              style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}
            >
              {Math.round(
                (moduleVideos.filter((v) => v.viewCount > 0).length /
                  moduleVideos.length) *
                  100
              )}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
