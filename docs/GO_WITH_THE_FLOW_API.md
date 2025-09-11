# 🚛⚡ Go With the Flow API Documentation

## Overview

The Go With the Flow API provides Uber-like freight matching functionality with real-time load
assignment, driver management, and instant pricing.

## Base URL

```
http://localhost:3000/api/go-with-the-flow
```

## Authentication

Currently uses demo authentication. In production, all endpoints would require proper authentication
tokens.

---

## 🚛 Driver Endpoints

### Get Driver Dashboard

```http
GET /api/go-with-the-flow/driver?action=dashboard&driverId=driver-1
```

**Response:**

```json
{
  "success": true,
  "dashboard": {
    "instantLoads": [...],
    "earnings": { "totalEarnings": 15000, "tripHistory": [...] },
    "recentActivity": [...],
    "loadCount": 2,
    "status": "online"
  }
}
```

### Get Instant Loads for Driver

```http
GET /api/go-with-the-flow/driver?action=instant-loads&driverId=driver-1
```

### Toggle Driver Availability

```http
POST /api/go-with-the-flow/driver
Content-Type: application/json

{
  "action": "toggle-availability",
  "driverId": "driver-1",
  "status": "online"
}
```

### Accept Load

```http
POST /api/go-with-the-flow/driver
Content-Type: application/json

{
  "action": "accept-load",
  "driverId": "driver-1",
  "loadId": "GWF-LOAD-001"
}
```

### Decline Load

```http
POST /api/go-with-the-flow/driver
Content-Type: application/json

{
  "action": "decline-load",
  "driverId": "driver-1",
  "loadId": "GWF-LOAD-001"
}
```

### Update Driver Location

```http
POST /api/go-with-the-flow/driver
Content-Type: application/json

{
  "action": "update-location",
  "driverId": "driver-1",
  "location": {
    "lat": 32.7767,
    "lng": -96.7970
  }
}
```

---

## 📦 Shipper Endpoints

### Request a Truck (Uber-style)

```http
POST /api/go-with-the-flow/shipper
Content-Type: application/json

{
  "action": "request-truck",
  "loadRequest": {
    "origin": "Dallas, TX",
    "destination": "Houston, TX",
    "equipmentType": "Dry Van",
    "weight": 20000,
    "urgency": "medium",
    "pickupDate": "2024-08-08T10:00:00Z",
    "deliveryDate": "2024-08-08T18:00:00Z",
    "shipperId": "shipper-123"
  }
}
```

**Response:**

```json
{
  "success": true,
  "load": {
    "id": "GWF-1691234567890-abc12",
    "rate": 850,
    "status": "pending"
  },
  "message": "Truck request submitted successfully. We're matching you with available drivers.",
  "estimatedMatchTime": "2-5 minutes",
  "dynamicPrice": 850
}
```

### Get Pricing Estimate

```http
GET /api/go-with-the-flow/shipper?action=pricing-estimate&origin=Dallas,TX&destination=Houston,TX&urgency=medium
```

### Check Available Trucks

```http
GET /api/go-with-the-flow/shipper?action=available-trucks
```

---

## 🎛️ Admin/Dispatcher Endpoints

### System Overview Dashboard

```http
GET /api/go-with-the-flow/admin?action=system-overview
```

**Response:**

```json
{
  "success": true,
  "overview": {
    "metrics": {
      "totalDrivers": 3,
      "onlineDrivers": 2,
      "activeLoads": 3,
      "instantMatchesToday": 25,
      "avgResponseTime": "45 sec",
      "matchingSuccessRate": "92%"
    },
    "availableDrivers": 2,
    "liveLoads": 3,
    "matchingQueue": 1,
    "recentActivity": [...]
  }
}
```

### Driver Management

```http
GET /api/go-with-the-flow/admin?action=driver-management
```

### Load Management

```http
GET /api/go-with-the-flow/admin?action=load-management
```

### Force Driver Online/Offline

```http
POST /api/go-with-the-flow/admin
Content-Type: application/json

{
  "action": "force-driver-online",
  "driverId": "driver-1"
}
```

### Emergency Broadcast

```http
POST /api/go-with-the-flow/admin
Content-Type: application/json

{
  "action": "emergency-broadcast",
  "data": {
    "message": "Severe weather alert - all drivers return to terminals"
  }
}
```

---

## 🔄 General System Endpoints

### Get System Metrics

```http
GET /api/go-with-the-flow?action=system-metrics
```

### Get Available Drivers

```http
GET /api/go-with-the-flow?action=available-drivers
```

### Get Live Loads

```http
GET /api/go-with-the-flow?action=live-loads
```

### Get Matching Queue Status

```http
GET /api/go-with-the-flow?action=matching-queue
```

### Get Recent Activity Feed

```http
GET /api/go-with-the-flow?action=recent-activity
```

---

## 🎯 Key Features

### Real-Time Matching

- **30-second offer timers** (like Uber pickup timers)
- **Dynamic pricing** with surge multipliers
- **Instant notifications** for load offers
- **GPS tracking** and location updates

### Uber-Like Experience

- **"Go Online/Offline"** driver availability toggle
- **"Request a Truck"** shipper interface
- **Accept/Decline** with countdown timers
- **Real-time pricing** based on supply/demand

### Admin Controls

- **Force driver status** changes
- **Manual load assignment** bypassing algorithms
- **Emergency broadcasts** to all drivers
- **Real-time system monitoring**

---

## 📱 Mobile App Integration

These APIs are designed to power:

- **Driver Mobile App** (React Native/Flutter)
- **Shipper Web Portal** (React/Next.js)
- **Dispatcher Dashboard** (Real-time admin interface)
- **Push Notifications** (Firebase/APNS integration)

---

## 🔮 Future Enhancements

1. **WebSocket Support** for real-time updates
2. **Geofencing** for automatic location updates
3. **Machine Learning** for better matching algorithms
4. **Payment Integration** for instant settlements
5. **Multi-tenant Support** for different carriers

---

## 🧪 Testing

Use tools like Postman or curl to test the endpoints:

```bash
# Get instant loads for driver
curl "http://localhost:3000/api/go-with-the-flow/driver?action=instant-loads&driverId=driver-1"

# Request a truck
curl -X POST "http://localhost:3000/api/go-with-the-flow/shipper" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "request-truck",
    "loadRequest": {
      "origin": "Dallas, TX",
      "destination": "Houston, TX",
      "equipmentType": "Dry Van",
      "weight": 20000,
      "urgency": "high",
      "pickupDate": "2024-08-08T10:00:00Z",
      "deliveryDate": "2024-08-08T18:00:00Z",
      "shipperId": "test-shipper"
    }
  }'
```














































































































