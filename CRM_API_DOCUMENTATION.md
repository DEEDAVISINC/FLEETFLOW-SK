# 🚀 FleetFlow CRM API Documentation

## Overview
The FleetFlow CRM API provides comprehensive customer relationship management capabilities specifically designed for the trucking and freight industry. This API supports full CRUD operations on contacts, opportunities, activities, and provides AI-powered insights.

## Authentication
All API requests require the `x-organization-id` header:
```
x-organization-id: your-organization-id
```

## Base URL
```
https://your-domain.com/api/crm
```

---

## 📋 **CONTACTS API**

### GET /api/crm/contacts
Get all contacts with optional filtering.

**Query Parameters:**
- `contact_type` - Filter by type (driver, shipper, carrier, broker, customer)
- `status` - Filter by status (active, inactive, prospect, blacklisted)
- `lead_source` - Filter by lead source
- `assigned_to` - Filter by assigned user ID
- `date_from` - Filter by creation date (ISO format)
- `date_to` - Filter by creation date (ISO format)
- `search` - Search in name, email fields
- `limit` - Number of results per page
- `offset` - Pagination offset

**Example Request:**
```bash
GET /api/crm/contacts?contact_type=shipper&status=active&limit=10
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "contact_type": "shipper",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "+1-555-0123",
      "company_name": "ABC Shipping",
      "status": "active",
      "lead_score": 85,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### POST /api/crm/contacts
Create a new contact.

**Required Fields:**
- `first_name` (string)
- `last_name` (string)
- `contact_type` (string: driver, shipper, carrier, broker, customer)

**Example Request:**
```bash
POST /api/crm/contacts
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "contact_type": "shipper",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "company_id": "company-uuid",
  "dot_number": "12345",
  "notes": "Potential high-value customer"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "lead_score": 45,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Contact created successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### PUT /api/crm/contacts?id=:id
Update an existing contact.

**Example Request:**
```bash
PUT /api/crm/contacts?id=uuid-here
Content-Type: application/json

{
  "email": "newemail@example.com",
  "phone": "+1-555-9999",
  "status": "active"
}
```

---

## 🎯 **OPPORTUNITIES API**

### GET /api/crm/opportunities
Get all opportunities with optional filtering.

**Query Parameters:**
- `status` - Filter by status (open, won, lost, cancelled)
- `assigned_to` - Filter by assigned user ID
- `stage` - Filter by pipeline stage
- `contact_id` - Filter by contact ID
- `company_id` - Filter by company ID
- `search` - Search in opportunity name, description
- `limit` - Number of results per page
- `offset` - Pagination offset

**Example Request:**
```bash
GET /api/crm/opportunities?status=open&stage=proposal&limit=10
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "opportunity_name": "Chicago to LA Route",
      "stage": "proposal",
      "value": 15000,
      "probability": 75,
      "expected_close_date": "2024-02-01",
      "contact_name": "John Doe",
      "company_name": "ABC Shipping",
      "status": "open",
      "load_type": "dry_van",
      "origin_city": "Chicago",
      "destination_city": "Los Angeles"
    }
  ],
  "count": 1,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### POST /api/crm/opportunities
Create a new opportunity.

**Required Fields:**
- `opportunity_name` (string)
- `stage` (string)

**Example Request:**
```bash
POST /api/crm/opportunities
Content-Type: application/json

{
  "opportunity_name": "Chicago to LA Route",
  "stage": "lead",
  "contact_id": "contact-uuid",
  "company_id": "company-uuid",
  "value": 15000,
  "probability": 25,
  "expected_close_date": "2024-02-01",
  "load_type": "dry_van",
  "origin_city": "Chicago",
  "origin_state": "IL",
  "destination_city": "Los Angeles",
  "destination_state": "CA",
  "equipment_type": "53ft_trailer"
}
```

### PUT /api/crm/opportunities?id=:id
Update opportunity stage.

**Example Request:**
```bash
PUT /api/crm/opportunities?id=uuid-here
Content-Type: application/json

{
  "stage": "negotiation"
}
```

---

## 📅 **ACTIVITIES API**

### GET /api/crm/activities
Get all activities with optional filtering.

**Query Parameters:**
- `activity_type` - Filter by type (call, email, meeting, task, note, sms, quote, follow_up)
- `status` - Filter by status (planned, in_progress, completed, cancelled)
- `assigned_to` - Filter by assigned user ID
- `contact_id` - Filter by contact ID
- `company_id` - Filter by company ID
- `opportunity_id` - Filter by opportunity ID
- `date_from` - Filter by activity date
- `date_to` - Filter by activity date
- `priority` - Filter by priority (low, normal, high, urgent)
- `limit` - Number of results per page
- `offset` - Pagination offset

**Example Request:**
```bash
GET /api/crm/activities?activity_type=call&status=completed&limit=10
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "activity_type": "call",
      "subject": "Follow-up call with John Doe",
      "activity_date": "2024-01-15T14:00:00Z",
      "duration_minutes": 15,
      "status": "completed",
      "call_direction": "outbound",
      "call_outcome": "interested",
      "contact_name": "John Doe",
      "company_name": "ABC Shipping",
      "assigned_to_name": "Jane Smith"
    }
  ],
  "count": 1,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### POST /api/crm/activities
Create a new activity.

**Required Fields:**
- `activity_type` (string)
- `subject` (string)
- `activity_date` (ISO datetime string)

