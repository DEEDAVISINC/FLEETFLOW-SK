# 🛠️ Automated Carrier Onboarding - Technical Setup Guide

## 📋 Implementation Overview

This guide provides step-by-step instructions for implementing the automated carrier onboarding system with document verification, notifications, and W-9 form completion.

---

## 🔧 Prerequisites

### **Required Services**
- **OCR Service**: AWS Textract, Google Vision API, or Azure Cognitive Services
- **Email Service**: SendGrid, AWS SES, or similar
- **SMS Service**: Twilio, AWS SNS, or similar
- **Document Storage**: AWS S3, Google Cloud Storage, or Azure Blob
- **Database**: PostgreSQL, MongoDB, or similar for audit trails

### **API Keys Required**
```env
# Document Processing
OCR_SERVICE_API_KEY=your_ocr_service_key
DOCUMENT_STORAGE_BUCKET=your_storage_bucket

# Notification Services
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# FMCSA Integration
FMCSA_API_KEY=your_fmcsa_key

# Database
DATABASE_URL=your_database_connection_string
```

---

## 📁 File Structure

```
/app
├── services/
│   ├── document-verification-service.ts
│   ├── notification-service.ts
│   ├── ocr-service.ts
│   └── storage-service.ts
├── onboarding/
│   └── carrier-onboarding/
│       └── components/
│           ├── DocumentUploadEnhanced.tsx
│           ├── W9Form.tsx
│           └── OnboardingWorkflow.tsx
├── lib/
│   ├── validation.ts
│   └── notifications.ts
└── types/
    ├── documents.ts
    └── carriers.ts
```

---

## 🗄️ Database Schema

### **Documents Table**
```sql
CREATE TABLE carrier_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carrier_id UUID NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255),
    file_url VARCHAR(500),
    file_size INTEGER,
    upload_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending',
    verification_result JSONB,
    extracted_data JSONB,
    expiration_date DATE,
    issues TEXT[],
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_carrier_documents_carrier_id ON carrier_documents(carrier_id);
CREATE INDEX idx_carrier_documents_status ON carrier_documents(status);
CREATE INDEX idx_carrier_documents_type ON carrier_documents(document_type);
CREATE INDEX idx_carrier_documents_expiration ON carrier_documents(expiration_date);
```

### **Notifications Table**
```sql
CREATE TABLE carrier_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carrier_id UUID NOT NULL,
    notification_type VARCHAR(100) NOT NULL,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    subject VARCHAR(500),
    body TEXT,
    email_sent BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    template_data JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_carrier_id ON carrier_notifications(carrier_id);
CREATE INDEX idx_notifications_status ON carrier_notifications(status);
CREATE INDEX idx_notifications_type ON carrier_notifications(notification_type);
```

### **Document Requirements Table**
```sql
CREATE TABLE document_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    required BOOLEAN DEFAULT TRUE,
    validation_rules JSONB,
    expiration_required BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default requirements
INSERT INTO document_requirements (document_type, category, required, validation_rules, expiration_required, description) VALUES
('mc_authority', 'Legal/Regulatory', true, 
 '{"fields": [{"field": "mcNumber", "type": "regex", "pattern": "^MC-?\\d{6,7}$", "required": true}]}', 
 false, 'Motor Carrier Operating Authority certificate from FMCSA'),
('certificate_insurance', 'Insurance', true,
 '{"fields": [{"field": "autoLiabilityCoverage", "type": "currency", "minValue": 1000000, "required": true}]}',
 true, 'Primary certificate showing auto liability and cargo coverage'),
('w9_form', 'Financial', true,
 '{"fields": [{"field": "taxId", "type": "regex", "pattern": "^(\\d{3}-\\d{2}-\\d{4}|\\d{2}-\\d{7})$", "required": true}]}',
 false, 'Completed and signed W-9 tax form for 1099 reporting');
```

---

## 🔨 Service Implementation

### **1. OCR Service Integration**

```typescript
// /app/services/ocr-service.ts
import AWS from 'aws-sdk';

export class OCRService {
  private textract: AWS.Textract;

  constructor() {
    this.textract = new AWS.Textract({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
  }

  async extractText(fileBuffer: Buffer, documentType: string): Promise<any> {
    const params = {
      Document: {
        Bytes: fileBuffer
      },
      FeatureTypes: ['TABLES', 'FORMS']
    };

    try {
      const result = await this.textract.analyzeDocument(params).promise();
      return this.parseTextractResult(result, documentType);
    } catch (error) {
      console.error('OCR extraction failed:', error);
      throw new Error('Document processing failed');
    }
  }

  private parseTextractResult(result: any, documentType: string): any {
    // Implementation specific to document type
    const extractedData: any = {};
    
    // Extract key-value pairs and tables based on document type
    if (documentType === 'certificate_insurance') {
      extractedData.autoLiabilityCoverage = this.extractCoverageAmount(result, 'auto liability');
      extractedData.cargoCoverage = this.extractCoverageAmount(result, 'cargo');
      extractedData.expirationDate = this.extractDate(result, 'expiration');
    }
    
    return extractedData;
  }

  private extractCoverageAmount(result: any, coverageType: string): number {
    // Implementation to find coverage amounts in OCR result
    return 1000000; // Placeholder
  }

  private extractDate(result: any, dateType: string): string {
    // Implementation to find dates in OCR result
    return '2025-12-31'; // Placeholder
  }
}
```

