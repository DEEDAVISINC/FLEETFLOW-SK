# FleetFlow BOL Workflow - Editable Email System Guide

## Overview
The FleetFlow BOL (Bill of Lading) workflow system includes a comprehensive **editable email system** that allows brokers to customize invoice emails sent to vendors/shippers upon delivery completion and approval.

## Key Features

### 🎯 **Editable Email Components**
- **Email Subject Line** - Customizable invoice subject
- **Email Body** - Full HTML/text email content editor
- **Payment Terms** - Dropdown selection (Net 15/30/45/60, Due on Receipt, 2/10 Net 30)
- **Special Instructions** - Vendor-specific billing requirements
- **Contact Information** - Customizable billing contact email

### 📧 **Email Customization Process**

#### Step 1: BOL Review
1. Driver completes delivery and submits BOL
2. Broker receives notification for review
3. Broker opens BOL Review Panel in dashboard

#### Step 2: Email Customization
1. Click **"📧 Customize Email"** button
2. Email editor opens with auto-generated template
3. Customize all email components:
   - **Subject**: Modify invoice subject line
   - **Body**: Edit full email content with delivery details
   - **Payment Terms**: Select appropriate terms for vendor
   - **Special Instructions**: Add PO numbers, billing codes, etc.
   - **Contact Info**: Set billing department contact

#### Step 3: Preview & Send
1. Click **"👁️ Preview"** to review final email
2. Make final adjustments if needed
3. Click **"✅ Approve & Send Custom Email"**
4. Invoice email sent to vendor with customizations

### 🔧 **Default Email Template**
The system auto-generates professional invoice emails with:

```
Subject: Invoice INV-[LOAD-ID]-[TIMESTAMP] - Load [LOAD-ID] Delivered

Body:
Dear [SHIPPER-NAME] Accounts Payable,

Your shipment has been successfully delivered and is ready for payment processing.

INVOICE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Invoice Number: [INVOICE-ID]
Load Reference: [LOAD-IDENTIFIER-ID]
BOL Number: [BOL-NUMBER]
PRO Number: [PRO-NUMBER]

DELIVERY INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Delivery Date: [DATE]
Delivery Time: [TIME]
Receiver Name: [RECEIVER]
Driver: [DRIVER-NAME]
Carrier: [BROKER-NAME]

BILLING INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Amount Due: $[TOTAL-AMOUNT]
Due Date: [DUE-DATE]
Payment Terms: [TERMS]

[RATE BREAKDOWN IF ADJUSTMENTS]

REMIT PAYMENT TO:
FleetFlow Transportation Services
Accounts Receivable Department
Email: [CONTACT-EMAIL]
Reference: [LOAD-IDENTIFIER-ID]
```

### 💼 **Business Benefits**

#### **Vendor Relationship Management**
- **Personalized Communication**: Customize emails for each vendor relationship
- **Billing Requirements**: Add vendor-specific PO numbers, codes, references
- **Payment Terms**: Adjust terms based on vendor agreements
- **Professional Presentation**: Maintain brand consistency while personalizing content

#### **Operational Efficiency**
- **Automated Generation**: System creates professional template automatically
- **Quick Customization**: Edit only what needs to be changed
- **Preview Functionality**: Review before sending to avoid errors
- **Email-Only Delivery**: Professional communication method for business invoicing

#### **Compliance & Accuracy**
- **Complete Documentation**: All BOL and delivery details included
- **Load Identifier Integration**: Uses proper FleetFlow Load Identifier system
- **Audit Trail**: Complete tracking of email customizations and delivery
- **Professional Standards**: Business-appropriate invoice formatting

### 🚀 **Usage Instructions**

#### **For Brokers:**
1. **Access**: Navigate to Broker Dashboard → BOL Review tab
2. **Review**: Select pending BOL submission for review
3. **Customize**: Click "Customize Email" to open editor
4. **Edit Components**:
   - Subject line for vendor recognition
   - Email body for specific requirements
   - Payment terms per vendor agreement
   - Special instructions (PO numbers, billing codes)
   - Contact information for billing inquiries
5. **Preview**: Review final email before sending
6. **Approve**: Send customized invoice email to vendor

#### **For Administrators:**
- **Monitor**: Track email delivery success rates
- **Templates**: Create vendor-specific email templates for common relationships
- **Training**: Ensure brokers understand email customization features
- **Compliance**: Review email content for professional standards

### 📊 **Email Delivery Process**

```
🚛 DRIVER SUBMITS BOL
    ↓ (Automatic via driver portal)
📧 BROKER NOTIFICATION (SMS + Email)
    ↓ (Urgent review alert)
👔 BROKER REVIEWS & CUSTOMIZES EMAIL
    ↓ (Via editable email interface)
💰 CUSTOM INVOICE EMAIL GENERATED
    ↓ (With broker customizations)
📧 VENDOR RECEIVES PERSONALIZED EMAIL
    ↓ (Professional, customized communication)
✅ WORKFLOW COMPLETED WITH AUDIT TRAIL
```

### 🔗 **Integration Points**

#### **Load Identifier System**
- Uses proper FleetFlow Load Identifier format in all emails
- Consistent referencing across all communications
- Easy tracking and reference for all parties

#### **Notification System**
- Integrates with existing FleetFlow notification infrastructure
- Email-only delivery to vendors (no SMS spam)
- SMS+Email alerts to brokers for urgent reviews

#### **BOL Workflow**
- Seamless integration with complete BOL submission process
- Automatic data population from BOL and delivery information
- Complete audit trail of all email customizations and delivery

### 📋 **Best Practices**

#### **Email Customization**
- **Review Default Content**: Always check auto-generated content for accuracy
- **Vendor-Specific Terms**: Adjust payment terms based on vendor agreements
- **Professional Tone**: Maintain professional language and formatting
- **Complete Information**: Ensure all necessary billing details are included

#### **Special Instructions Usage**
- **PO Numbers**: Include required purchase order references
- **Billing Codes**: Add vendor-specific accounting codes
- **Contact Preferences**: Note any special communication requirements
- **Payment Methods**: Specify preferred payment methods if applicable

#### **Quality Assurance**
- **Preview Before Sending**: Always use preview function to review final email
- **Verify Recipient**: Confirm correct vendor email address
- **Check Calculations**: Verify all amounts and rate adjustments
- **Professional Standards**: Ensure email meets business communication standards

### 🎯 **Training Requirements**

#### **Broker Training Topics**
1. **Email Editor Navigation**: How to access and use email customization features
2. **Vendor Relationship Management**: When and how to customize emails for different vendors
3. **Professional Communication**: Maintaining business standards in email content
4. **System Integration**: Understanding how email system connects to BOL workflow

#### **Best Practice Guidelines**
- **Consistency**: Maintain consistent format while allowing customization
- **Accuracy**: Ensure all financial and delivery information is correct
- **Professionalism**: Use appropriate business language and tone
- **Efficiency**: Balance customization with operational speed

This editable email system ensures FleetFlow maintains professional vendor relationships while providing the flexibility needed for diverse billing requirements and business relationships.
