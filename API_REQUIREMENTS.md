# 🔌 API Requirements for FreightFlow RFx Response System

## 📋 Overview
This document outlines all the APIs needed to complete the FreightFlow RFx Response System with real-time data integration, moving from mock data to live market intelligence and opportunity discovery.

## 🏛️ Government & Public Sector APIs

### 1. SAM.gov (System for Award Management)
**Purpose**: Federal government contract opportunities  
**API**: https://api.sam.gov/opportunities/v2/  
**Documentation**: https://open.gsa.gov/api/opportunities-api/  
**Cost**: Free with registration  
**Key**: SAM_GOV_API_KEY  

```bash
# Registration Required
curl -X POST "https://api.sam.gov/opportunities/v2/search" \
  -H "X-Api-Key: YOUR_SAM_GOV_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "transportation freight",
    "postedFrom": "2025-01-01",
    "postedTo": "2025-12-31",
    "limit": 100
  }'
```

### 2. State Government Portals
**Purpose**: State-level transportation contracts  
**Implementation**: State-specific APIs (varies by state)  
**Examples**:
- California: https://caleprocure.ca.gov/api/
- Texas: https://www.txsmartbuy.com/api/
- Florida: https://www.myflorida.com/apps/vbs/api/

## 📊 Market Intelligence & Rate APIs

### 3. DAT (Digital Acceptance Tool)
**Purpose**: Load board data, spot rates, market trends  
**API**: https://api.dat.com/v2/  
**Documentation**: https://developer.dat.com/  
**Cost**: $200-500/month depending on usage  
**Key**: DAT_API_KEY  

```bash
# Rate Search Example
curl -X POST "https://api.dat.com/v2/rates/search" \
  -H "Authorization: Bearer YOUR_DAT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Atlanta, GA",
    "destination": "Dallas, TX",
    "equipmentType": "VAN",
    "pastDays": 30
  }'
```

### 4. FreightWaves SONAR
**Purpose**: Market intelligence, pricing analytics, capacity data  
**API**: https://api.freightwaves.com/sonar/v2/  
**Documentation**: https://docs.sonar.freightwaves.com/  
**Cost**: $1,000-5,000/month  
**Key**: SONAR_API_KEY  

```bash
# Market Data Example
curl -X GET "https://api.freightwaves.com/sonar/v2/market/rates" \
  -H "Authorization: Bearer YOUR_SONAR_API_KEY" \
  -H "Content-Type: application/json" \
  -G -d "origin=ATL" -d "destination=DAL" -d "equipment=van"
```

### 5. Truckstop.com Load Board
**Purpose**: Load opportunities, historical rates  
**API**: https://api.truckstop.com/v1/  
**Documentation**: https://developer.truckstop.com/  
**Cost**: $150-400/month  
**Key**: TRUCKSTOP_API_KEY  

```bash
# Load Search Example
curl -X GET "https://api.truckstop.com/v1/loads/search" \
  -H "Authorization: Bearer YOUR_TRUCKSTOP_API_KEY" \
  -H "Content-Type: application/json" \
  -G -d "origin=30309" -d "destination=75201" -d "equipment=V"
```

### 6. LoadSmart
**Purpose**: AI-powered pricing, shipper network  
**API**: https://api.loadsmart.com/v1/  
**Documentation**: https://docs.loadsmart.com/  
**Cost**: Contact for pricing  
**Key**: LOADSMART_API_KEY  

## 🏢 Enterprise Shipper APIs

### 7. Amazon Freight Partner API
**Purpose**: Amazon logistics opportunities  
**API**: https://freight.amazonaws.com/api/v1/  
**Documentation**: https://docs.aws.amazon.com/freight/  
**Cost**: Performance-based  
**Authentication**: AWS Signature V4  

```bash
# Requires AWS credentials and freight partner approval
export AWS_ACCESS_KEY_ID="your_access_key"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
export AWS_REGION="us-east-1"
```

### 8. Walmart Transportation API
**Purpose**: Walmart logistics network  
**API**: https://supplier.walmart.com/api/transportation/  
**Documentation**: Contact Walmart Supplier Development  
**Cost**: Invitation only  
**Key**: WALMART_SUPPLIER_API_KEY  

### 9. UPS Freight API
**Purpose**: UPS logistics partnerships  
**API**: https://www.ups.com/freight/api/  
**Documentation**: https://developer.ups.com/  
**Cost**: Volume-based  
**Key**: UPS_FREIGHT_API_KEY  

### 10. FedEx Freight API
**Purpose**: FedEx logistics network  
**API**: https://developer.fedex.com/api/freight/  
**Documentation**: https://developer.fedex.com/  
**Cost**: Volume-based  
**Key**: FEDEX_FREIGHT_API_KEY  

## 🌐 Industry Portal APIs

### 11. J.B. Hunt 360
**Purpose**: J.B. Hunt carrier network  
**API**: https://www.jbhunt.com/api/360/  
**Documentation**: Contact J.B. Hunt  
**Cost**: Partnership required  
**Key**: JBHUNT_360_API_KEY  

### 12. C.H. Robinson Navisphere
**Purpose**: C.H. Robinson network  
**API**: https://connect.chrobinson.com/api/  
**Documentation**: https://developer.chrobinson.com/  
**Cost**: Partnership required  
**Key**: CHR_CONNECT_API_KEY  

### 13. Convoy Partner API
**Purpose**: Convoy freight network  
**API**: https://convoy.com/api/partners/  
**Documentation**: Contact Convoy  
**Cost**: Performance-based  
**Key**: CONVOY_PARTNER_API_KEY  

