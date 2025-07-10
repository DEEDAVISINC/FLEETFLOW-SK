# FleetFlow Carrier Onboarding - Quick Test Guide

## Testing the Complete Workflow

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Access the System
- Main Dashboard: `http://localhost:3000`
- Navigate: **🚛 DRIVER MANAGEMENT** → **🚛 Carrier Onboarding**

### 3. Test User Roles
Edit `/app/config/access.ts` line 69 to change user:
```typescript
const currentUserId = 'broker-001'; // Change to test different roles:
// 'admin-001' - Full access
// 'mgr-001' - Manager access
// 'disp-001' - Dispatcher access
// 'broker-001' - Broker access
```

### 4. Complete Onboarding Workflow

#### Step 1: Start New Onboarding
- Click **"Start New Onboarding"** button
- View the 5-step process overview
- Click **"🚀 Start Carrier Onboarding"**

#### Step 2: FMCSA Verification
- Enter test data:
  - **MC Number**: MC-123456
  - **DOT Number**: 3456789
  - **Legal Name**: Test Carrier LLC
  - **Phone**: (555) 123-4567
  - **Email**: test@carrier.com
- Select equipment types (Dry Van, Reefer, etc.)
- Click **"✅ Verify & Continue"**

#### Step 3: Document Upload
- Upload documents (any files for testing)
- Required documents:
  - Certificate of Insurance
  - W9 Form
  - Operating Authority
- Click **"📄 Continue to Factoring"**

#### Step 4: Factoring Setup
- Choose option:
  - Select from existing companies (TBS Factoring, Apex Capital, etc.)
  - OR add custom factoring company
- Submit NOA if using factoring
- Click **"🏦 Continue to Agreements"**

#### Step 5: Agreement Signing
- Review and sign agreements:
  - Carrier Packet
  - Standard Terms
  - Insurance Requirements
  - Payment Terms
- Provide electronic signature
- Click **"📝 Continue to Portal Setup"**

#### Step 6: Portal Setup
- Enter primary contact information
- Add driver accounts:
  - Driver Name
  - Email Address
  - Phone Number
  - Role (Driver/Dispatcher/Admin)
- Configure permissions
- Click **"🎉 Complete Onboarding"**

### 5. View Integration Results

#### Completion Page
- View onboarding summary
- See integration success message
- Click **"🏢 View Carrier Portal"** or **"👥 View Driver Portal"**

#### Enhanced Carrier Portal
- Navigate: **🚛 DRIVER MANAGEMENT** → **🏢 Enhanced Carrier Portal**
- View newly created carrier profile
- Click on carrier card to see detailed information
- Search and filter capabilities

#### Enhanced Driver Portal
- Navigate: **🚛 DRIVER MANAGEMENT** → **👥 Enhanced Driver Portal**
- View newly created driver profiles
- Filter by carrier or activation status
- Click on driver card for detailed view

### 6. Test Multiple Carriers
- Return to onboarding dashboard
- Start new onboarding with different carrier information
- Verify data accumulates in portals

### 7. Test Access Control
- Change user role in `access.ts`
- Verify different permission levels:
  - Some users can't start onboarding
  - Some can't access certain features
  - Proper error messages display

## Expected Results

### After Completing Onboarding:
1. ✅ Carrier profile created in Enhanced Carrier Portal
2. ✅ Driver profiles created in Enhanced Driver Portal
3. ✅ Console shows integration success messages
4. ✅ Navigation works between all components
5. ✅ Data persists across sessions (in memory)
6. ✅ Search and filtering works in portals
7. ✅ Access control enforced properly

### Console Output (Check Browser DevTools):
```
✅ Integration successful: Onboarding completed successfully. Carrier and 2 driver portal(s) created.
📋 Carrier Profile Created: {carrierId: "carrier_...", companyInfo: {...}, ...}
👥 Driver Profiles Created: [{driverId: "driver_...", personalInfo: {...}, ...}]
🎉 Onboarding Integration Success: {success: true, message: "...", ...}
```

## Troubleshooting

### Common Issues:
1. **Access Denied**: Check user permissions in `access.ts`
2. **No Data in Portals**: Ensure onboarding workflow completes fully
3. **Console Errors**: Check browser DevTools for specific error messages
4. **Navigation Issues**: Verify file paths and component imports

### Reset Test Data:
- Refresh the page to reset in-memory data
- Or restart the development server

## Key Features Demonstrated

### Onboarding Workflow:
- ✅ 5-step guided process
- ✅ FMCSA integration simulation
- ✅ Document upload handling
- ✅ Factoring company setup
- ✅ Electronic agreement signing
- ✅ Portal access configuration

### Portal Integration:
- ✅ Automatic carrier profile creation
- ✅ Automatic driver account creation
- ✅ Real-time data flow
- ✅ Search and filtering
- ✅ Detailed information modals
- ✅ Performance metrics tracking

### System Features:
- ✅ Role-based access control
- ✅ Responsive design
- ✅ Professional UI/UX
- ✅ Comprehensive navigation
- ✅ Error handling
- ✅ Progress tracking

## Next Steps for Production

1. **Database Integration**: Replace in-memory storage with real database
2. **File Storage**: Implement actual document upload and storage
3. **Email/SMS**: Add real notification services
4. **Authentication**: Integrate with proper auth system
5. **API Endpoints**: Create REST APIs for external integrations
6. **Testing**: Add comprehensive test suite
7. **Deployment**: Set up production environment

The system is now fully functional for demonstration and development purposes!
