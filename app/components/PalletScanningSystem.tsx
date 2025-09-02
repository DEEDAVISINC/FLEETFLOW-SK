'use client';

import { useEffect, useRef, useState } from 'react';

interface PalletScan {
  id: string;
  palletId: string;
  loadId: string;
  location: string;
  timestamp: Date;
  scanType:
    | 'crossdock_inbound'
    | 'crossdock_outbound'
    | 'delivery_inbound'
    | 'delivery_outbound';
  driverId: string;
  status: 'scanned' | 'verified' | 'error';
  notes?: string;
}

interface PalletScanningProps {
  loadId: string;
  driverId: string;
  currentLocation: 'crossdock' | 'delivery';
  workflowMode?: 'loading' | 'unloading' | 'auto';
  onScanComplete?: (scan: PalletScan) => void;
  onWorkflowComplete?: (summary: WorkflowSummary) => void;
}

interface WorkflowSummary {
  loadId: string;
  location: string;
  totalExpected: number;
  totalScanned: number;
  completionPercentage: number;
  startTime: Date;
  endTime: Date;
  status: 'completed' | 'incomplete' | 'error';
}

export default function PalletScanningSystem({
  loadId,
  driverId,
  currentLocation,
  workflowMode = 'auto',
  onScanComplete,
  onWorkflowComplete,
}: PalletScanningProps) {
  const [scannedPallets, setScannedPallets] = useState<PalletScan[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [manualPalletId, setManualPalletId] = useState('');
  const [scanHistory, setScanHistory] = useState<PalletScan[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loadData, setLoadData] = useState<any>(null);
  const [workflowStartTime, setWorkflowStartTime] = useState<Date | null>(null);
  const [isWorkflowComplete, setIsWorkflowComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Load existing scan history for this load
    loadScanHistory();
    loadLoadData();
    initializeWorkflow();
  }, [loadId, currentLocation]);

  const loadScanHistory = async () => {
    try {
      const response = await fetch(`/api/pallet-scans?loadId=${loadId}`);
      const data = await response.json();
      if (data.success) {
        setScanHistory(data.scans || []);
      }
    } catch (error) {
      console.error('Error loading scan history:', error);
    }
  };

  const loadLoadData = async () => {
    try {
      const response = await fetch(`/api/load-pallets?loadId=${loadId}`);
      const data = await response.json();
      if (data.success && data.assignments.length > 0) {
        setLoadData(data.assignments[0]);
      }
    } catch (error) {
      console.error('Error loading load data:', error);
    }
  };

  const initializeWorkflow = () => {
    if (!workflowStartTime) {
      setWorkflowStartTime(new Date());
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera on mobile
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsScanning(true);
      setError('');
    } catch (err) {
      setError(
        'Unable to access camera. Please check permissions or use manual entry.'
      );
      setScanMode('manual');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const captureAndScan = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to image data for QR code processing
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // For now, simulate QR code detection
    // In production, integrate with a QR code library like jsQR
    simulateQRCodeDetection();
  };

  const simulateQRCodeDetection = () => {
    // Simulate QR code detection with a mock pallet ID
    const mockPalletId = `PLT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    processScan(mockPalletId);
  };

  const processScan = async (palletId: string) => {
    const scanType = getScanType();
    const scan: PalletScan = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      palletId,
      loadId,
      location: currentLocation,
      timestamp: new Date(),
      scanType,
      driverId,
      status: 'scanned',
    };

    try {
      // Save scan to backend
      const response = await fetch('/api/pallet-scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scan),
      });

      const result = await response.json();

      if (result.success) {
        setScannedPallets((prev) => [...prev, scan]);
        setScanHistory((prev) => [scan, ...prev]);
        setSuccess(`Successfully scanned pallet ${palletId}`);
        setTimeout(() => setSuccess(''), 3000);

        if (onScanComplete) {
          onScanComplete(scan);
        }
      } else {
        throw new Error(result.error || 'Failed to save scan');
      }
    } catch (error) {
      console.error('Error processing scan:', error);
      setError('Failed to save scan. Please try again.');
    }
  };

  const getScanType = (): PalletScan['scanType'] => {
    if (currentLocation === 'crossdock') {
      return 'crossdock_inbound';
    } else {
      return 'delivery_outbound';
    }
  };

  const handleManualScan = () => {
    if (!manualPalletId.trim()) {
      setError('Please enter a pallet ID');
      return;
    }

    processScan(manualPalletId.trim());
    setManualPalletId('');
  };

  const contactDispatch = () => {
    // Implement dispatch contact functionality
    const phoneNumber = '1-800-DISPATCH'; // Replace with actual dispatch number
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const getScanInstructions = () => {
    if (currentLocation === 'crossdock') {
      if (workflowMode === 'loading') {
        return {
          title: 'Crossdock Loading - Scan Pallets Into Trailer',
          instructions: [
            '📦 Scan each pallet BEFORE loading into your trailer',
            '🎯 Position QR code clearly in camera view',
            '✅ Verify green confirmation for each scan',
            '🚛 Only load pallets that have been successfully scanned',
            '📋 Keep track of pallet count vs expected load',
            '🔄 Continue scanning until all pallets are loaded',
          ],
          icon: '📦',
          workflowType: 'Loading Sequence',
        };
      } else {
        return {
          title: 'Crossdock Scanning',
          instructions: [
            'Scan all pallets before loading into your trailer',
            'Ensure each pallet QR code is clearly visible',
            'Scan one pallet at a time for accuracy',
            'Verify scan confirmation before proceeding',
          ],
          icon: '📦',
          workflowType: 'General Scanning',
        };
      }
    } else {
      if (workflowMode === 'unloading') {
        return {
          title: 'Delivery Unloading - Scan Pallets Off Trailer',
          instructions: [
            '🚚 Scan each pallet as it is UNLOADED from your trailer',
            '📍 Verify you are at the correct delivery location',
            '🔍 Check for any damaged or missing pallets',
            '📱 Report issues immediately to dispatch if found',
            '✅ Complete all scans before leaving delivery site',
            '📊 Confirm final count matches expected delivery',
          ],
          icon: '🚚',
          workflowType: 'Unloading Sequence',
        };
      } else {
        return {
          title: 'Delivery Scanning',
          instructions: [
            'Scan pallets as they are unloaded from your trailer',
            'Confirm delivery location matches load destination',
            'Report any damaged or missing pallets',
            'Complete all scans before marking delivery complete',
          ],
          icon: '🚚',
          workflowType: 'General Scanning',
        };
      }
    }
  };

  const completeWorkflow = () => {
    if (!workflowStartTime || !loadData) return;

    const summary: WorkflowSummary = {
      loadId,
      location: currentLocation,
      totalExpected: loadData.expectedCount || 0,
      totalScanned: scannedPallets.length,
      completionPercentage:
        loadData.expectedCount > 0
          ? Math.round((scannedPallets.length / loadData.expectedCount) * 100)
          : 0,
      startTime: workflowStartTime,
      endTime: new Date(),
      status:
        scannedPallets.length >= (loadData.expectedCount || 0)
          ? 'completed'
          : 'incomplete',
    };

    setIsWorkflowComplete(true);

    if (onWorkflowComplete) {
      onWorkflowComplete(summary);
    }
  };

  const instructions = getScanInstructions();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='rounded-lg bg-white/10 p-6 backdrop-blur-lg'>
        <div className='mb-4 flex items-center gap-3'>
          <div className='text-3xl'>{instructions.icon}</div>
          <div>
            <h2 className='text-2xl font-bold text-white'>
              {instructions.title}
            </h2>
            <p className='text-gray-300'>Load ID: {loadId}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className='space-y-2'>
          {instructions.instructions.map((instruction, index) => (
            <div
              key={index}
              className='flex items-start gap-2 text-sm text-gray-300'
            >
              <span className='text-green-400'>✓</span>
              {instruction}
            </div>
          ))}
        </div>

        {/* Workflow Progress */}
        {loadData && (
          <div className='mt-4 rounded-lg bg-white/10 p-4'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-medium text-white'>
                Workflow Progress
              </span>
              <span className='text-sm text-gray-300'>
                {instructions.workflowType}
              </span>
            </div>
            <div className='mb-2 flex items-center gap-2'>
              <div className='h-2 flex-1 rounded-full bg-white/20'>
                <div
                  className='h-2 rounded-full bg-green-500 transition-all duration-300'
                  style={{
                    width: `${loadData.expectedCount > 0 ? (scannedPallets.length / loadData.expectedCount) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <span className='text-sm font-medium text-white'>
                {scannedPallets.length}/{loadData.expectedCount || 0}
              </span>
            </div>
            <div className='text-xs text-gray-400'>
              {scannedPallets.length >= (loadData.expectedCount || 0)
                ? '✅ All expected pallets scanned'
                : `${(loadData.expectedCount || 0) - scannedPallets.length} pallets remaining`}
            </div>
          </div>
        )}

        {/* Workflow Complete Button */}
        {!isWorkflowComplete &&
          loadData &&
          scannedPallets.length >= (loadData.expectedCount || 0) && (
            <div className='mt-4'>
              <button
                onClick={completeWorkflow}
                className='flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700'
              >
                <span>🎉</span>
                Complete{' '}
                {currentLocation === 'crossdock' ? 'Loading' : 'Delivery'}{' '}
                Workflow
              </button>
            </div>
          )}

        {/* Workflow Completed Message */}
        {isWorkflowComplete && (
          <div className='mt-4 rounded-lg border border-green-500/30 bg-green-500/20 p-4'>
            <div className='flex items-center gap-3'>
              <span className='text-2xl text-green-400'>✅</span>
              <div>
                <h4 className='font-medium text-green-200'>
                  Workflow Completed!
                </h4>
                <p className='text-sm text-green-300'>
                  {currentLocation === 'crossdock'
                    ? 'All pallets have been scanned and loaded into your trailer.'
                    : 'All pallets have been scanned and unloaded at the delivery location.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className='rounded-lg border border-red-500/30 bg-red-500/20 p-4'>
          <div className='flex items-center gap-2'>
            <span className='text-red-400'>⚠️</span>
            <p className='text-red-200'>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className='rounded-lg border border-green-500/30 bg-green-500/20 p-4'>
          <div className='flex items-center gap-2'>
            <span className='text-green-400'>✅</span>
            <p className='text-green-200'>{success}</p>
          </div>
        </div>
      )}

      {/* Scan Mode Selection */}
      <div className='flex gap-2'>
        <button
          onClick={() => setScanMode('camera')}
          className={`flex-1 rounded-lg px-4 py-3 font-medium transition-all ${
            scanMode === 'camera'
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          📷 Camera Scan
        </button>
        <button
          onClick={() => setScanMode('manual')}
          className={`flex-1 rounded-lg px-4 py-3 font-medium transition-all ${
            scanMode === 'manual'
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          ✏️ Manual Entry
        </button>
      </div>

      {/* Camera Scanning Interface */}
      {scanMode === 'camera' && (
        <div className='space-y-4'>
          <div className='relative aspect-video overflow-hidden rounded-lg bg-black'>
            <video
              ref={videoRef}
              className='h-full w-full object-cover'
              playsInline
              muted
            />
            <canvas ref={canvasRef} className='hidden' />

            {!isScanning && (
              <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                <button
                  onClick={startCamera}
                  className='rounded-full bg-blue-500 p-4 text-white shadow-lg transition-colors hover:bg-blue-600'
                >
                  📷 Start Scanning
                </button>
              </div>
            )}

            {isScanning && (
              <div className='absolute right-4 bottom-4 left-4 flex gap-2'>
                <button
                  onClick={captureAndScan}
                  className='flex-1 rounded-lg bg-green-500 py-3 font-medium text-white transition-colors hover:bg-green-600'
                >
                  📸 Capture & Scan
                </button>
                <button
                  onClick={stopCamera}
                  className='rounded-lg bg-red-500 px-4 py-3 font-medium text-white transition-colors hover:bg-red-600'
                >
                  ⏹️ Stop
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Entry Interface */}
      {scanMode === 'manual' && (
        <div className='space-y-4'>
          <div className='rounded-lg bg-white/10 p-4 backdrop-blur-lg'>
            <label className='mb-2 block text-sm font-medium text-gray-300'>
              Enter Pallet ID
            </label>
            <input
              type='text'
              value={manualPalletId}
              onChange={(e) => setManualPalletId(e.target.value)}
              placeholder='PLT-123456789'
              className='w-full rounded-lg border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleManualScan();
                }
              }}
            />
            <button
              onClick={handleManualScan}
              className='mt-3 w-full rounded-lg bg-blue-500 py-3 font-medium text-white transition-colors hover:bg-blue-600'
            >
              ✅ Confirm Scan
            </button>
          </div>
        </div>
      )}

      {/* Recently Scanned Pallets */}
      {scannedPallets.length > 0 && (
        <div className='rounded-lg bg-white/10 p-6 backdrop-blur-lg'>
          <h3 className='mb-4 text-lg font-bold text-white'>
            Recently Scanned Pallets ({scannedPallets.length})
          </h3>
          <div className='max-h-48 space-y-2 overflow-y-auto'>
            {scannedPallets.map((scan) => (
              <div
                key={scan.id}
                className='flex items-center justify-between rounded-lg bg-white/5 p-3'
              >
                <div>
                  <div className='font-medium text-white'>{scan.palletId}</div>
                  <div className='text-xs text-gray-400'>
                    {new Date(scan.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className='text-green-400'>
                  ✅ {scan.scanType.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scan History */}
      <div className='rounded-lg bg-white/10 p-6 backdrop-blur-lg'>
        <h3 className='mb-4 text-lg font-bold text-white'>
          Scan History ({scanHistory.length})
        </h3>
        <div className='max-h-64 space-y-2 overflow-y-auto'>
          {scanHistory.length > 0 ? (
            scanHistory.map((scan) => (
              <div
                key={scan.id}
                className='flex items-center justify-between rounded-lg bg-white/5 p-3'
              >
                <div>
                  <div className='font-medium text-white'>{scan.palletId}</div>
                  <div className='text-xs text-gray-400'>
                    {scan.location} •{' '}
                    {new Date(scan.timestamp).toLocaleString()}
                  </div>
                </div>
                <div
                  className={`rounded px-2 py-1 text-xs ${
                    scan.status === 'verified'
                      ? 'bg-green-500/20 text-green-400'
                      : scan.status === 'error'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {scan.status.toUpperCase()}
                </div>
              </div>
            ))
          ) : (
            <div className='py-8 text-center text-gray-400'>
              No scans recorded for this load yet
            </div>
          )}
        </div>
      </div>

      {/* Contact Dispatch */}
      <div className='rounded-lg border border-orange-500/30 bg-orange-500/10 p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h4 className='font-medium text-orange-200'>Need Help?</h4>
            <p className='text-sm text-orange-300'>
              Contact dispatch for technical issues
            </p>
          </div>
          <button
            onClick={contactDispatch}
            className='rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-600'
          >
            📞 Call Dispatch
          </button>
        </div>
      </div>
    </div>
  );
}