### **2. Document Storage Service**

```typescript
// /app/services/storage-service.ts
import AWS from 'aws-sdk';

export class StorageService {
  private s3: AWS.S3;
  private bucketName: string;

  constructor() {
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    this.bucketName = process.env.DOCUMENT_STORAGE_BUCKET || 'fleetflow-documents';
  }

  async uploadDocument(
    file: Buffer, 
    carrierId: string, 
    documentType: string, 
    fileName: string
  ): Promise<string> {
    const key = `carriers/${carrierId}/${documentType}/${Date.now()}-${fileName}`;
    
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: this.getContentType(fileName),
      ServerSideEncryption: 'AES256',
      Metadata: {
        carrierId,
        documentType,
        uploadDate: new Date().toISOString()
      }
    };

    try {
      const result = await this.s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      console.error('Document upload failed:', error);
      throw new Error('Failed to store document');
    }
  }

  async getSignedUrl(documentUrl: string): Promise<string> {
    const url = new URL(documentUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: 3600 // 1 hour
    };

    return this.s3.getSignedUrl('getObject', params);
  }

  private getContentType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'application/pdf';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'doc': return 'application/msword';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default: return 'application/octet-stream';
    }
  }
}
```

### **3. Enhanced Notification Service**

```typescript
// /app/services/notification-service.ts
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

export class NotificationService {
  private emailClient: any;
  private smsClient: any;

  constructor() {
    // Initialize SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    this.emailClient = sgMail;

    // Initialize Twilio
    this.smsClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    templateData?: any
  ): Promise<boolean> {
    try {
      const msg = {
        to,
        from: {
          email: 'onboarding@fleetflowapp.com',
          name: 'FleetFlow Onboarding Team'
        },
        subject,
        html: this.populateTemplate(htmlContent, templateData)
      };

      await this.emailClient.send(msg);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendSMS(to: string, message: string, templateData?: any): Promise<boolean> {
    try {
      await this.smsClient.messages.create({
        body: this.populateTemplate(message, templateData),
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });
      return true;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  private populateTemplate(template: string, data?: any): string {
    if (!data) return template;

    let result = template;
    Object.keys(data).forEach(key => {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), data[key] || '');
    });

    return result;
  }

  async logNotification(
    carrierId: string,
    type: string,
    recipient: { email?: string; phone?: string },
    content: { subject: string; body: string },
    status: { emailSent: boolean; smsSent: boolean }
  ): Promise<void> {
    // Store notification in database for audit trail
    const query = `
      INSERT INTO carrier_notifications 
      (carrier_id, notification_type, recipient_email, recipient_phone, subject, body, email_sent, sms_sent, sent_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    // Execute database insert (implementation depends on your database client)
    console.log('Notification logged:', { carrierId, type, status });
  }
}
```

---

## 🔄 Workflow Integration

### **1. Enhanced Document Upload Handler**

```typescript
// /app/api/documents/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DocumentVerificationService } from '../../../services/document-verification-service';
import { StorageService } from '../../../services/storage-service';
import { OCRService } from '../../../services/ocr-service';
import { NotificationService } from '../../../services/notification-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const carrierId = formData.get('carrierId') as string;
    const documentType = formData.get('documentType') as string;

    if (!file || !carrierId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Store document
    const storageService = new StorageService();
    const documentUrl = await storageService.uploadDocument(
      buffer,
      carrierId,
      documentType,
      file.name
    );

    // Extract data using OCR
    const ocrService = new OCRService();
    const extractedData = await ocrService.extractText(buffer, documentType);

    // Verify document
    const verificationResult = await DocumentVerificationService.verifyDocument(
      file,
      documentType,
      { carrierId }
    );

    // Store verification results in database
    await storeDocumentRecord({
      carrierId,
      documentType,
      fileName: file.name,
      fileUrl: documentUrl,
      fileSize: file.size,
      verificationResult,
      extractedData,
      status: verificationResult.verified ? 'approved' : 'rejected'
    });

    // Send notifications
    const notificationService = new NotificationService();
    const carrierData = await getCarrierData(carrierId);
    
    if (verificationResult.verified) {
      await DocumentVerificationService.sendNotification(
        'documentApproved',
        carrierData,
        { documentName: documentType }
      );
    } else {
      await DocumentVerificationService.sendNotification(
        'documentRejected',
        carrierData,
        { 
          documentName: documentType,
          issues: verificationResult.issues 
        }
      );
    }

    return NextResponse.json({
      success: true,
      verificationResult,
      documentUrl
    });

  } catch (error) {
    console.error('Document upload failed:', error);
    return NextResponse.json(
      { error: 'Document processing failed' },
      { status: 500 }
    );
  }
}

