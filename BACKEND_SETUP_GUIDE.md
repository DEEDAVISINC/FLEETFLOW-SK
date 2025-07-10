# 🚛 FleetFlow Backend Setup Guide

## 📋 Prerequisites

Before setting up the FleetFlow backend, ensure you have:

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **Redis** (optional, for caching)
- **AWS Account** (for S3 file storage)
- **Twilio Account** (for SMS notifications)

## 🛠️ Quick Setup

### 1. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Or if you prefer yarn
yarn install
```

### 2. Database Setup
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb fleetflow

# Run database schema
psql fleetflow < database-setup.sql
```

### 3. Environment Configuration
```bash
# Copy environment template
cp backend-env-example.txt .env

# Edit .env file with your actual values
nano .env
```

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## 🔧 Required Environment Variables

### Database
```bash
DATABASE_URL=postgresql://localhost/fleetflow
```

### JWT Security
```bash
JWT_SECRET=your_super_secret_key_here
```

### AWS S3 (File Storage)
```bash
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=fleetflow-files
```

### Twilio (SMS)
```bash
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
```

## 🧪 Testing the API

### 1. Health Check
```bash
curl http://localhost:8000/api/health
```

### 2. Driver Login
```bash
curl -X POST http://localhost:8000/api/auth/driver/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1234567890",
    "password": "password123"
  }'
```

### 3. Get Assigned Loads
```bash
curl -X GET http://localhost:8000/api/drivers/DRV-001/loads/assigned \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📱 Frontend Integration

Update your Next.js frontend to point to the backend:

```typescript
// In your frontend API calls
const API_BASE_URL = 'http://localhost:8000/api';

// Example: Driver login
const loginDriver = async (phone: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/driver/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone, password })
  });
  
  return response.json();
};
```

## 🐳 Docker Setup (Optional)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/fleetflow
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: fleetflow
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database-setup.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## 🔐 Production Deployment

### Security Checklist
- [ ] Change all default passwords
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/SSL
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Enable request logging
- [ ] Set up monitoring (Sentry, New Relic)

### AWS Deployment
```bash
# Using AWS Elastic Beanstalk
eb init fleetflow-backend
eb create production
eb deploy

# Or using AWS Lambda (serverless)
serverless deploy
```

### Heroku Deployment
```bash
# Create Heroku app
heroku create fleetflow-backend

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

## 📊 Monitoring & Logs

### View Logs
```bash
# Development
npm run dev

# Production (PM2)
pm2 logs fleetflow-backend

# Docker
docker logs fleetflow-backend
```

### Health Monitoring
```bash
# Check server status
curl http://localhost:8000/api/health

# Database connection test
curl http://localhost:8000/api/db/health
```

## 🔄 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/driver/login` | Driver authentication |
| GET | `/api/drivers/:id/loads/assigned` | Get assigned loads |
| GET | `/api/loads/available` | Get available loads |
| POST | `/api/loads/:id/confirm` | Confirm load assignment |
| POST | `/api/deliveries/:id/complete` | Complete delivery |
| POST | `/api/files/upload` | Upload photos/signatures |
| GET | `/api/drivers/:id/notifications` | Get notifications |
| POST | `/api/notifications/sms/send` | Send SMS |
| GET | `/api/documents/:type/:loadId` | Download documents |

## 🆘 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Test connection
psql fleetflow -c "SELECT NOW();"
```

**File Upload Issues**
```bash
# Check AWS credentials
aws configure list

# Test S3 access
aws s3 ls s3://your-bucket-name
```

**SMS Not Sending**
```bash
# Verify Twilio credentials
curl -X GET "https://api.twilio.com/2010-04-01/Accounts.json" \
  -u your_sid:your_token
```

### Need Help?

1. Check the logs: `npm run dev` or `pm2 logs`
2. Verify environment variables are set correctly
3. Test individual API endpoints with curl or Postman
4. Check database connections and data

The backend is now ready to power your FleetFlow driver portal! 🚛✨
