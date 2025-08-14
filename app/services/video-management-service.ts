/**
 * FleetFlow Video Management Service
 * Handles video metadata, playlists, and integration with YouTube/Google Drive
 */

export interface VideoMetadata {
  id: string;
  type: 'youtube' | 'googledrive' | 'direct' | 'iphone' | 'android';
  url: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration?: string;
  uploadDate: string;
  category: 'training' | 'demo' | 'onboarding' | 'marketing' | 'support';
  tags: string[];
  visibility: 'public' | 'private' | 'internal';
  viewCount: number;
  createdBy: string;
  lastModified: string;
}

export interface VideoPlaylist {
  id: string;
  name: string;
  description: string;
  videos: string[]; // Array of video IDs
  category: string;
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
}

export interface VideoAnalytics {
  videoId: string;
  views: number;
  completionRate: number;
  averageWatchTime: number;
  lastViewed: string;
  userEngagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

class VideoManagementService {
  private videos: Map<string, VideoMetadata> = new Map();
  private playlists: Map<string, VideoPlaylist> = new Map();
  private analytics: Map<string, VideoAnalytics> = new Map();

  constructor() {
    this.initializeDemoData();
    this.loadFromStorage();
  }

  // Initialize with demo video data
  private initializeDemoData(): void {
    const demoVideos: VideoMetadata[] = [
      {
        id: 'ff-overview-001',
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'FleetFlow Platform Overview',
        description:
          'Complete walkthrough of the FleetFlow transportation management system covering all major features',
        duration: '5:30',
        uploadDate: '2024-12-19',
        category: 'demo',
        tags: ['platform', 'overview', 'features'],
        visibility: 'public',
        viewCount: 1247,
        createdBy: 'FleetFlow Team',
        lastModified: '2024-12-19T10:00:00Z',
      },
      {
        id: 'ff-onboarding-001',
        type: 'googledrive',
        url: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view',
        title: 'Driver Onboarding Tutorial',
        description:
          'Step-by-step guide for new drivers joining FleetFlow platform',
        duration: '8:45',
        uploadDate: '2024-12-18',
        category: 'onboarding',
        tags: ['driver', 'onboarding', 'tutorial'],
        visibility: 'internal',
        viewCount: 856,
        createdBy: 'Training Team',
        lastModified: '2024-12-18T14:30:00Z',
      },
      {
        id: 'ff-mobile-ios-001',
        type: 'iphone',
        url: '/videos/mobile-app-demo.mp4',
        title: 'FleetFlow Mobile App - iOS Demo',
        description:
          'iPhone recording demonstrating FleetFlow mobile application features',
        duration: '6:15',
        uploadDate: '2024-12-16',
        category: 'demo',
        tags: ['mobile', 'ios', 'app'],
        visibility: 'public',
        viewCount: 423,
        createdBy: 'Mobile Team',
        lastModified: '2024-12-16T09:15:00Z',
      },
      {
        id: 'ff-mobile-android-001',
        type: 'android',
        url: '/videos/android-app-demo.mp4',
        title: 'FleetFlow Mobile App - Android Demo',
        description:
          'Android recording showcasing FleetFlow mobile features and workflow',
        duration: '7:30',
        uploadDate: '2024-12-15',
        category: 'demo',
        tags: ['mobile', 'android', 'app'],
        visibility: 'public',
        viewCount: 389,
        createdBy: 'Mobile Team',
        lastModified: '2024-12-15T16:45:00Z',
      },
      {
        id: 'ff-training-dispatch-001',
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=example123',
        title: 'Dispatch Operations Training',
        description:
          'Comprehensive training for dispatch operations and load management',
        duration: '12:20',
        uploadDate: '2024-12-14',
        category: 'training',
        tags: ['dispatch', 'operations', 'training'],
        visibility: 'internal',
        viewCount: 692,
        createdBy: 'Training Team',
        lastModified: '2024-12-14T11:20:00Z',
      },
    ];

    demoVideos.forEach((video) => {
      this.videos.set(video.id, video);
      // Initialize analytics
      this.analytics.set(video.id, {
        videoId: video.id,
        views: video.viewCount,
        completionRate: Math.random() * 100,
        averageWatchTime: Math.random() * 300,
        lastViewed: new Date().toISOString(),
        userEngagement: {
          likes: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 10),
        },
      });
    });

    // Create demo playlists
    const demoPlaylists: VideoPlaylist[] = [
      {
        id: 'playlist-training-001',
        name: 'FleetFlow University Training',
        description: 'Complete training series for all FleetFlow users',
        videos: ['ff-onboarding-001', 'ff-training-dispatch-001'],
        category: 'training',
        createdBy: 'Training Team',
        createdAt: '2024-12-19T10:00:00Z',
        isPublic: false,
      },
      {
        id: 'playlist-demo-001',
        name: 'Platform Demonstration',
        description: 'Showcase videos highlighting FleetFlow capabilities',
        videos: [
          'ff-overview-001',
          'ff-mobile-ios-001',
          'ff-mobile-android-001',
        ],
        category: 'demo',
        createdBy: 'Marketing Team',
        createdAt: '2024-12-19T10:00:00Z',
        isPublic: true,
      },
    ];

