# FleetFlow AI Agent Platform - Production Configuration Guide

## 🚀 Production Deployment Overview

This guide covers the complete production deployment of FleetFlow's AI Agent Platform, including
infrastructure setup, security configuration, monitoring, and scaling considerations.

## 📋 Prerequisites

### System Requirements

- **Server**: Ubuntu 20.04+ or CentOS 8+ (minimum 8GB RAM, 4 CPU cores)
- **Database**: PostgreSQL 14+ (dedicated instance recommended)
- **Node.js**: Version 18+ with npm/yarn
- **Redis**: Version 6+ (for caching and session management)
- **SSL Certificate**: Valid SSL certificate for HTTPS
- **Load Balancer**: Nginx or AWS ALB for production traffic

### Required API Keys & Services

- **Anthropic Claude AI**: Production API key with appropriate usage limits
- **Twilio**: Account SID, Auth Token, and dedicated phone number
- **Email Service**: SMTP credentials (Gmail, SendGrid, or AWS SES)
- **Social Media APIs**: Facebook, LinkedIn, Twitter API credentials
- **JotForm**: API key for webhook integration
- **Payment Processing**: Stripe API keys for billing
- **Monitoring**: Sentry DSN, DataDog API key (optional)

## 🔧 Environment Configuration

### Core Application Settings

```bash
# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@db-host:5432/fleetflow_ai_agent
POSTGRES_POOL_SIZE=20
POSTGRES_MAX_CONNECTIONS=100

# Security
JWT_SECRET=your-256-bit-jwt-secret-key
ENCRYPTION_KEY=your-32-character-encryption-key
WEBHOOK_SECRET=your-webhook-validation-secret
NEXTAUTH_SECRET=your-nextauth-secret-key
```

### AI Services Configuration

```bash
# Anthropic Claude AI
ANTHROPIC_API_KEY=your-production-anthropic-key
CLAUDE_MODEL=claude-3-sonnet-20240229
CLAUDE_MAX_TOKENS=4096
CLAUDE_RATE_LIMIT=1000
```

### Communication Services

```bash
# Twilio (SMS & Voice)
TWILIO_ACCOUNT_SID=your-production-account-sid
TWILIO_AUTH_TOKEN=your-production-auth-token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WEBHOOK_URL=https://your-domain.com/api/webhooks/twilio

# Email (SMTP)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# Social Media APIs
# YouTube (Google OAuth) - PRIMARY
YOUTUBE_CLIENT_ID=your-youtube-client-id
YOUTUBE_CLIENT_SECRET=your-youtube-client-secret
YOUTUBE_REDIRECT_URI=https://fleetflowapp.com/api/auth/youtube/callback
YOUTUBE_API_KEY=your-youtube-data-api-key

# YouTube (Google OAuth) - BACKUP
YOUTUBE_CLIENT_ID_BACKUP=your-youtube-backup-client-id
YOUTUBE_CLIENT_SECRET_BACKUP=your-youtube-backup-client-secret
YOUTUBE_REDIRECT_URI_BACKUP=https://fleetflowapp.com/api/auth/youtube/callback/backup

# LinkedIn
LINKEDIN_CLIENT_ID=86p6kq8n0j9ydq
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=https://fleetflowapp.com/api/auth/linkedin/callback

# Facebook/Instagram/Threads (Meta Graph API)
FACEBOOK_APP_ID=1248526630620464
FACEBOOK_APP_SECRET=252adb13cdaea9a8ed0b6613a65e3c0c
FACEBOOK_REDIRECT_URI=https://fleetflowapp.com/api/auth/facebook/callback
FACEBOOK_PAGE_ID=829755813550482
INSTAGRAM_ACCOUNT_ID=1141502797929986

# Threads (uses Facebook/Instagram credentials)
THREADS_APP_ID=1899999933902995
THREADS_APP_SECRET=880b2f188333377527204c9735127668

# Twitter/X (RESTRICTED - App violation)
# TWITTER_API_KEY=restricted
# TWITTER_API_SECRET=restricted
# TWITTER_REDIRECT_URI=https://fleetflowapp.com/api/auth/twitter/callback
# TWITTER_BEARER_TOKEN=restricted
# Note: Twitter/X access currently restricted. Consider appeal or new developer account.

# TikTok (Optional - can add later if needed)
TIKTOK_CLIENT_KEY=your-tiktok-client-key
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret
TIKTOK_REDIRECT_URI=https://fleetflowapp.com/api/auth/tiktok/callback
```

