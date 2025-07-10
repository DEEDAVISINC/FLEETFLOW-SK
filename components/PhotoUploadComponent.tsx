// 📸 Enhanced Photo Upload Component with Real Cloudinary Integration
// components/PhotoUploadComponent.tsx

'use client';

import React, { useState, useRef } from 'react';

interface PhotoUploadComponentProps {
  category: 'pickup' | 'delivery' | 'confirmation' | 'signature' | 'document' | 'inspection';
  driverId: string;
  loadId?: string;
  maxFiles?: number;
  onUploadComplete?: (urls: string[]) => void;
  onUploadProgress?: (progress: number) => void;
  title?: string;
  description?: string;
  acceptedTypes?: string[];
}

interface UploadedFile {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  error?: string;
  progress: number;
}

export default function PhotoUploadComponent({
  category,
  driverId,
  loadId,
  maxFiles = 5,
  onUploadComplete,
  onUploadProgress,
  title = "📸 Upload Photos",
  description = "Take or upload photos for documentation",
  acceptedTypes = ["image/*"]
}: PhotoUploadComponentProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles).slice(0, maxFiles - files.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const uploadFile = async (fileIndex: number) => {
    const file = files[fileIndex];
    if (!file || file.uploading || file.uploaded) return;

    setFiles(prev => prev.map((f, i) => 
      i === fileIndex ? { ...f, uploading: true, progress: 0 } : f
    ));

    try {
      // Simulate Cloudinary upload with real-world behavior
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('upload_preset', 'fleetflow_photos');
      formData.append('folder', `fleetflow/${category}/${driverId}`);
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      
      if (!cloudName) {
        // Demo mode - simulate upload
        await simulateUpload(fileIndex);
        return;
      }

      // Real Cloudinary upload
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setFiles(prev => prev.map((f, i) => 
            i === fileIndex ? { ...f, progress } : f
          ));
          onUploadProgress?.(progress);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setFiles(prev => prev.map((f, i) => 
            i === fileIndex ? { 
              ...f, 
              uploading: false, 
              uploaded: true, 
              url: response.secure_url,
              progress: 100
            } : f
          ));
          
          // Check if all files are uploaded
          const allUploaded = files.every((f, i) => 
            i === fileIndex || f.uploaded
          );
          if (allUploaded) {
            const urls = files.map(f => f.url).filter(Boolean) as string[];
            onUploadComplete?.(urls);
          }
        } else {
          setFiles(prev => prev.map((f, i) => 
            i === fileIndex ? { 
              ...f, 
              uploading: false, 
              error: 'Upload failed'
            } : f
          ));
        }
      };

      xhr.onerror = () => {
        setFiles(prev => prev.map((f, i) => 
          i === fileIndex ? { 
            ...f, 
            uploading: false, 
            error: 'Network error'
          } : f
        ));
      };

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
      xhr.send(formData);

    } catch (error) {
      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { 
          ...f, 
          uploading: false, 
          error: 'Upload failed'
        } : f
      ));
    }
  };

  const simulateUpload = async (fileIndex: number) => {
    // Simulate upload progress for demo
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setFiles(prev => prev.map((f, i) => 
        i === fileIndex ? { ...f, progress } : f
      ));
      onUploadProgress?.(progress);
    }

    // Generate demo URL
    const demoUrl = `https://demo.fleetflow.com/uploads/${category}/${Date.now()}.jpg`;
    
    setFiles(prev => prev.map((f, i) => 
      i === fileIndex ? { 
        ...f, 
        uploading: false, 
        uploaded: true, 
        url: demoUrl,
        progress: 100
      } : f
    ));

    // Check if all files are uploaded
    const allUploaded = files.every((f, i) => 
      i === fileIndex || f.uploaded
    );
    if (allUploaded) {
      const urls = files.map(f => f.url).filter(Boolean) as string[];
      onUploadComplete?.(urls);
    }
  };

  const uploadAllFiles = () => {
    files.forEach((_, index) => {
      if (!files[index].uploading && !files[index].uploaded) {
        uploadFile(index);
      }
    });
  };

  const removeFile = (index: number) => {
    const file = files[index];
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const getCategoryIcon = () => {
    const icons = {
      pickup: '📦',
      delivery: '🚚',
      confirmation: '✅',
      signature: '✍️',
      document: '📄',
      inspection: '🔍'
    };
    return icons[category] || '📸';
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <h4 style={{ 
        fontSize: '16px', 
        fontWeight: 'bold', 
        color: '#111827', 
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {getCategoryIcon()} {title}
      </h4>

      {/* Upload Area */}
      <div
        style={{
          border: `2px dashed ${isDragging ? '#3b82f6' : '#d1d5db'}`,
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '16px',
          background: isDragging ? '#f0f9ff' : '#fafafa',
          transition: 'all 0.2s ease'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple={maxFiles > 1}
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />
        
        <div style={{ marginBottom: '12px', fontSize: '48px' }}>
          {isDragging ? '📥' : '📷'}
        </div>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            marginBottom: '8px'
          }}
        >
          {maxFiles > 1 ? '📷 Select Photos' : '📷 Select Photo'}
        </button>
        
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {description}<br/>
          {isDragging ? 'Drop files here' : 'Or drag and drop files here'}
        </div>
      </div>

      {/* File Preview Grid */}
      {files.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
          gap: '12px',
          marginBottom: '16px'
        }}>
          {files.map((file, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#f3f4f6'
              }}>
                <img 
                  src={file.preview} 
                  alt={`Upload ${index + 1}`}
                  style={{ 
                    width: '100%', 
                    height: '120px', 
                    objectFit: 'cover'
                  }}
                />
                
                {/* Progress Overlay */}
                {file.uploading && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '8px',
                    fontSize: '12px',
                    textAlign: 'center'
                  }}>
                    Uploading... {file.progress}%
                    <div style={{
                      background: '#e5e7eb',
                      height: '2px',
                      marginTop: '4px',
                      borderRadius: '1px'
                    }}>
                      <div style={{
                        background: '#3b82f6',
                        height: '100%',
                        width: `${file.progress}%`,
                        borderRadius: '1px',
                        transition: 'width 0.2s ease'
                      }} />
                    </div>
                  </div>
                )}

                {/* Success Indicator */}
                {file.uploaded && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#10b981',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    ✓
                  </div>
                )}

                {/* Error Indicator */}
                {file.error && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    ✕
                  </div>
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFile(index)}
                style={{
                  position: 'absolute',
                  top: '-6px',
                  left: '-6px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}
              >
                ✕
              </button>

              {/* File Name */}
              <div style={{
                fontSize: '11px',
                color: '#6b7280',
                textAlign: 'center',
                marginTop: '4px',
                wordBreak: 'break-word'
              }}>
                {file.file.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && files.some(f => !f.uploaded && !f.uploading) && (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={uploadAllFiles}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none'
            }}
          >
            🚀 Upload All Photos
          </button>
        </div>
      )}

      {/* Upload Status */}
      {files.length > 0 && (
        <div style={{ 
          fontSize: '12px', 
          color: '#6b7280', 
          textAlign: 'center',
          marginTop: '8px'
        }}>
          {files.filter(f => f.uploaded).length} of {files.length} files uploaded
        </div>
      )}
    </div>
  );
}