**Example Request:**
```bash
POST /api/crm/activities
Content-Type: application/json

{
  "activity_type": "call",
  "subject": "Follow-up call with John Doe",
  "description": "Discuss upcoming shipment requirements",
  "contact_id": "contact-uuid",
  "activity_date": "2024-01-16T10:00:00Z",
  "duration_minutes": 30,
  "priority": "high",
  "call_direction": "outbound",
  "status": "planned"
}
```

---

## 📊 **DASHBOARD API**

### GET /api/crm/dashboard
Get comprehensive CRM dashboard data.

**Example Request:**
```bash
GET /api/crm/dashboard
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "total_contacts": 1250,
    "total_opportunities": 45,
    "total_activities": 2340,
    "pipeline_value": 875000,
    "won_opportunities": 12,
    "conversion_rate": 26.7,
    "recent_activities": [
      {
        "id": "uuid-here",
        "activity_type": "call",
        "subject": "Follow-up call",
        "activity_date": "2024-01-15T14:00:00Z",
        "contact_name": "John Doe"
      }
    ],
    "top_opportunities": [
      {
        "id": "uuid-here",
        "opportunity_name": "Chicago to LA Route",
        "value": 15000,
        "stage": "proposal",
        "probability": 75
      }
    ],
    "lead_sources": [
      {"source": "website", "count": 45},
      {"source": "referral", "count": 32}
    ],
    "contact_types": [
      {"type": "shipper", "count": 450},
      {"type": "carrier", "count": 380}
    ],
    "monthly_revenue": [
      {"month": "2024-01", "revenue": 125000},
      {"month": "2024-02", "revenue": 145000}
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 📈 **REPORTS API**

### GET /api/crm/reports/lead-sources
Get lead source performance report.

**Example Request:**
```bash
GET /api/crm/reports/lead-sources
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "source": "website",
      "total_contacts": 450,
      "active_contacts": 380,
      "average_lead_score": 65,
      "contact_types": {
        "shipper": 200,
        "carrier": 150,
        "driver": 100
      },
      "monthly_trend": {
        "2024-01": 45,
        "2024-02": 38
      }
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🤖 **AI FEATURES API**

### GET /api/crm/ai?action=lead-score&contact_id=:id
Calculate lead score for a contact.

**Example Request:**
```bash
GET /api/crm/ai?action=lead-score&contact_id=uuid-here
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "contact_id": "uuid-here",
    "lead_score": 85,
    "score_level": "hot"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /api/crm/ai?action=analyze-contact&contact_id=:id
Get AI analysis for a contact.

**Example Request:**
```bash
GET /api/crm/ai?action=analyze-contact&contact_id=uuid-here
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "contact_health": "excellent",
    "engagement_level": "high",
    "next_best_action": "Schedule contract discussion",
    "risk_factors": [],
    "opportunities": [
      "High engagement level",
      "Complete profile ready for outreach"
    ],
    "communication_preferences": {
      "preferred_method": "email",
      "preferences": [
        {"type": "email", "percentage": 60},
        {"type": "call", "percentage": 40}
      ]
    },
    "predicted_value": 25000
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### POST /api/crm/ai
Bulk AI operations.

**Example Request:**
```bash
POST /api/crm/ai
Content-Type: application/json

{
  "action": "bulk-lead-score",
  "contact_ids": ["uuid-1", "uuid-2", "uuid-3"]
}
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "contact_id": "uuid-1",
      "lead_score": 85,
      "score_level": "hot",
      "status": "success"
    },
    {
      "contact_id": "uuid-2",
      "lead_score": 45,
      "score_level": "cold",
      "status": "success"
    }
  ],
  "processed": 2,
  "successful": 2,
  "failed": 0,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🚦 **Error Handling**

All API endpoints return consistent error responses:

```json
{
  "error": "Missing required fields: first_name, last_name",
  "operation": "CREATE_CONTACT",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔧 **Rate Limiting**

- 1000 requests per hour per organization
- 100 requests per minute per organization
- Bulk operations count as 1 request regardless of batch size

---

## 📚 **Usage Examples**

### Complete Contact Management Flow
```javascript
// 1. Create a contact
const contact = await fetch('/api/crm/contacts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-organization-id': 'your-org-id'
  },
  body: JSON.stringify({
    first_name: 'John',
    last_name: 'Doe',
    contact_type: 'shipper',
    email: 'john@example.com'
  })
});

// 2. Calculate lead score
const leadScore = await fetch(`/api/crm/ai?action=lead-score&contact_id=${contact.id}`);

// 3. Create opportunity
const opportunity = await fetch('/api/crm/opportunities', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-organization-id': 'your-org-id'
  },
  body: JSON.stringify({
    opportunity_name: 'Chicago to LA Route',
    stage: 'lead',
    contact_id: contact.id,
    value: 15000
  })
});

// 4. Log activity
await fetch('/api/crm/activities', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-organization-id': 'your-org-id'
  },
  body: JSON.stringify({
    activity_type: 'call',
    subject: 'Initial contact call',
    contact_id: contact.id,
    activity_date: new Date().toISOString()
  })
});
```

---

This comprehensive CRM API provides all the functionality needed to manage contacts, opportunities, activities, and leverage AI-powered insights for your freight brokerage operations. The API is designed to scale with your business and integrate seamlessly with your existing FleetFlow platform. 