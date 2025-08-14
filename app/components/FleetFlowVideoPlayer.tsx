'use client';

import { useState } from 'react';

interface VideoSource {
  type: 'youtube' | 'googledrive' | 'direct' | 'iphone' | 'android';
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
  uploadDate?: string;
}

interface FleetFlowVideoPlayerProps {
  video: VideoSource;
  width?: string | number;
  height?: string | number;
  autoplay?: boolean;
  controls?: boolean;
  showInfo?: boolean;
  className?: string;
}

export default function FleetFlowVideoPlayer({
  video,
  width = '100%',
  height = 'auto',
  autoplay = false,
  controls = true,
  showInfo = true,
  className = '',
}: FleetFlowVideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Get Google Drive direct link
  const getGoogleDriveDirectLink = (url: string): string => {
    // Convert Google Drive sharing link to direct download link
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }
    return url;
  };

  // Render video based on source type
  const renderVideo = () => {
    switch (video.type) {
      case 'youtube':
        const youtubeId = getYouTubeId(video.url);
        if (!youtubeId) {
          setError('Invalid YouTube URL');
          return null;
        }
        return (
          <iframe
            width={width}
            height={height === 'auto' ? 315 : height}
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}&rel=0`}
            title={video.title}
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            onLoad={() => setIsLoaded(true)}
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          />
        );

      case 'googledrive':
        const directLink = getGoogleDriveDirectLink(video.url);
        return (
          <video
            width={width}
            height={height}
            controls={controls}
            autoPlay={autoplay}
            preload='metadata'
            onLoadStart={() => setIsLoaded(true)}
            onError={(e) => setError('Failed to load video')}
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <source src={directLink} type='video/mp4' />
            <source src={directLink} type='video/webm' />
            <source src={directLink} type='video/ogg' />
            Your browser does not support the video tag.
          </video>
        );

      case 'direct':
      case 'iphone':
      case 'android':
        return (
          <video
            width={width}
            height={height}
            controls={controls}
            autoPlay={autoplay}
            preload='metadata'
            poster={video.thumbnail}
            onLoadStart={() => setIsLoaded(true)}
            onError={(e) => setError('Failed to load video')}
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <source src={video.url} type='video/mp4' />
            <source src={video.url} type='video/webm' />
            <source src={video.url} type='video/ogg' />
            Your browser does not support the video tag.
          </video>
        );

      default:
        setError('Unsupported video type');
        return null;
    }
  };

  return (
    <div
      className={`fleetflow-video-player ${className}`}
      style={{ width: '100%' }}
    >
      {error ? (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            color: '#ef4444',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>❌</div>
          <div>Error: {error}</div>
        </div>
      ) : (
        <>
          {!isLoaded && (
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                color: '#3b82f6',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔄</div>
              <div>Loading video...</div>
            </div>
          )}

          {renderVideo()}

          {showInfo && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {video.title}
              </h3>

              {video.description && (
                <p
                  style={{
                    margin: '0 0 8px 0',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    lineHeight: '1.5',
                  }}
                >
                  {video.description}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                {video.duration && <span>⏱️ {video.duration}</span>}
                {video.uploadDate && (
                  <span>
                    📅 {new Date(video.uploadDate).toLocaleDateString()}
                  </span>
                )}
                <span>📱 {video.type.toUpperCase()}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