    demoPlaylists.forEach((playlist) => {
      this.playlists.set(playlist.id, playlist);
    });
  }

  // Load data from localStorage
  private loadFromStorage(): void {
    try {
      const storedVideos = localStorage.getItem('fleetflow_videos');
      const storedPlaylists = localStorage.getItem('fleetflow_playlists');
      const storedAnalytics = localStorage.getItem('fleetflow_video_analytics');

      if (storedVideos) {
        const videosData = JSON.parse(storedVideos);
        Object.entries(videosData).forEach(([id, video]) => {
          this.videos.set(id, video as VideoMetadata);
        });
      }

      if (storedPlaylists) {
        const playlistsData = JSON.parse(storedPlaylists);
        Object.entries(playlistsData).forEach(([id, playlist]) => {
          this.playlists.set(id, playlist as VideoPlaylist);
        });
      }

      if (storedAnalytics) {
        const analyticsData = JSON.parse(storedAnalytics);
        Object.entries(analyticsData).forEach(([id, analytics]) => {
          this.analytics.set(id, analytics as VideoAnalytics);
        });
      }
    } catch (error) {
      console.error('Error loading video data from storage:', error);
    }
  }

  // Save data to localStorage
  private saveToStorage(): void {
    try {
      const videosObj = Object.fromEntries(this.videos);
      const playlistsObj = Object.fromEntries(this.playlists);
      const analyticsObj = Object.fromEntries(this.analytics);

      localStorage.setItem('fleetflow_videos', JSON.stringify(videosObj));
      localStorage.setItem('fleetflow_playlists', JSON.stringify(playlistsObj));
      localStorage.setItem(
        'fleetflow_video_analytics',
        JSON.stringify(analyticsObj)
      );
    } catch (error) {
      console.error('Error saving video data to storage:', error);
    }
  }

  // Video Management Methods
  addVideo(
    video: Omit<VideoMetadata, 'id' | 'viewCount' | 'lastModified'>
  ): VideoMetadata {
    const id = `ff-${video.category}-${Date.now()}`;
    const newVideo: VideoMetadata = {
      ...video,
      id,
      viewCount: 0,
      lastModified: new Date().toISOString(),
    };

    this.videos.set(id, newVideo);

    // Initialize analytics
    this.analytics.set(id, {
      videoId: id,
      views: 0,
      completionRate: 0,
      averageWatchTime: 0,
      lastViewed: new Date().toISOString(),
      userEngagement: { likes: 0, comments: 0, shares: 0 },
    });

    this.saveToStorage();
    return newVideo;
  }

  getVideo(id: string): VideoMetadata | null {
    return this.videos.get(id) || null;
  }

  getAllVideos(): VideoMetadata[] {
    return Array.from(this.videos.values());
  }

  getVideosByCategory(category: string): VideoMetadata[] {
    return Array.from(this.videos.values()).filter(
      (video) => video.category === category
    );
  }

  updateVideo(id: string, updates: Partial<VideoMetadata>): boolean {
    const video = this.videos.get(id);
    if (!video) return false;

    const updatedVideo = {
      ...video,
      ...updates,
      lastModified: new Date().toISOString(),
    };

    this.videos.set(id, updatedVideo);
    this.saveToStorage();
    return true;
  }

  deleteVideo(id: string): boolean {
    const deleted = this.videos.delete(id);
    if (deleted) {
      this.analytics.delete(id);
      // Remove from playlists
      this.playlists.forEach((playlist, playlistId) => {
        const updatedVideos = playlist.videos.filter(
          (videoId) => videoId !== id
        );
        if (updatedVideos.length !== playlist.videos.length) {
          this.playlists.set(playlistId, {
            ...playlist,
            videos: updatedVideos,
          });
        }
      });
      this.saveToStorage();
    }
    return deleted;
  }

  // Playlist Management Methods
  createPlaylist(
    playlist: Omit<VideoPlaylist, 'id' | 'createdAt'>
  ): VideoPlaylist {
    const id = `playlist-${Date.now()}`;
    const newPlaylist: VideoPlaylist = {
      ...playlist,
      id,
      createdAt: new Date().toISOString(),
    };

    this.playlists.set(id, newPlaylist);
    this.saveToStorage();
    return newPlaylist;
  }

  getPlaylist(id: string): VideoPlaylist | null {
    return this.playlists.get(id) || null;
  }