async function storeDocumentRecord(documentData: any): Promise<void> {
  // Database implementation to store document record
}

async function getCarrierData(carrierId: string): Promise<any> {
  // Database implementation to retrieve carrier data
  return {
    carrierId,
    legalName: 'Sample Carrier LLC',
    email: 'contact@carrier.com',
    phone: '(555) 123-4567'
  };
}
```

### **2. Document Status API**

```typescript
// /app/api/documents/status/[carrierId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { carrierId: string } }
) {
  try {
    const carrierId = params.carrierId;
    
    // Get all documents for carrier
    const documents = await getCarrierDocuments(carrierId);
    
    // Check completion status
    const completionStatus = DocumentVerificationService.checkOnboardingCompletion(
      documents.filter(doc => doc.status === 'approved')
    );

    return NextResponse.json({
      documents,
      completion: completionStatus,
      totalDocuments: documents.length,
      approvedDocuments: documents.filter(doc => doc.status === 'approved').length,
      pendingDocuments: documents.filter(doc => doc.status === 'pending').length,
      rejectedDocuments: documents.filter(doc => doc.status === 'rejected').length
    });

  } catch (error) {
    console.error('Failed to get document status:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve document status' },
      { status: 500 }
    );
  }
}

async function getCarrierDocuments(carrierId: string): Promise<any[]> {
  // Database query to get all documents for carrier
  return [];
}
```

---

## 📧 Email Template Setup

### **1. SendGrid Template Configuration**

```html
<!-- Document Received Template -->
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">✅ Document Received</h1>
  </div>
  
  <div style="padding: 20px; background: #f8fafc;">
    <p>Dear {{carrierName}},</p>
    
    <p>We have successfully received your <strong>{{documentName}}</strong> uploaded on {{uploadDate}}.</p>
    
    <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 16px; margin: 20px 0;">
      <p style="margin: 0;"><strong>Document Status:</strong> Under Review</p>
      <p style="margin: 0;"><strong>Expected Review Time:</strong> 2-4 business hours</p>
    </div>
    
    <p>You will receive another notification once the review is complete.</p>
    
    <p>Thank you for your prompt submission.</p>
    
    <p>Best regards,<br>
    <strong>FleetFlow Onboarding Team</strong></p>
  </div>
  
  <div style="background: #1f2937; color: white; padding: 16px; text-align: center; font-size: 12px;">
    <p>FleetFlow Logistics LLC | (555) 123-4567 | onboarding@fleetflowapp.com</p>
  </div>
</div>
```

### **2. Notification Template Variables**

```typescript
// Template variable definitions
const templateVariables = {
  documentReceived: [
    'carrierName',
    'documentName', 
    'uploadDate'
  ],
  documentApproved: [
    'carrierName',
    'documentName',
    'approvalDate',
    'expirationDate'
  ],
  documentRejected: [
    'carrierName',
    'documentName',
    'uploadDate',
    'issues' // Array of strings
  ],
  allDocumentsComplete: [
    'carrierName',
    'approvedDocuments' // Array of strings
  ]
};
```

---

## 🧪 Testing Setup

### **1. Test Data Creation**

```typescript
// /tests/setup/test-data.ts
export const testCarrierData = {
  carrierId: 'test-carrier-001',
  legalName: 'Test Transport LLC',
  email: 'test@testtransport.com',
  phone: '(555) 123-4567',
  mcNumber: 'MC-123456',
  dotNumber: '3456789'
};

export const testDocuments = [
  {
    file: 'sample-insurance-cert.pdf',
    type: 'certificate_insurance',
    expectedResult: {
      verified: true,
      extractedData: {
        autoLiabilityCoverage: 1000000,
        cargoCoverage: 100000,
        expirationDate: '2025-12-31'
      }
    }
  },
  {
    file: 'sample-w9.pdf',
    type: 'w9_form',
    expectedResult: {
      verified: true,
      extractedData: {
        businessName: 'Test Transport LLC',
        taxId: '12-3456789',
        tinType: 'EIN'
      }
    }
  }
];
```

### **2. Integration Tests**

```typescript
// /tests/integration/document-verification.test.ts
import { DocumentVerificationService } from '../../../app/services/document-verification-service';
import { testCarrierData, testDocuments } from '../setup/test-data';