### Billing & Payment

```bash
# Stripe
STRIPE_PUBLIC_KEY=pk_live_your-stripe-public-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret
```

## 🗄️ Database Setup

### PostgreSQL Configuration

```sql
-- Create production database
CREATE DATABASE fleetflow_ai_agent;
CREATE USER fleetflow_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE fleetflow_ai_agent TO fleetflow_user;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
```

### Database Migration

```bash
# Run database migrations
npm run db:migrate:prod

# Seed initial data (if needed)
npm run db:seed:prod

# Create indexes for performance
npm run db:index:create
```

### Database Performance Tuning

```sql
-- PostgreSQL configuration (postgresql.conf)
shared_buffers = 2GB
effective_cache_size = 6GB
work_mem = 64MB
maintenance_work_mem = 512MB
max_connections = 100
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

## 🔐 Security Configuration

### SSL/TLS Setup

```bash
# Generate SSL certificate (using Let's Encrypt)
sudo certbot certonly --webroot -w /var/www/html -d your-domain.com

# Nginx SSL configuration
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Security Headers

```javascript
// next.config.js security headers
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
];
```

### Rate Limiting Configuration

```bash
# Rate limiting environment variables
RATE_LIMIT_MAX_REQUESTS=1000
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
EMAIL_RATE_LIMIT=60          # per minute
SMS_RATE_LIMIT=30            # per minute
CALL_RATE_LIMIT=10           # per minute
SOCIAL_RATE_LIMIT=20         # per minute
```

## 📊 Monitoring & Logging

### Application Monitoring

```bash
# Sentry error tracking
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production

# Health check configuration
HEALTH_CHECK_INTERVAL_MS=30000
HEALTH_CHECK_TIMEOUT_MS=5000
ENABLE_METRICS_COLLECTION=true
METRICS_PORT=9090
```

### Log Management

```javascript
// winston logging configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
```

### Monitoring Endpoints

```javascript
// Health check endpoints
GET /api/health/status      - Basic health check
GET /api/health/detailed    - Detailed system status
GET /api/health/database    - Database connectivity
GET /api/health/services    - External service status
GET /api/metrics           - Prometheus metrics
```

## 🔄 Redis Configuration

### Redis Setup

```bash
# Redis configuration (redis.conf)
maxmemory 2gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000

# Redis connection
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0
```

### Caching Strategy

```javascript
// Cache configuration
const CACHE_TTL = {
  templates: 3600, // 1 hour
  analytics: 1800, // 30 minutes
  user_sessions: 86400, // 24 hours
  api_responses: 300, // 5 minutes
};
```

## 🚀 Deployment Process

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy AI Agent Platform
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: Deploy to production
        run: |
          rsync -avz --delete ./build/ user@server:/var/www/fleetflow-ai/
          ssh user@server 'pm2 restart fleetflow-ai'
```

### PM2 Process Management

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'fleetflow-ai-agent',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '2G',
      node_args: '--max-old-space-size=4096',
    },
  ],
};
```

### Deployment Commands

```bash
# Build and deploy
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Database migrations
npm run db:migrate:prod

# SSL certificate renewal
sudo certbot renew --dry-run
```

## 📈 Scaling Configuration

### Load Balancing

```nginx
# Nginx load balancer configuration
upstream fleetflow_backend {
    least_conn;
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    location / {
        proxy_pass http://fleetflow_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Sticky sessions for WebSocket connections
        ip_hash;
    }
}
```

### Database Scaling

```bash
# Read replicas configuration
DATABASE_READ_REPLICA_URLS=postgresql://user:pass@replica1:5432/db,postgresql://user:pass@replica2:5432/db

# Connection pooling
POSTGRES_POOL_SIZE=20
POSTGRES_MAX_CONNECTIONS=100
```

## 🔧 Performance Optimization

### Application Performance