  getAllPlaylists(): VideoPlaylist[] {
    return Array.from(this.playlists.values());
  }

  addVideoToPlaylist(playlistId: string, videoId: string): boolean {
    const playlist = this.playlists.get(playlistId);
    const video = this.videos.get(videoId);

    if (!playlist || !video) return false;
    if (playlist.videos.includes(videoId)) return false;

    playlist.videos.push(videoId);
    this.playlists.set(playlistId, playlist);
    this.saveToStorage();
    return true;
  }

  removeVideoFromPlaylist(playlistId: string, videoId: string): boolean {
    const playlist = this.playlists.get(playlistId);
    if (!playlist) return false;

    const updatedVideos = playlist.videos.filter((id) => id !== videoId);
    if (updatedVideos.length === playlist.videos.length) return false;

    playlist.videos = updatedVideos;
    this.playlists.set(playlistId, playlist);
    this.saveToStorage();
    return true;
  }

  // Analytics Methods
  recordView(videoId: string): void {
    const video = this.videos.get(videoId);
    const analytics = this.analytics.get(videoId);

    if (video && analytics) {
      // Update video view count
      video.viewCount += 1;
      this.videos.set(videoId, video);

      // Update analytics
      analytics.views += 1;
      analytics.lastViewed = new Date().toISOString();
      this.analytics.set(videoId, analytics);

      this.saveToStorage();
    }
  }

  getVideoAnalytics(videoId: string): VideoAnalytics | null {
    return this.analytics.get(videoId) || null;
  }

  getAllAnalytics(): VideoAnalytics[] {
    return Array.from(this.analytics.values());
  }

  // Utility Methods
  searchVideos(query: string): VideoMetadata[] {
    const searchTerm = query.toLowerCase();
    return Array.from(this.videos.values()).filter(
      (video) =>
        video.title.toLowerCase().includes(searchTerm) ||
        video.description.toLowerCase().includes(searchTerm) ||
        video.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  }

  getVideosByTag(tag: string): VideoMetadata[] {
    return Array.from(this.videos.values()).filter((video) =>
      video.tags.includes(tag)
    );
  }

  getPopularVideos(limit: number = 10): VideoMetadata[] {
    return Array.from(this.videos.values())
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, limit);
  }

  getRecentVideos(limit: number = 10): VideoMetadata[] {
    return Array.from(this.videos.values())
      .sort(
        (a, b) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      )
      .slice(0, limit);
  }

  // YouTube Integration Helpers
  extractYouTubeId(url: string): string | null {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  // Google Drive Integration Helpers
  extractGoogleDriveId(url: string): string | null {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  }

  getGoogleDriveDirectLink(url: string): string {
    const fileId = this.extractGoogleDriveId(url);
    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    return url;
  }

  // Video Processing Helpers
  generateThumbnail(videoUrl: string, timeOffset: number = 5): string {
    // For YouTube videos, use YouTube's thumbnail API
    const youtubeId = this.extractYouTubeId(videoUrl);
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }

    // For other videos, return placeholder
    return '/images/video-thumbnail-placeholder.jpg';
  }

  // Export/Import Methods
  exportVideoData(): string {
    const data = {
      videos: Object.fromEntries(this.videos),
      playlists: Object.fromEntries(this.playlists),
      analytics: Object.fromEntries(this.analytics),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  importVideoData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.videos) {
        Object.entries(data.videos).forEach(([id, video]) => {
          this.videos.set(id, video as VideoMetadata);
        });
      }

      if (data.playlists) {
        Object.entries(data.playlists).forEach(([id, playlist]) => {
          this.playlists.set(id, playlist as VideoPlaylist);
        });
      }

      if (data.analytics) {
        Object.entries(data.analytics).forEach(([id, analytics]) => {
          this.analytics.set(id, analytics as VideoAnalytics);
        });
      }

      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Error importing video data:', error);
      return false;
    }
  }

  // Statistics Methods
  getVideoStats(): {
    totalVideos: number;
    totalViews: number;
    averageCompletionRate: number;
    categoryCounts: Record<string, number>;
    popularTags: Array<{ tag: string; count: number }>;
  } {
    const videos = Array.from(this.videos.values());
    const analytics = Array.from(this.analytics.values());

    const categoryCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};

    videos.forEach((video) => {
      categoryCounts[video.category] =
        (categoryCounts[video.category] || 0) + 1;
      video.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const popularTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalVideos: videos.length,
      totalViews: videos.reduce((sum, video) => sum + video.viewCount, 0),
      averageCompletionRate:
        analytics.reduce((sum, a) => sum + a.completionRate, 0) /
        analytics.length,
      categoryCounts,
      popularTags,
    };
  }
}

// Create singleton instance
export const videoManagementService = new VideoManagementService();
export default VideoManagementService;
