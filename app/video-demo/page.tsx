'use client';

import { useState } from 'react';
import FleetFlowVideoPlayer from '../components/FleetFlowVideoPlayer';

interface DemoVideo {
  id: string;
  type: 'youtube' | 'googledrive' | 'direct' | 'iphone' | 'android';
  url: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration?: string;
  uploadDate?: string;
}

export default function VideoDemoPage() {
  const [selectedVideo, setSelectedVideo] = useState<DemoVideo | null>(null);

  const demoVideos: DemoVideo[] = [
    {
      id: '1',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'FleetFlow Platform Overview',
      description:
        'Complete walkthrough of the FleetFlow transportation management system',
      duration: '5:30',
      uploadDate: '2024-12-19',
    },
    {
      id: '2',
      type: 'googledrive',
      url: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view',
      title: 'Driver Onboarding Tutorial',
      description: 'Step-by-step guide for new drivers joining FleetFlow',
      duration: '8:45',
      uploadDate: '2024-12-18',
    },
    {
      id: '3',
      type: 'direct',
      url: '/videos/fleetflow-demo.mp4',
      title: 'FleetFlow Demo Video',
      description: 'Direct video file demonstration of key features',
      duration: '12:20',
      uploadDate: '2024-12-17',
    },
    {
      id: '4',
      type: 'iphone',
      url: '/videos/mobile-app-demo.mp4',
      title: 'Mobile App Demo',
      description: 'iPhone recording of FleetFlow mobile application',
      duration: '6:15',
      uploadDate: '2024-12-16',
    },
    {
      id: '5',
      type: 'android',
      url: '/videos/android-app-demo.mp4',
      title: 'Android App Demo',
      description: 'Android recording of FleetFlow mobile features',
      duration: '7:30',
      uploadDate: '2024-12-15',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '60px 16px 16px 16px',
        color: 'white',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '700',
              margin: '0 0 16px 0',
            }}
          >
            🎥 FleetFlow Video Player Demo
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
            }}
          >
            Supports YouTube, Google Drive, iPhone, Android, and direct video
            files
          </p>
        </div>

        {/* Free Video Strategy Info */}
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            marginBottom: '40px',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: '#22c55e',
            }}
          >
            💰 100% Free Video Solution
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#22c55e' }}>
                📺 YouTube Hosting
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Unlimited free hosting with professional embeds
              </p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#22c55e' }}>
                ☁️ Google Drive Storage
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                15GB free storage with direct video streaming
              </p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#22c55e' }}>
                📱 Mobile Recording
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                4K recording capability on iPhone/Android
              </p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#22c55e' }}>
                🎬 Professional Quality
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Zero cost for enterprise-grade video system
              </p>
            </div>
          </div>
        </div>

        {/* Video Selection */}
        <div style={{ marginBottom: '40px' }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              margin: '0 0 20px 0',
            }}
          >
            Select a Video to Play
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {demoVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  ...(selectedVideo?.id === video.id && {
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderColor: '#3b82f6',
                  }),
                }}
                onMouseEnter={(e) => {
                  if (selectedVideo?.id !== video.id) {
                    (e.target as HTMLElement).style.background =
                      'rgba(255, 255, 255, 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedVideo?.id !== video.id) {
                    (e.target as HTMLElement).style.background =
                      'rgba(255, 255, 255, 0.05)';
                  }
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>
                    {video.type === 'youtube'
                      ? '📺'
                      : video.type === 'googledrive'
                        ? '☁️'
                        : video.type === 'iphone'
                          ? '📱'
                          : video.type === 'android'
                            ? '🤖'
                            : '🔗'}
                  </span>
                  <h3
                    style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}
                  >
                    {video.title}
                  </h3>
                </div>
                <p
                  style={{
                    margin: '0 0 12px 0',
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
                  }}
                >
                  ⏱️ {video.duration} • 📅 {video.uploadDate}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Player */}
        {selectedVideo && (
          <div style={{ marginBottom: '40px' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                margin: '0 0 20px 0',
              }}
            >
              Now Playing: {selectedVideo.title}
            </h2>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <FleetFlowVideoPlayer
                video={selectedVideo}
                width='100%'
                height={400}
                autoplay={false}
                controls={true}
                showInfo={true}
              />
            </div>
          </div>
        )}

        {/* Features Overview */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              margin: '0 0 20px 0',
              color: '#3b82f6',
            }}
          >
            🚀 Video Player Features
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                }}
              >
                📺 YouTube Integration
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Embed any YouTube video with automatic ID extraction
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                }}
              >
                ☁️ Google Drive Support
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Direct playback from Google Drive shared links
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                }}
              >
                📱 Mobile Recording
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Support for iPhone and Android video files
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                }}
              >
                🔗 Direct Files
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Play any MP4, WebM, or OGG video file
              </p>
            </div>
          </div>
        </div>

        {/* Implementation Guide */}
        <div
          style={{
            background: 'rgba(168, 85, 247, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            marginTop: '40px',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              margin: '0 0 20px 0',
              color: '#a855f7',
            }}
          >
            📋 How to Use This System
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            <div>
              <h4 style={{ margin: '0 0 12px 0', color: '#a855f7' }}>
                1. Record with iPhone/Android
              </h4>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '20px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <li>Use built-in camera app</li>
                <li>Record in 1080p or 4K</li>
                <li>Keep videos under 2GB for Google Drive</li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 12px 0', color: '#a855f7' }}>
                2. Upload to Google Drive
              </h4>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '20px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <li>Upload video to Google Drive</li>
                <li>Right-click → Get link</li>
                <li>Set to ""Anyone with link can view""</li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 12px 0', color: '#a855f7' }}>
                3. Or Upload to YouTube
              </h4>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '20px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <li>Create YouTube channel</li>
                <li>Upload video (public/unlisted)</li>
                <li>Copy YouTube URL</li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 12px 0', color: '#a855f7' }}>
                4. Add to FleetFlow
              </h4>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '20px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <li>Use FleetFlowVideoPlayer component</li>
                <li>Specify video type and URL</li>
                <li>Customize player settings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
