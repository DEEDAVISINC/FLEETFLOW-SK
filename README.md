# 🚚 FleetFlow TMS - Revolutionary Transportation Management System

[![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen)](https://fleetflowapp.com)
[![WOSB Certified](https://img.shields.io/badge/WOSB-Certified-blue)](https://fleetflowapp.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org)

**FleetFlow TMS** is the most advanced AI-powered transportation management system, built by freight
industry professionals for freight brokers, carriers, and fleet managers.

## 🎯 **Quick Start (Production Ready)**

### **1. Prerequisites**

- Node.js 18+
- NPM or Yarn
- Supabase account (free tier available)

### **2. Clone & Install**

```bash
git clone https://github.com/deeashaw/FLEETFLOW.git
cd FLEETFLOW
npm install
```

### **3. Environment Setup**

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials:
# - NEXTAUTH_SECRET (generated)
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - ANTHROPIC_API_KEY (for AI features)
# - GOOGLE_MAPS_API_KEY (for tracking)
```

### **4. Database Setup**

```bash
# Run the Supabase schema setup
# Copy contents of scripts/setup-supabase-database.sql
# Paste into your Supabase SQL Editor and execute
```

### **5. Build & Deploy**

```bash
# Test build locally
npm run build

# Deploy (multiple options)
./scripts/deploy-production.sh
```

### **6. Verify Setup**

```bash
# Test all API integrations
./scripts/test-api-integrations.sh
```

**🎉 Your FleetFlow TMS is now live at: https://fleetflowapp.com**

---

## 🏢 **Company Information**

### **FleetFlow TMS LLC**

- **Legal Entity**: Limited Liability Company
- **WOSB Certified**: Women-Owned Small Business
- **MC License**: #MC-1647572
- **DOT Number**: #DOT4250594
- **Address**: 755 W. Big Beaver Rd STE 2020, Troy, MI 48084
- **Phone**: (833) 386-3509
- **Email**: ddavis@fleetflowapp.com

### **Founder: Dieasha Davis**

- 9+ years entrepreneurship experience
- BBA Business Administration, University of Phoenix
- Active freight industry operator (Account Executive, Freight 1st Direct)
- Direct freight operations experience with MC license

---

## 🚀 **Core Features**

### **For Freight Brokers**

- 🤖 **AI-Powered Load Matching** - Intelligent carrier selection and pricing optimization
- 📊 **Advanced CRM** - Lead scoring, pipeline management, contact analysis
- 🔍 **FMCSA Integration** - Real-time carrier verification and compliance checking
- 💰 **Bill.com Integration** - Automated invoicing and payment processing
- 📈 **Performance Analytics** - Revenue tracking, margin analysis, KPI dashboards

### **For Carriers & Fleet Managers**

- 📱 **Mobile-First Design** - Native iOS/Android experience with offline sync
- 🗺️ **Real-Time Tracking** - GPS integration with automated customer notifications
- ✅ **Compliance Management** - DOT, FMCSA, state regulations automation
- 👥 **Driver Management** - Performance tracking, communication, documentation
- 🔧 **Maintenance Scheduling** - Automated reminders and compliance tracking

### **For Drivers**

- 📲 **Simplified Mobile App** - Intuitive interface with offline capabilities
- 📄 **Digital Documentation** - Electronic signatures, BOL, proof of delivery
- 💬 **Real-Time Communication** - Direct messaging with dispatch and brokers
- 🏆 **Performance Tracking** - Miles, earnings, safety scores, incentives

---

## 🛠️ **Technical Architecture**

### **Frontend Stack**

- **Next.js 15.5** - React framework with SSR/SSG
- **TypeScript 5.8** - Type-safe development
- **Tailwind CSS 4.1** - Utility-first styling
- **React 18.3** - Modern React with concurrent features

### **Backend Services**

- **Next.js API Routes** - Serverless backend architecture
- **Supabase** - PostgreSQL database with real-time subscriptions
- **NextAuth** - Authentication with 2FA support
- **Twilio** - SMS/Voice communication platform

### **AI & Integrations**

- **Claude AI (Anthropic)** - Advanced language model for automation
- **FMCSA SAFER API** - Real-time carrier verification
- **Google Maps API** - Routing, tracking, and geocoding
- **Bill.com API** - Financial operations automation
- **Square API** - Payment processing

### **Production Infrastructure**

- **405 Pages** - Comprehensive application coverage
- **Multi-Tenant** - Secure organization isolation
- **Real-Time** - Live updates and notifications
- **Mobile Responsive** - Works on all devices
- **Bank-Level Security** - 2FA, encryption, audit logs

---

## 🔐 **Security & Compliance**

### **Authentication**

- Two-Factor Authentication (2FA) for all users
- JWT tokens with secure session management
- Role-based access control (RBAC)
- Organization-level data isolation

### **Data Protection**

- AES-256 encryption at rest and in transit
- SOC 2 Type II compliant infrastructure (Supabase)
- GDPR and CCPA compliance features
- 7-year data retention policy

### **Industry Compliance**

- DOT and FMCSA regulation adherence
- ELD mandate compliance
- Hours of Service (HOS) tracking
- Safety audit and reporting

---

## 📚 **Demo & Testing**

### **Live Demo Credentials**

Access the production system at: **https://fleetflowapp.com**

- **Admin Portal**: admin@fleetflowapp.com / admin123
- **Dispatcher**: dispatch@fleetflowapp.com / dispatch123
- **Driver Portal**: driver@fleetflowapp.com / driver123
- **Broker Access**: broker@fleetflowapp.com / broker123

### **API Testing**

```bash
# Test all integrations
./scripts/test-api-integrations.sh

# Test specific endpoints
curl https://fleetflowapp.com/api/health
curl https://fleetflowapp.com/api/deployment-status
```

---

## 🎯 **Business Model**

### **Target Market**

- **Primary**: Freight brokers and 3PL companies (1-500 employees)
- **Secondary**: Carrier fleets and owner-operators (1-50 trucks)
- **Enterprise**: Large transportation companies (500+ employees)

### **Revenue Projections**

- **Year 1**: $185M ARR
- **Year 2**: $650M ARR
- **Year 3**: $2.1B ARR
- **TAM**: $12-20B enterprise transportation software market

### **Competitive Advantages**

- **WOSB Certification** - Access to government set-aside contracts
- **Founder-Market Fit** - Built by active industry operator
- **AI-First Approach** - Advanced automation and optimization
- **Mobile-Native** - Modern UX for drivers and managers

---

## 📞 **Support & Contact**

### **Customer Support**

- **Phone**: (833) 386-3509 (8 AM - 8 PM EST)
- **Email**: support@fleetflowapp.com
- **Emergency**: Available 24/7 for critical issues

### **Business Development**

- **Partnerships**: partnerships@fleetflowapp.com
- **Enterprise Sales**: sales@fleetflowapp.com
- **Government Contracts**: government@fleetflowapp.com

### **Technical Support**

- **Developer API**: developers@fleetflowapp.com
- **Integration Support**: integrations@fleetflowapp.com
- **Bug Reports**: bugs@fleetflowapp.com

---

## 🌟 **Contributing**

We welcome contributions from the transportation and technology communities:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**

- Follow TypeScript best practices
- Include tests for new features
- Maintain documentation
- Follow freight industry standards

---

## 📄 **License & Legal**

### **Software License**

This project is proprietary software owned by FleetFlow TMS LLC. For licensing inquiries, contact:
legal@fleetflowapp.com

### **Terms of Service**

By using FleetFlow TMS, you agree to our
[Terms of Service](https://fleetflowapp.com/terms-of-service) and
[Privacy Policy](https://fleetflowapp.com/privacy-policy).

### **Trademark**

FleetFlow™ and FleetFlow TMS™ are trademarks of FleetFlow TMS LLC.

---

## 🚀 **Ready to Transform Your Transportation Operations?**

**Get started today**: https://fleetflowapp.com

**Schedule a demo**: https://fleetflowapp.com/demo

**Join our community**: https://linkedin.com/company/fleetflow-tms

---

_Built with ❤️ by the FleetFlow team in Troy, Michigan_

_Revolutionizing transportation management, one load at a time._
