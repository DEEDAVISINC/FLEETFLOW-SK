# LRAF Intelligence System - Complete Overview

## 🎯 System Purpose

A comprehensive Long Range Acquisition Forecast (LRAF) intelligence system that helps you discover,
track, and extract procurement opportunities from Federal, State, Local, and Enterprise sources.

## 📊 Complete Workflow

### Step 1: Search & Discover

1. Navigate to **FreightFlow RFx → LRAF Forecasting Tab**
2. Use the **LRAF Source Directory** to search for agencies
3. **Filter by**:
   - Tier (Federal, State, Local, Enterprise)
   - Priority (Critical, High, Medium, Low)
   - Transportation-Relevant Only
   - Category (Transportation, Defense, etc.)

### Step 2: Visit LRAF Page

1. Click **"Visit LRAF Page"** button for any source
2. Opens agency's official LRAF page in new tab
3. You can now see their published procurement forecasts

### Step 3: Manual Download

1. On the agency's LRAF page, find and download:
   - PDF documents (most common)
   - Excel spreadsheets
2. Save to your computer

### Step 4: Upload to FleetFlow

1. Return to FleetFlow LRAF Forecasting page
2. Fill in the upload form:
   - **Agency Name** (required) - e.g., "Department of Transportation"
   - **Agency Code** (optional) - e.g., "DOT"
   - **Fiscal Year** - e.g., "2025"
3. Click **"Select PDF or Excel File"**
4. Choose your downloaded file
5. System uploads and begins extraction

### Step 5: Automatic Extraction

The system automatically extracts:

- Opportunity titles
- NAICS codes
- Estimated contract values
- Fiscal years and quarters
- Small business set-asides
- WOSB eligibility
- Contact information
- Place of performance
- And more...

### Step 6: Review & Connect

1. Extracted opportunities appear in the forecast list
2. Filter and sort opportunities
3. View detailed information
4. Generate introduction emails to contracting officers
5. Add opportunities to your pipeline
6. Set alerts for when they post to SAM.gov

## 📚 LRAF Source Database

### Current Coverage: **100+ Sources**

#### Federal Tier (40+ agencies)

**Department Level:**

- Department of Transportation (DOT)
- Department of Defense (DOD)
- General Services Administration (GSA)
- Department of Homeland Security (DHS)
- Department of Veterans Affairs (VA)
- US Postal Service (USPS)
- And 13 more cabinet departments

**Defense Sub-Agencies:**

- Defense Logistics Agency (DLA) - Critical for transportation
- US Transportation Command (USTRANSCOM)
- US Army, Navy, Air Force, Marines
- Office of Naval Research (ONR)
- Naval Air Systems Command (NAVAIR)

**DHS Sub-Agencies:**

- Transportation Security Administration (TSA)
- US Coast Guard (USCG)
- Customs and Border Protection (CBP)
- Federal Emergency Management Agency (FEMA)
- Immigration and Customs Enforcement (ICE)

**DOT Sub-Agencies:**

- Federal Highway Administration (FHWA)
- Federal Motor Carrier Safety Administration (FMCSA)
- Federal Aviation Administration (FAA)
- Federal Transit Administration (FTA)
- Maritime Administration (MARAD)

#### State Tier (25 states)

Top states for transportation contracting:

- California, Texas, Florida, New York
- Pennsylvania, Illinois, Ohio, Georgia
- North Carolina, Michigan, New Jersey
- Virginia, Washington, Arizona, Massachusetts
- And 10 more states

#### Local Tier (10+ major cities)

- New York City
- Los Angeles
- Chicago
- Houston
- Phoenix
- Philadelphia
- San Antonio
- San Diego
- Dallas
- San Francisco

#### Enterprise Tier (15+ corporations)

**Retail & E-commerce:**

- Walmart - Massive logistics operations
- Amazon - Transportation & delivery
- Target - Supply chain opportunities

**Logistics & Shipping:**

- UPS - Critical supplier opportunities
- FedEx - Subcontracting programs
- C.H. Robinson - 3PL opportunities
- XPO Logistics

**Automotive:**

- Ford Motor Company
- General Motors (GM SupplyPower)
- Toyota

**Trucking:**

- J.B. Hunt
- Schneider
- Swift Transportation

**Airlines:**

- Delta Air Lines
- United Airlines

## 🎨 UI Features