```bash
# Node.js optimization
NODE_OPTIONS="--max-old-space-size=4096 --optimize-for-size"
UV_THREADPOOL_SIZE=128

# Next.js optimization
NEXT_TELEMETRY_DISABLED=1
ANALYZE_BUNDLE=false
```

### Database Optimization

```sql
-- Performance indexes
CREATE INDEX CONCURRENTLY idx_ai_agent_configs_tenant_active
ON ai_agent_configs(tenant_id, is_active, created_at DESC);

CREATE INDEX CONCURRENTLY idx_conversation_logs_tenant_date
ON conversation_logs(tenant_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_lead_intelligence_tenant_score
ON lead_intelligence(tenant_id, lead_score DESC, qualification_status);

-- Analyze tables for query optimization
ANALYZE ai_agent_configs;
ANALYZE conversation_logs;
ANALYZE lead_intelligence;
```

## 📊 Backup & Recovery

### Automated Backups

```bash
#!/bin/bash
# backup_script.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/fleetflow"
DB_NAME="fleetflow_ai_agent"

# Database backup
pg_dump $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Application files backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /var/www/fleetflow-ai/

# Upload to S3
aws s3 sync $BACKUP_DIR s3://fleetflow-backups/production/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

### Recovery Procedures

```bash
# Database recovery
gunzip -c db_backup_YYYYMMDD_HHMMSS.sql.gz | psql fleetflow_ai_agent

# Application recovery
tar -xzf app_backup_YYYYMMDD_HHMMSS.tar.gz -C /var/www/
pm2 restart fleetflow-ai-agent
```

## 🔍 Testing in Production

### Smoke Tests

```bash
# Health check tests
curl -f https://your-domain.com/api/health/status
curl -f https://your-domain.com/api/health/database
curl -f https://your-domain.com/api/health/services

# API endpoint tests
curl -X POST https://your-domain.com/api/ai-agent/test \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Performance Testing

```bash
# Load testing with Artillery
artillery run load-test.yml

# Database performance
pgbench -c 10 -t 1000 fleetflow_ai_agent
```

## 🚨 Incident Response

### Monitoring Alerts

```yaml
# alertmanager.yml
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alerts@your-domain.com'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'team-notifications'

receivers:
  - name: 'team-notifications'
    email_configs:
      - to: 'team@your-domain.com'
        subject: 'FleetFlow AI Agent Alert: {{ .GroupLabels.alertname }}'
```

### Emergency Procedures

1. **Service Down**: Check PM2 status, restart services
2. **Database Issues**: Check connections, run diagnostics
3. **High Memory Usage**: Scale horizontally, check for memory leaks
4. **API Rate Limits**: Implement circuit breakers, notify users
5. **Security Incidents**: Rotate keys, check logs, notify team

## 📋 Post-Deployment Checklist

### Verification Steps

- [ ] Application loads correctly on production domain
- [ ] SSL certificate is valid and properly configured
- [ ] Database connections are working
- [ ] All API endpoints respond correctly
- [ ] Email/SMS/Voice communications are functional
- [ ] JotForm webhooks are receiving data
- [ ] Analytics and logging are operational
- [ ] Backup procedures are scheduled and tested
- [ ] Monitoring alerts are configured
- [ ] Load balancer health checks pass
- [ ] Security headers are properly set
- [ ] Rate limiting is enforced
- [ ] Error tracking is operational

### Go-Live Communication

```markdown
## FleetFlow AI Agent Platform - Production Deployment Complete

### System Status: ✅ LIVE

- **URL**: https://your-domain.com
- **Database**: PostgreSQL cluster operational
- **APIs**: All endpoints responding correctly
- **Monitoring**: Full observability stack active

### Key Metrics:

- Response time: <200ms average
- Uptime SLA: 99.9%
- Error rate: <0.1%
- Throughput: 1000+ requests/minute

### Support Contacts:

- **Technical Issues**: tech-support@your-domain.com
- **Emergency**: +1-XXX-XXX-XXXX
- **Status Page**: https://status.your-domain.com
```

This production configuration provides a comprehensive foundation for deploying FleetFlow's AI Agent
Platform at enterprise scale with proper security, monitoring, and reliability measures.