describe('Document Verification Integration', () => {
  test('should verify insurance certificate', async () => {
    const file = new File(['test content'], 'insurance.pdf', { type: 'application/pdf' });
    
    const result = await DocumentVerificationService.verifyDocument(
      file,
      'certificate_insurance',
      testCarrierData
    );

    expect(result.verified).toBe(true);
    expect(result.extractedData.autoLiabilityCoverage).toBeGreaterThanOrEqual(1000000);
    expect(result.extractedData.cargoCoverage).toBeGreaterThanOrEqual(100000);
  });

  test('should send notification on document approval', async () => {
    const notificationSpy = jest.spyOn(DocumentVerificationService, 'sendNotification');
    
    await DocumentVerificationService.sendNotification(
      'documentApproved',
      testCarrierData,
      { documentName: 'Certificate of Insurance' }
    );

    expect(notificationSpy).toHaveBeenCalledWith(
      'documentApproved',
      expect.objectContaining({
        carrierName: testCarrierData.legalName,
        email: testCarrierData.email
      }),
      expect.objectContaining({
        documentName: 'Certificate of Insurance'
      })
    );
  });
});
```

---

## 📊 Monitoring & Analytics

### **1. Performance Monitoring**

```typescript
// /app/lib/monitoring.ts
export class MonitoringService {
  static async logDocumentProcessing(
    carrierId: string,
    documentType: string,
    processingTime: number,
    success: boolean,
    confidence?: number
  ): Promise<void> {
    const metrics = {
      timestamp: new Date().toISOString(),
      carrierId,
      documentType,
      processingTime,
      success,
      confidence
    };

    // Send to analytics service (e.g., CloudWatch, DataDog)
    console.log('Document processing metrics:', metrics);
  }

  static async trackOnboardingCompletion(
    carrierId: string,
    totalTime: number,
    documentsUploaded: number,
    documentsApproved: number
  ): Promise<void> {
    const completionMetrics = {
      timestamp: new Date().toISOString(),
      carrierId,
      totalTime,
      documentsUploaded,
      documentsApproved,
      successRate: (documentsApproved / documentsUploaded) * 100
    };

    console.log('Onboarding completion metrics:', completionMetrics);
  }
}
```

### **2. Error Tracking**

```typescript
// /app/lib/error-tracking.ts
export class ErrorTrackingService {
  static async logError(
    error: Error,
    context: {
      carrierId?: string;
      documentType?: string;
      operation: string;
    }
  ): Promise<void> {
    const errorData = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context
    };

    // Send to error tracking service (e.g., Sentry, Bugsnag)
    console.error('Application error:', errorData);
  }

  static async logDocumentIssue(
    carrierId: string,
    documentType: string,
    issues: string[],
    confidence: number
  ): Promise<void> {
    const issueData = {
      timestamp: new Date().toISOString(),
      carrierId,
      documentType,
      issues,
      confidence,
      requiresAttention: confidence < 0.8 || issues.length > 0
    };

    console.log('Document issue logged:', issueData);
  }
}
```

---

## 🚀 Deployment Checklist

### **Environment Configuration**
- [ ] OCR service API keys configured
- [ ] Email service (SendGrid) API keys set
- [ ] SMS service (Twilio) credentials configured
- [ ] Document storage bucket created and configured
- [ ] Database schema deployed
- [ ] Environment variables set in production

### **Security Setup**
- [ ] File upload size limits configured
- [ ] Allowed file types restricted
- [ ] Document storage encryption enabled
- [ ] API rate limiting implemented
- [ ] Input validation and sanitization in place

### **Monitoring & Alerts**
- [ ] Error tracking service configured
- [ ] Performance monitoring enabled
- [ ] Alert thresholds set for processing failures
- [ ] Dashboard created for onboarding metrics

### **Testing Verification**
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] End-to-end workflow tested
- [ ] Load testing completed
- [ ] Security testing completed

---

## 📞 Support & Maintenance

### **Ongoing Maintenance Tasks**
- **Document Template Updates**: Regularly update OCR templates for new document formats
- **Validation Rule Updates**: Adjust validation rules based on feedback and requirements
- **Performance Optimization**: Monitor and optimize processing times
- **Security Updates**: Keep all dependencies and services up to date

### **Support Escalation**
- **Level 1**: Automated retry mechanisms
- **Level 2**: Manual review queue for complex documents
- **Level 3**: Technical support team for system issues
- **Level 4**: Engineering team for service failures

---

**This technical setup guide provides the foundation for implementing a production-ready automated carrier onboarding system. Follow each section carefully and test thoroughly before deploying to production.**
