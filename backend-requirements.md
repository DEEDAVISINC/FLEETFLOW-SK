# FleetFlow Backend Services Requirements

## 🎯 Overview
This document outlines the complete backend services architecture needed to support the FleetFlow driver portal and dispatch system.

## 🔧 Core Backend Services

### 1. Authentication & User Management
```typescript
// Driver Authentication
POST /api/auth/driver/login
{
  "phone": "+1234567890",
  "password": "password123",
  "deviceId": "device_uuid"
}

Response:
{
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "driver": {
    "id": "DRV-001",
    "name": "John Smith",
    "phone": "+1234567890",
    "licenseNumber": "CDL-TX-123456",
    "assignedTruck": "TRK-001",
    "dispatcher": {
      "id": "DSP-001",
      "name": "Sarah Johnson",
      "phone": "+1987654321",
      "email": "sarah@fleetflowapp.com"
    }
  }
}
```

### 2. Load Management Service
```typescript
// Get Driver's Assigned Loads
GET /api/drivers/{driverId}/loads/assigned
Authorization: Bearer {token}

Response:
{
  "loads": [
    {
      "id": "LD-2025-001",
      "origin": "Dallas, TX",
      "destination": "Atlanta, GA",
      "rate": 2500,
      "pickupDate": "2025-07-03T08:00:00Z",
      "deliveryDate": "2025-07-05T17:00:00Z",
      "status": "Assigned",
      "equipment": "Dry Van",
      "weight": "45,000 lbs",
      "distance": "925 miles",
      "specialInstructions": "Handle with care"
    }
  ]
}

// Confirm Load Assignment
POST /api/loads/{loadId}/confirm
{
  "driverSignature": "base64_signature_data",
  "photos": ["base64_photo1", "base64_photo2"],
  "notes": "Load confirmed, ready for pickup",
  "confirmationTime": "2025-07-02T14:30:00Z"
}
```

### 3. File Upload & Storage Service
```typescript
// Upload Photos/Signatures
POST /api/files/upload
Content-Type: multipart/form-data

{
  "loadId": "LD-2025-001",
  "type": "confirmation_photo|pickup_photo|delivery_photo|driver_signature|receiver_signature",
  "file": File,
  "metadata": {
    "timestamp": "2025-07-02T14:30:00Z",
    "location": "Dallas, TX",
    "driverId": "DRV-001"
  }
}

Response:
{
  "fileId": "FILE-123",
  "url": "https://storage.fleetflowapp.com/files/FILE-123",
  "type": "confirmation_photo",
  "timestamp": "2025-07-02T14:30:00Z"
}
```

### 4. SMS & Notification Service
```typescript
// Send SMS Notification
POST /api/notifications/sms/send
{
  "to": "+1234567890",
  "message": "New load assigned: LD-2025-001 - Dallas, TX to Atlanta, GA",
  "type": "load_assignment",
  "metadata": {
    "loadId": "LD-2025-001",
    "driverId": "DRV-001"
  }
}

// Get Driver Notifications
GET /api/drivers/{driverId}/notifications
Response:
{
  "notifications": [
    {
      "id": "NOTIF-001",
      "message": "New load assigned: LD-2025-001",
      "type": "load_assignment",
      "timestamp": "2025-07-02T10:30:00Z",
      "read": false,
      "metadata": {
        "loadId": "LD-2025-001"
      }
    }
  ]
}
```

### 5. Delivery Tracking Service
```typescript
// Complete Delivery
POST /api/deliveries/{loadId}/complete
{
  "pickupPhotos": ["file_id_1", "file_id_2"],
  "deliveryPhotos": ["file_id_3", "file_id_4"],
  "receiverSignature": "base64_signature",
  "receiverName": "John Receiver",
  "deliveryTime": "2025-07-05T16:45:00Z",
  "notes": "Delivered successfully, no issues",
  "location": {
    "lat": 33.7490,
    "lng": -84.3880,
    "address": "Atlanta, GA"
  }
}

Response:
{
  "deliveryId": "DEL-001",
  "status": "completed",
  "confirmationNumber": "CONF-12345",
  "deliveryTime": "2025-07-05T16:45:00Z"
}
```

### 6. Document Management Service
```typescript
// Generate/Download Documents
GET /api/documents/{type}/{loadId}
// Types: rate-confirmation, bill-of-lading, load-confirmation

Response:
{
  "documentId": "DOC-001",
  "url": "https://docs.fleetflowapp.com/rate-confirmation/LD-2025-001.pdf",
  "type": "rate-confirmation",
  "generatedAt": "2025-07-02T14:30:00Z"
}
```

## 🗄️ Database Schema