### LRAF Source Directory

- **Real-time search** across 100+ sources
- **Smart filtering** by multiple criteria
- **Statistics dashboard** showing:
  - Total sources (100+)
  - Federal (40+)
  - State (25)
  - Local (10+)
  - Enterprise (15+)
  - Critical priority sources
  - Transportation-relevant sources
- **Direct links** to each agency's LRAF page
- **Color-coded badges** for tier and priority
- **Transportation indicator** for relevant sources
- **Sortable** by priority, tier, category, or agency name

### Upload System

- **Drag-and-drop interface** (coming)
- **Support for**:
  - PDF files
  - Excel files (.xls, .xlsx)
- **Automatic extraction** using AI
- **Validation** to ensure required fields
- **Progress indicators** during processing
- **Success confirmations** with opportunity count

## 🔧 Technical Components

### Files Created

1. **`/app/data/lraf-sources.ts`**
   - Master database of 100+ LRAF sources
   - Type-safe interfaces
   - Helper functions for filtering/searching

2. **`/app/components/LRAFSourceDirectory.tsx`**
   - React component for browsing sources
   - Search and filter functionality
   - Statistics dashboard

3. **`/app/components/GovContractForecaster.tsx`** (Updated)
   - Integrated LRAF Source Directory
   - Upload system already working
   - Displays extracted opportunities

4. **`/app/api/lraf-upload/route.ts`** (Existing)
   - Handles file uploads
   - Routes to PDF or Excel parser
   - Saves to database

5. **`/app/services/LRAFPDFParser.ts`** (Existing)
   - Extracts data from PDF documents
   - Pattern matching for opportunity data

6. **`/app/services/LRAFExcelParser.ts`** (Existing)
   - Extracts data from Excel spreadsheets
   - Column mapping and parsing

### Database

**Table:** `gov_contract_forecasts`

- Stores all extracted opportunities
- Fields include:
  - source, agency, agency_code
  - title, description
  - naics_code, estimated_value
  - fiscal_year, fiscal_quarter
  - small_business_set_aside
  - wosb_eligible
  - scanned_at, forecast_confidence

## 📈 Growth Potential

### Easy to Expand

The system is designed to easily add more sources:

- **Federal**: Add remaining 20+ cabinet departments and sub-agencies
- **State**: Add all 50 states (currently have 25)
- **Local**: Add 100+ major cities and counties
- **Enterprise**: Add Fortune 500 companies with public procurement forecasts

Target: **500-1000+ LRAF sources**

### Future Enhancements

- Automated scraping (currently manual upload by design)
- Email alerts when new LRAFs are published
- Historical tracking of forecast accuracy
- AI-powered opportunity matching
- Automated introduction email generation
- Pipeline integration with RFx bidding system

## 🚀 Usage Tips

### For Best Results

1. **Start with Critical Priority sources** - highest value opportunities
2. **Filter by Transportation-Relevant** if focused on logistics
3. **Check Federal agencies quarterly** - they update most frequently
4. **State/Local often annual** - check beginning of fiscal year
5. **Enterprise varies** - bookmark high-value corporate pages

### Transportation Focus

**Top agencies for transportation:**

- DOT (all sub-agencies) - Critical
- DLA - Critical (military logistics)
- USTRANSCOM - Critical
- USPS - Critical
- GSA - Critical (federal fleet)
- VA - High (medical transportation)
- TSA - High
- USCG - High
- FEMA - High (disaster logistics)

## 🎯 ROI & Business Value

### Time Savings

- **Before**: Hours searching individual agency sites
- **After**: Minutes browsing organized directory

### Early Intelligence

- See opportunities **3-24 months before** they post to SAM.gov
- Time to build relationships with contracting officers
- Prepare capability statements and past performance

### Competitive Advantage

- Most competitors only see opportunities when posted
- You're having conversations months in advance
- Position yourself as the solution before the RFP drops

### WOSB Focus

- Filter for WOSB-eligible opportunities
- Target high-value set-asides
- Strategic business development

## 📞 Support & Questions

This system is fully operational and ready to use. The workflow is:

1. **Search** LRAF Source Directory
2. **Visit** agency LRAF page
3. **Download** PDF/Excel document
4. **Upload** to FleetFlow
5. **Extract** opportunities automatically
6. **Connect** with contracting officers

All 100+ sources are live and ready to browse!
