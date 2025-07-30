// 🖋️ HTML5 Canvas Signature Pad Component
// Native signature capture with touch and mouse support

'use client';

import React, { useRef, useState, useEffect } from 'react';

interface SignaturePadProps {
  onSignatureChange: (signature: string) => void;
  width?: number;
  height?: number;
  placeholder?: string;
  disabled?: boolean;
  initialSignature?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  onSignatureChange,
  width = 400,
  height = 150,
  placeholder = "Sign here",
  disabled = false,
  initialSignature
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (initialSignature && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setHasSignature(true);
        };
        img.src = initialSignature;
      }
    }
  }, [initialSignature]);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Configure drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return ctx;
  };

  useEffect(() => {
    setupCanvas();
  }, [width, height]);

  const getEventPosition = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in event) {
      // Touch event
      const touch = event.touches[0] || event.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      // Mouse event
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const pos = getEventPosition(event);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled) return;
    
    event.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const pos = getEventPosition(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveSignature();
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas to base64 PNG
    const dataURL = canvas.toDataURL('image/png');
    onSignatureChange(dataURL);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setHasSignature(false);
    onSignatureChange('');
  };

  const isEmpty = () => {
    const canvas = canvasRef.current;
    if (!canvas) return true;

    const ctx = canvas.getContext('2d');
    if (!ctx) return true;

    const pixelBuffer = new Uint32Array(
      ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );

    return !pixelBuffer.some(color => color !== 0xffffffff);
  };

  return (
    <div style={{ 
      border: '2px solid #d1d5db', 
      borderRadius: '8px', 
      padding: '8px',
      background: '#ffffff',
      display: 'inline-block'
    }}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          cursor: disabled ? 'not-allowed' : 'crosshair',
          touchAction: 'none',
          opacity: disabled ? 0.6 : 1
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      
      {/* Placeholder text when empty */}
      {!hasSignature && !disabled && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#9ca3af',
          fontSize: '14px',
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          {placeholder}
        </div>
      )}
      
      {/* Control buttons */}
      <div style={{ 
        marginTop: '8px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          type="button"
          onClick={clearSignature}
          disabled={disabled || !hasSignature}
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#dc2626',
            border: '1px solid #fca5a5',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: disabled || !hasSignature ? 'not-allowed' : 'pointer',
            opacity: disabled || !hasSignature ? 0.5 : 1
          }}
        >
          🗑️ Clear
        </button>
        
        <div style={{ fontSize: '12px', color: hasSignature ? '#059669' : '#6b7280' }}>
          {hasSignature ? '✅ Signature captured' : '✍️ Draw your signature'}
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;
