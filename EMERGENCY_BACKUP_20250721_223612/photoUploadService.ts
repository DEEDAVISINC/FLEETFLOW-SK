// 📸 Photo and Document Upload Service for FleetFlow
// Handles uploads to Cloudinary with real-time progress and optimization

export interface UploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
  originalName: string;
  size: number;
  format: string;
  width?: number;
  height?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type FileCategory = 'pickup' | 'delivery' | 'confirmation' | 'signature' | 'document' | 'inspection';
export type FileType = 'photo' | 'signature' | 'document' | 'pdf';

class PhotoUploadService {
  private cloudName: string;
  private uploadPreset: string;
  private apiKey: string;

  constructor() {
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
    this.uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'fleetflow_photos';
    this.apiKey = process.env.CLOUDINARY_API_KEY || '';
  }

  /**
   * Upload a single file to Cloudinary
   */
  async uploadFile(
    file: File,
    options: {
      category: FileCategory;
      driverId: string;
      loadId?: string;
      onProgress?: (progress: UploadProgress) => void;
    }
  ): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    
    // Create organized folder structure
    const folder = `fleetflow/${options.category}/${options.driverId}`;
    formData.append('folder', folder);
    
    // Add metadata
    const context = {
      driver_id: options.driverId,
      category: options.category,
      original_name: file.name,
      upload_timestamp: new Date().toISOString(),
      ...(options.loadId && { load_id: options.loadId })
    };
    formData.append('context', Object.entries(context).map(([k, v]) => `${k}=${v}`).join('|'));

    // Set public ID with timestamp for uniqueness
    const timestamp = Date.now();
    const publicId = `${folder}/${options.category}_${timestamp}`;
    formData.append('public_id', publicId);

    try {
      const xhr = new XMLHttpRequest();
      
      return new Promise<UploadResult>((resolve, reject) => {
        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && options.onProgress) {
            options.onProgress({
              loaded: e.loaded,
              total: e.total,
              percentage: Math.round((e.loaded / e.total) * 100)
            });
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve({
              url: response.url,
              publicId: response.public_id,
              secureUrl: response.secure_url,
              originalName: file.name,
              size: response.bytes,
              format: response.format,
              width: response.width,
              height: response.height
            });
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed due to network error'));
        });

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`);
        xhr.send(formData);
      });
    } catch (error) {
      throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload multiple files with progress tracking
   */
  async uploadMultipleFiles(
    files: File[],
    options: {
      category: FileCategory;
      driverId: string;
      loadId?: string;
      onProgress?: (fileIndex: number, progress: UploadProgress) => void;
      onComplete?: (fileIndex: number, result: UploadResult) => void;
    }
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadFile(files[i], {
          ...options,
          onProgress: (progress) => options.onProgress?.(i, progress)
        });
        
        results.push(result);
        options.onComplete?.(i, result);
      } catch (error) {
        console.error(`Failed to upload file ${i + 1}:`, error);
        throw error;
      }
    }
    
    return results;
  }

  /**
   * Upload signature as base64 data URL
   */
  async uploadSignature(
    dataUrl: string,
    options: {
      driverId: string;
      loadId?: string;
      signatureType: 'driver' | 'receiver';
    }
  ): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', dataUrl);
    formData.append('upload_preset', this.uploadPreset);
    
    const folder = `fleetflow/signatures/${options.driverId}`;
    formData.append('folder', folder);
    
    const timestamp = Date.now();
    const publicId = `${folder}/${options.signatureType}_signature_${timestamp}`;
    formData.append('public_id', publicId);

    const context = {
      driver_id: options.driverId,
      signature_type: options.signatureType,
      upload_timestamp: new Date().toISOString(),
      ...(options.loadId && { load_id: options.loadId })
    };
    formData.append('context', Object.entries(context).map(([k, v]) => `${k}=${v}`).join('|'));

    const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Signature upload failed with status ${response.status}`);
    }

    const result = await response.json();
    return {
      url: result.url,
      publicId: result.public_id,
      secureUrl: result.secure_url,
      originalName: 'signature.png',
      size: result.bytes,
      format: result.format,
      width: result.width,
      height: result.height
    };
  }

  /**
   * Generate optimized image URLs for display
   */
  getOptimizedUrl(publicId: string, options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
  } = {}): string {
    const transformations = [];
    
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);
    
    const transformStr = transformations.length > 0 ? `${transformations.join(',')}/` : '';
    
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformStr}${publicId}`;
  }

  /**
   * Delete a file from Cloudinary
   */
  async deleteFile(publicId: string): Promise<boolean> {
    try {
      // Note: This requires server-side implementation for security
      // Frontend cannot directly delete files due to API key restrictions
      const response = await fetch('/api/cloudinary/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to delete file:', error);
      return false;
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, category: FileCategory): { valid: boolean; error?: string } {
    const maxSize = category === 'document' ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB for docs, 5MB for images
    const allowedTypes = category === 'document' 
      ? ['application/pdf', 'image/jpeg', 'image/png']
      : ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const photoUploadService = new PhotoUploadService();

// React hook for easy integration
import { useState } from 'react';

export function usePhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<number, UploadProgress>>({});
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = async (
    files: File[],
    options: {
      category: FileCategory;
      driverId: string;
      loadId?: string;
    }
  ): Promise<UploadResult[]> => {
    setUploading(true);
    setError(null);
    setProgress({});

    try {
      const results = await photoUploadService.uploadMultipleFiles(files, {
        ...options,
        onProgress: (fileIndex, progress) => {
          setProgress(prev => ({ ...prev, [fileIndex]: progress }));
        }
      });

      setProgress({});
      return results;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const uploadSignature = async (
    dataUrl: string,
    options: {
      driverId: string;
      loadId?: string;
      signatureType: 'driver' | 'receiver';
    }
  ): Promise<UploadResult> => {
    setUploading(true);
    setError(null);

    try {
      const result = await photoUploadService.uploadSignature(dataUrl, options);
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signature upload failed');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFiles,
    uploadSignature,
    uploading,
    progress,
    error,
    clearError: () => setError(null)
  };
}