### Core Tables
```sql
-- Users & Authentication
CREATE TABLE drivers (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE,
  phone VARCHAR UNIQUE NOT NULL,
  license_number VARCHAR NOT NULL,
  assigned_truck_id VARCHAR,
  dispatcher_id VARCHAR,
  current_location VARCHAR,
  eld_status VARCHAR DEFAULT 'Disconnected',
  hours_remaining DECIMAL(4,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Load Management
CREATE TABLE loads (
  id VARCHAR PRIMARY KEY,
  broker_id VARCHAR NOT NULL,
  dispatcher_id VARCHAR,
  assigned_driver_id VARCHAR,
  origin VARCHAR NOT NULL,
  destination VARCHAR NOT NULL,
  rate DECIMAL(10,2) NOT NULL,
  pickup_date TIMESTAMP NOT NULL,
  delivery_date TIMESTAMP NOT NULL,
  status VARCHAR DEFAULT 'Draft',
  equipment VARCHAR NOT NULL,
  weight VARCHAR,
  distance VARCHAR,
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Load Confirmations
CREATE TABLE load_confirmations (
  id VARCHAR PRIMARY KEY,
  load_id VARCHAR NOT NULL REFERENCES loads(id),
  driver_id VARCHAR NOT NULL REFERENCES drivers(id),
  confirmed_at TIMESTAMP NOT NULL,
  driver_signature TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- File Storage
CREATE TABLE files (
  id VARCHAR PRIMARY KEY,
  load_id VARCHAR REFERENCES loads(id),
  driver_id VARCHAR REFERENCES drivers(id),
  file_type VARCHAR NOT NULL, -- 'confirmation_photo', 'pickup_photo', etc.
  file_url VARCHAR NOT NULL,
  file_size INTEGER,
  metadata JSONB,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Deliveries
CREATE TABLE deliveries (
  id VARCHAR PRIMARY KEY,
  load_id VARCHAR NOT NULL REFERENCES loads(id),
  driver_id VARCHAR NOT NULL REFERENCES drivers(id),
  receiver_name VARCHAR,
  receiver_signature TEXT,
  delivery_time TIMESTAMP,
  delivery_location JSONB, -- {lat, lng, address}
  notes TEXT,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id VARCHAR PRIMARY KEY,
  driver_id VARCHAR NOT NULL REFERENCES drivers(id),
  message TEXT NOT NULL,
  type VARCHAR NOT NULL, -- 'load_assignment', 'dispatch_update', etc.
  read_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🛠️ Technology Stack Recommendations

### Backend Framework
- **Node.js + Express/Fastify** (JavaScript/TypeScript)
- **Python + FastAPI** (Python)
- **Java + Spring Boot** (Java)
- **C# + ASP.NET Core** (C#)

### Database
- **Primary**: PostgreSQL (ACID compliance, JSON support)
- **Caching**: Redis (sessions, real-time data)
- **File Storage**: AWS S3 / Google Cloud Storage

### Real-time Communication
- **WebSocket**: Socket.io or native WebSocket
- **Message Queue**: Redis Pub/Sub or RabbitMQ

### External Services
- **SMS**: Twilio, AWS SNS, or MessageBird
- **File Storage**: AWS S3, Google Cloud Storage, or Azure Blob
- **Document Generation**: PDFKit, jsPDF, or ReportLab
- **Maps/Location**: Google Maps API or Mapbox

## 🚀 Implementation Phases

### Phase 1: Core MVP (2-3 weeks)
1. ✅ Basic authentication (JWT)
2. ✅ Load CRUD operations
3. ✅ Simple file upload
4. ✅ Basic notifications

### Phase 2: Driver Portal (2-3 weeks)
1. ✅ Load confirmation workflow
2. ✅ Photo upload & signature capture
3. ✅ Delivery completion
4. ✅ SMS notifications

### Phase 3: Advanced Features (3-4 weeks)
1. ✅ Real-time WebSocket updates
2. ✅ Document generation
3. ✅ Analytics & reporting
4. ✅ Audit trails

### Phase 4: Production Ready (2-3 weeks)
1. ✅ Performance optimization
2. ✅ Security hardening
3. ✅ Monitoring & logging
4. ✅ Deployment automation

## 📋 Sample Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/fleetflow
REDIS_URL=redis://localhost:6379

# File Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=fleetflow-files
AWS_REGION=us-east-1

# SMS Service
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Application
PORT=8000
NODE_ENV=development
```

## 🔍 Next Steps

1. **Choose your tech stack** based on team expertise
2. **Set up development environment** with database and services
3. **Implement authentication service** first
4. **Build load management APIs** 
5. **Add file upload functionality**
6. **Integrate SMS notifications**
7. **Test with the frontend driver portal**

Would you like me to create a starter backend template in your preferred technology stack?
