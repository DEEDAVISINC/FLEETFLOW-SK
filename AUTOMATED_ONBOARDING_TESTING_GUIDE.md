# 🧪 Automated Carrier Onboarding - Testing Guide

## 🚀 Quick Start Testing

### **1. Start Development Server**
```bash
npm run dev
```

### **2. Navigate to Onboarding**
- Main Dashboard: `http://localhost:3000`
- Click: **🚛 DRIVER MANAGEMENT** → **🚛 Carrier Onboarding**
- Click: **"Start New Onboarding"**

---

## 📄 Test Document Upload & Verification

### **Step 1: FMCSA Verification**
Complete with test data:
```
MC Number: MC-123456
DOT Number: 3456789
Legal Name: Test Carrier LLC
Phone: (555) 123-4567
Email: test@testcarrier.com
```

### **Step 2: Document Upload Testing**

#### **Test Document Categories**
1. **MC Authority Letter** (Required)
2. **Certificate of Insurance** (Required) - Tests coverage validation
3. **W-9 Tax Form** (Required) - Test online completion
4. **ELD Compliance Certificate** (Required)
5. **Notice of Assignment** (Optional) - Factoring companies

#### **W-9 Form Online Testing**
1. Click **"📝 Complete W-9 Form Online"**
2. Test the 4-step process:
   - **Business Information**: Select LLC, enter test business name
   - **Address**: Enter complete address with state selection
   - **Tax ID**: Test EIN format validation (12-3456789)
   - **Signature**: Digital signature with certification

#### **Document Upload Simulation**
- Upload any PDF/image file to test verification workflow
- System will simulate OCR processing and validation
- Check notification messages in browser console

---

## 🔔 Notification Testing

### **Console Output Verification**
Monitor browser DevTools console for:

```
📧 Email Notification Sent:
To: test@testcarrier.com
Subject: Document Received - Certificate of Insurance
Content: [Full email template]

📱 SMS Notification Sent:
To: (555) 123-4567
Content: [SMS message]
```

### **Notification Types to Test**
1. **Document Received** (Immediate on upload)
2. **Document Approved** (After successful verification)
3. **Document Rejected** (If validation fails)
4. **All Documents Complete** (When onboarding is finished)

---

## ✅ Verification Testing Scenarios

### **Scenario 1: Perfect Document Upload**
- Upload properly formatted documents
- Expect: All documents approved automatically
- Result: "All Documents Complete" notification

### **Scenario 2: Document Issues**
- System simulates various validation issues
- Expect: Specific rejection reasons with correction instructions
- Test: Reupload functionality

### **Scenario 3: Manual Review Required**
- Some documents trigger manual review (low confidence)
- Expect: "Needs Attention" status with 2-hour review timeline

### **Scenario 4: Mixed Results**
- Some documents approved, others rejected
- Test: Progress tracking and selective reupload

---

## 📊 Progress Tracking Tests

### **Visual Elements to Verify**
1. **Progress Bar**: Updates as documents are approved
2. **Status Indicators**: 
   - 🟢 Approved
   - 🟡 Processing  
   - 🔴 Rejected
   - 🟠 Needs Attention
   - ⚪ Pending

3. **Completion Percentage**: Calculates correctly based on required documents
4. **Document Counter**: Shows "X/Y documents completed"

---

## 🛠️ Feature Testing Checklist

### **Document Upload Features**
- [ ] File type validation (PDF, JPG, PNG, DOC, DOCX)
- [ ] File size limits respected
- [ ] Upload progress indication
- [ ] Error handling for failed uploads
- [ ] Multiple file format support

### **W-9 Form Features**
- [ ] 4-step wizard navigation
- [ ] Real-time field validation
- [ ] Tax ID format validation (SSN/EIN)
- [ ] State dropdown functionality
- [ ] Form completion and PDF generation

### **Verification Features**
- [ ] OCR data extraction simulation
- [ ] Validation rule enforcement
- [ ] Confidence scoring
- [ ] Issue identification and reporting
- [ ] Manual review queue handling

### **Notification Features**
- [ ] Email template population
- [ ] SMS message formatting
- [ ] Notification logging
- [ ] Multi-language support (if implemented)
- [ ] Delivery status tracking

---

## 🧪 Advanced Testing Scenarios

### **Test 1: Factoring Integration**
1. During onboarding, indicate carrier uses factoring
2. System should mark "Notice of Assignment" as required
3. Test upload and verification of factoring documents

### **Test 2: Insurance Expiration Handling**
1. Upload insurance certificate with near-expiration date
2. System should flag for renewal reminder
3. Test expiration notification workflow

### **Test 3: Multi-Document Upload**
1. Upload multiple documents simultaneously
2. Verify individual processing and status tracking
3. Test batch completion notifications