## 📍 Mapping & Geocoding APIs

### 14. Google Maps API
**Purpose**: Route optimization, distance calculation  
**API**: https://maps.googleapis.com/maps/api/  
**Documentation**: https://developers.google.com/maps/  
**Cost**: $2-7 per 1,000 requests  
**Key**: GOOGLE_MAPS_API_KEY  

### 15. HERE Maps API
**Purpose**: Truck-specific routing  
**API**: https://developer.here.com/  
**Documentation**: https://developer.here.com/documentation/  
**Cost**: Tiered pricing  
**Key**: HERE_MAPS_API_KEY  

## 🔍 Additional Data Sources

### 16. FMCSA SAFER API
**Purpose**: Carrier safety ratings, compliance data  
**API**: https://ai.fmcsa.dot.gov/SMS/  
**Documentation**: https://www.fmcsa.dot.gov/safety/  
**Cost**: Free  
**Key**: None required (public API)  

### 17. Weather APIs
**Purpose**: Weather impact on transportation  
**Options**:
- OpenWeatherMap: https://openweathermap.org/api
- AccuWeather: https://developer.accuweather.com/
- Weather.gov: https://www.weather.gov/documentation/services-web-api

## 🔧 Implementation Setup

### Environment Variables (.env.local)
```bash
# Government APIs
SAM_GOV_API_KEY=your_sam_gov_key_here
FMCSA_API_KEY=not_required_public_api

# Market Intelligence APIs
DAT_API_KEY=your_dat_api_key_here
SONAR_API_KEY=your_freightwaves_sonar_key_here
TRUCKSTOP_API_KEY=your_truckstop_api_key_here
LOADSMART_API_KEY=your_loadsmart_api_key_here

# Enterprise Shipper APIs
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
WALMART_SUPPLIER_API_KEY=your_walmart_key_here
UPS_FREIGHT_API_KEY=your_ups_freight_key_here
FEDEX_FREIGHT_API_KEY=your_fedex_freight_key_here

# Industry Portal APIs
JBHUNT_360_API_KEY=your_jbhunt_key_here
CHR_CONNECT_API_KEY=your_chr_key_here
CONVOY_PARTNER_API_KEY=your_convoy_key_here

# Mapping APIs
GOOGLE_MAPS_API_KEY=your_google_maps_key_here
HERE_MAPS_API_KEY=your_here_maps_key_here

# Weather APIs
OPENWEATHER_API_KEY=your_openweather_key_here
```

## 💰 Cost Analysis

### Starter Package (Small Operations)
- **DAT API**: $200/month
- **Google Maps**: $50/month
- **OpenWeatherMap**: $40/month
- **SAM.gov**: Free
- **Total**: ~$290/month

### Professional Package (Medium Operations)
- **DAT API**: $350/month
- **FreightWaves SONAR**: $1,000/month
- **Truckstop.com**: $250/month
- **Google Maps**: $150/month
- **Multiple enterprise partnerships**: Variable
- **Total**: ~$1,750/month

### Enterprise Package (Large Operations)
- **Full FreightWaves SONAR**: $3,000/month
- **DAT Premium**: $500/month
- **Multiple load boards**: $800/month
- **Enterprise partnerships**: $2,000/month
- **Advanced mapping**: $300/month
- **Total**: ~$6,600/month

## 🚀 Implementation Priority

### Phase 1 (Immediate - Free/Low Cost)
1. ✅ SAM.gov API (Government contracts)
2. ✅ FMCSA SAFER API (Carrier data)
3. ✅ Google Maps Basic (Distance calculation)
4. ✅ OpenWeatherMap (Weather data)

### Phase 2 (Growth - Medium Cost)
1. 🔄 DAT API (Load board integration)
2. 🔄 Truckstop.com API (Additional loads)
3. 🔄 Google Maps Premium (Advanced routing)

### Phase 3 (Scale - High Value)
1. 🔄 FreightWaves SONAR (Market intelligence)
2. 🔄 Enterprise shipper partnerships
3. 🔄 Industry portal integrations

## 📞 API Acquisition Process

### 1. Quick Start (Free APIs)
- SAM.gov: Register at https://sam.gov/
- FMCSA: No registration required
- OpenWeatherMap: Sign up at https://openweathermap.org/

### 2. Commercial APIs
- Contact sales teams for enterprise pricing
- Request developer sandboxes for testing
- Negotiate volume discounts

### 3. Partnership APIs
- Apply for freight partner programs
- Meet carrier qualification requirements
- Complete onboarding processes

## ⚠️ Important Notes

1. **Rate Limits**: All APIs have rate limits - implement caching and queuing
2. **Data Rights**: Review terms of service for data usage rights
3. **Compliance**: Ensure FMCSA and DOT compliance for all integrations
4. **Security**: Store API keys securely, never expose in frontend code
5. **Redundancy**: Use multiple data sources for critical operations

## 🛡️ Security Best Practices

```typescript
// Example secure API client implementation
class SecureAPIClient {
  private apiKey: string;
  private baseURL: string;
  private rateLimiter: RateLimiter;

  constructor(apiKey: string, baseURL: string) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute
  }

  async request(endpoint: string, options: RequestOptions) {
    await this.rateLimiter.wait();
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }
}
```

This comprehensive API integration will transform your FreightFlow RFx system from a demonstration platform into a powerful, real-time freight bidding and market intelligence tool! 🚛✨
