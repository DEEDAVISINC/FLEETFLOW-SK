const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/fleetflow'
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Mock data for development
const mockDrivers = [
  {
    id: 'DRV-001',
    name: 'John Smith',
    email: 'john.smith@fleetflow.com',
    phone: '+1234567890',
    licenseNumber: 'CDL-TX-123456',
    assignedTruck: 'TRK-001',
    dispatcherId: 'DSP-001',
    dispatcherName: 'Sarah Johnson',
    dispatcherPhone: '+1987654321',
    dispatcherEmail: 'sarah@fleetflow.com',
    currentLocation: 'Dallas, TX',
    eldStatus: 'Connected',
    hoursRemaining: 8.5
  }
];

const mockLoads = [
  {
    id: 'LD-2025-001',
    brokerId: 'BRK-001',
    brokerName: 'ABC Logistics',
    dispatcherId: 'DSP-001',
    dispatcherName: 'Sarah Johnson',
    origin: 'Dallas, TX',
    destination: 'Atlanta, GA',
    rate: 2500,
    distance: '925 miles',
    weight: '45,000 lbs',
    equipment: 'Dry Van',
    status: 'Assigned',
    pickupDate: '2025-07-03T08:00:00Z',
    deliveryDate: '2025-07-05T17:00:00Z',
    specialInstructions: 'Handle with care',
    createdAt: '2025-07-01T10:00:00Z',
    updatedAt: '2025-07-02T14:30:00Z'
  },
  {
    id: 'LD-2025-002',
    brokerId: 'BRK-002',
    brokerName: 'XYZ Freight',
    origin: 'Houston, TX',
    destination: 'Miami, FL',
    rate: 3200,
    distance: '1200 miles',
    weight: '40,000 lbs',
    equipment: 'Refrigerated',
    status: 'Available',
    pickupDate: '2025-07-04T06:00:00Z',
    deliveryDate: '2025-07-06T18:00:00Z',
    createdAt: '2025-07-01T12:00:00Z',
    updatedAt: '2025-07-01T12:00:00Z'
  }
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication Routes
app.post('/api/auth/driver/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Find driver by phone (in production, check password hash)
    const driver = mockDrivers.find(d => d.phone === phone);
    
    if (!driver) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { driverId: driver.id, phone: driver.phone },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        email: driver.email,
        licenseNumber: driver.licenseNumber,
        assignedTruck: driver.assignedTruck,
        dispatcher: {
          id: driver.dispatcherId,
          name: driver.dispatcherName,
          phone: driver.dispatcherPhone,
          email: driver.dispatcherEmail
        },
        currentLocation: driver.currentLocation,
        eldStatus: driver.eldStatus,
        hoursRemaining: driver.hoursRemaining
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Driver Routes
app.get('/api/drivers/:driverId/profile', authenticateToken, (req, res) => {
  const { driverId } = req.params;
  const driver = mockDrivers.find(d => d.id === driverId);
  
  if (!driver) {
    return res.status(404).json({ error: 'Driver not found' });
  }

  res.json({ driver });
});

// Load Routes
app.get('/api/drivers/:driverId/loads/assigned', authenticateToken, (req, res) => {
  const { driverId } = req.params;
  const driver = mockDrivers.find(d => d.id === driverId);
  
  if (!driver) {
    return res.status(404).json({ error: 'Driver not found' });
  }

  const assignedLoads = mockLoads.filter(load => 
    load.status === 'Assigned' && load.dispatcherId === driver.dispatcherId
  );

  res.json({ loads: assignedLoads });
});

app.get('/api/loads/available', authenticateToken, (req, res) => {
  const availableLoads = mockLoads.filter(load => load.status === 'Available');
  res.json({ loads: availableLoads });
});

app.post('/api/loads/:loadId/confirm', authenticateToken, upload.array('photos'), async (req, res) => {
  try {
    const { loadId } = req.params;
    const { driverSignature, notes } = req.body;
    const photos = req.files || [];

    const load = mockLoads.find(l => l.id === loadId);
    if (!load) {
      return res.status(404).json({ error: 'Load not found' });
    }

    // In production, save photos to cloud storage and get URLs
    const photoUrls = photos.map((photo, index) => 
      `https://storage.fleetflow.com/confirmations/${loadId}_${index}.jpg`
    );

    const confirmation = {
      id: `CONF-${Date.now()}`,
      loadId,
      driverId: req.user.driverId,
      confirmed: true,
      confirmationTime: new Date().toISOString(),
      driverSignature,
      photos: photoUrls,
      notes
    };

    // Update load status
    load.status = 'In Transit';
    load.updatedAt = new Date().toISOString();

    res.json({
      confirmation,
      load,
      message: 'Load confirmed successfully'
    });
  } catch (error) {
    console.error('Confirmation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/deliveries/:loadId/complete', authenticateToken, upload.array('photos'), async (req, res) => {
  try {
    const { loadId } = req.params;
    const { 
      receiverName, 
      receiverSignature, 
      notes, 
      deliveryLocation 
    } = req.body;
    const photos = req.files || [];

    const load = mockLoads.find(l => l.id === loadId);
    if (!load) {
      return res.status(404).json({ error: 'Load not found' });
    }

    // In production, save photos to cloud storage
    const photoUrls = photos.map((photo, index) => 
      `https://storage.fleetflow.com/deliveries/${loadId}_${index}.jpg`
    );

    const delivery = {
      id: `DEL-${Date.now()}`,
      loadId,
      driverId: req.user.driverId,
      receiverName,
      receiverSignature,
      deliveryTime: new Date().toISOString(),
      deliveryLocation: deliveryLocation ? JSON.parse(deliveryLocation) : null,
      photos: photoUrls,
      notes,
      status: 'completed',
      confirmationNumber: `CONF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };

    // Update load status
    load.status = 'Delivered';
    load.updatedAt = new Date().toISOString();

    res.json({
      delivery,
      load,
      message: 'Delivery completed successfully'
    });
  } catch (error) {
    console.error('Delivery completion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File Upload Routes
app.post('/api/files/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    const { loadId, type, metadata } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // In production, upload to cloud storage (S3, etc.)
    const fileId = `FILE-${Date.now()}`;
    const fileUrl = `https://storage.fleetflow.com/files/${fileId}`;

    res.json({
      fileId,
      url: fileUrl,
      type,
      originalName: file.originalname,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      metadata: metadata ? JSON.parse(metadata) : null
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Notification Routes
app.get('/api/drivers/:driverId/notifications', authenticateToken, (req, res) => {
  const mockNotifications = [
    {
      id: 'NOTIF-001',
      message: 'New load assigned: LD-2025-001 - Dallas, TX to Atlanta, GA',
      type: 'load_assignment',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: false,
      metadata: { loadId: 'LD-2025-001' }
    },
    {
      id: 'NOTIF-002',
      message: 'Dispatch Update: Please confirm pickup by 2:00 PM today',
      type: 'dispatch_update',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      read: false
    },
    {
      id: 'NOTIF-003',
      message: 'System Alert: ELD sync successful',
      type: 'system_alert',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      read: true
    }
  ];

  res.json({ notifications: mockNotifications });
});

app.put('/api/notifications/:notificationId/read', authenticateToken, (req, res) => {
  const { notificationId } = req.params;
  
  res.json({
    notificationId,
    read: true,
    readAt: new Date().toISOString()
  });
});

// SMS Routes (mock implementation)
app.post('/api/notifications/sms/send', authenticateToken, (req, res) => {
  const { to, message, type, metadata } = req.body;

  // In production, integrate with Twilio, AWS SNS, etc.
  console.log(`SMS to ${to}: ${message}`);

  res.json({
    messageId: `SMS-${Date.now()}`,
    to,
    message,
    type,
    status: 'sent',
    sentAt: new Date().toISOString()
  });
});

// Document Routes
app.get('/api/documents/:type/:loadId', authenticateToken, (req, res) => {
  const { type, loadId } = req.params;
  
  // In production, generate actual PDF documents
  const documentUrl = `https://docs.fleetflow.com/${type}/${loadId}.pdf`;
  
  res.json({
    documentId: `DOC-${Date.now()}`,
    type,
    loadId,
    url: documentUrl,
    generatedAt: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚛 FleetFlow Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📱 Driver login: POST http://localhost:${PORT}/api/auth/driver/login`);
});

module.exports = app;