### **Test 4: Error Recovery**
1. Simulate processing failures
2. Test automatic retry mechanisms
3. Verify error notifications and recovery options

---

## 📱 Mobile Testing

### **Responsive Design Tests**
- [ ] Mobile browser compatibility
- [ ] Touch-friendly file upload
- [ ] Form completion on mobile devices
- [ ] Document camera capture (if implemented)
- [ ] Notification display on mobile

### **Performance Tests**
- [ ] Upload speeds on mobile networks
- [ ] Form completion time tracking
- [ ] Battery usage optimization
- [ ] Offline capability (if implemented)

---

## 🔍 Integration Testing

### **Portal Integration Tests**
1. Complete full onboarding workflow
2. Verify carrier appears in Enhanced Carrier Portal
3. Check driver profiles in Enhanced Driver Portal
4. Test portal access credential generation

### **Data Flow Tests**
1. FMCSA verification → Carrier data population
2. Document upload → Verification results
3. W-9 completion → Tax data integration
4. Completion → Portal account creation

---

## 📊 Performance Testing

### **Load Testing Scenarios**
```bash
# Simulate multiple concurrent uploads
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/documents/upload \
    -F "file=@test-document.pdf" \
    -F "carrierId=test-carrier-$i" \
    -F "documentType=certificate_insurance" &
done
```

### **Metrics to Monitor**
- **Document Processing Time**: Target < 5 seconds
- **Notification Delivery Time**: Target < 30 seconds
- **Form Completion Time**: Target < 10 minutes
- **Overall Onboarding Time**: Target < 24 hours

---

## 🐛 Error Testing

### **Failure Scenarios to Test**
1. **Network Interruption**: During file upload
2. **Invalid File Formats**: Unsupported file types
3. **Corrupted Documents**: Unreadable files
4. **Service Unavailability**: OCR service down
5. **Database Failures**: Connection issues

### **Expected Error Handling**
- Graceful error messages
- Retry mechanisms
- User guidance for resolution
- Support contact information
- Audit trail preservation

---

## 📧 Notification Email Testing

### **Email Template Verification**
1. Check email content formatting
2. Verify variable substitution
3. Test link functionality
4. Confirm mobile email display
5. Validate spam score

### **Sample Email Test**
```javascript
// Test email content
const testEmailData = {
  carrierName: 'Test Carrier LLC',
  documentName: 'Certificate of Insurance',
  uploadDate: '2024-01-15',
  approvalDate: '2024-01-15',
  expirationDate: '2025-01-15',
  issues: ['Coverage amount below minimum', 'Expiration date invalid']
};
```

---

## ✅ Test Completion Checklist

### **Basic Functionality**
- [ ] Document upload works for all required types
- [ ] W-9 form completion process functional
- [ ] Verification workflow processes correctly
- [ ] Notifications sent at appropriate times
- [ ] Progress tracking updates properly

### **User Experience**
- [ ] Clear instructions and guidance
- [ ] Error messages are helpful
- [ ] Navigation flows logically
- [ ] Mobile experience is smooth
- [ ] Accessibility requirements met

### **System Integration**
- [ ] FMCSA data populates correctly
- [ ] Portal integration creates accounts
- [ ] Accounting system receives data
- [ ] Audit trails are maintained
- [ ] Security measures are effective

### **Production Readiness**
- [ ] Performance meets requirements
- [ ] Error handling is robust
- [ ] Monitoring is in place
- [ ] Documentation is complete
- [ ] Support processes defined

---

## 🆘 Troubleshooting Common Issues

### **Document Upload Failures**
**Issue**: Files won't upload
**Solution**: Check file size limits and supported formats

**Issue**: Processing takes too long
**Solution**: Verify OCR service connectivity

### **Notification Issues**
**Issue**: Emails not sending
**Solution**: Check SendGrid API key configuration

**Issue**: SMS not delivering
**Solution**: Verify Twilio credentials and phone number format

### **Form Validation Issues**
**Issue**: Tax ID validation failing
**Solution**: Check regex patterns for SSN/EIN formats

**Issue**: State dropdown not working
**Solution**: Verify state array data and component binding

---

## 📞 Getting Help

### **Console Debugging**
- Open browser DevTools (F12)
- Check Console tab for error messages
- Monitor Network tab for API calls
- Review Application tab for local storage

### **Log Analysis**
- Server logs: Check terminal running `npm run dev`
- Application logs: Browser console messages
- Network logs: API request/response details
- Error logs: Detailed error stack traces

### **Support Resources**
- **Documentation**: Full system documentation in `/docs`
- **API Reference**: Endpoint documentation with examples
- **Video Tutorials**: Step-by-step walkthrough videos
- **Support Team**: Contact for technical assistance

---

**This testing guide ensures comprehensive validation of the automated carrier onboarding system. Follow each test scenario to verify full functionality before production deployment.**
