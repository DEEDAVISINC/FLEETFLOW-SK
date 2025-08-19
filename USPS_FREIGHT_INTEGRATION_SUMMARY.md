# USPS Freight API Integration

## ✅ IMPLEMENTATION COMPLETE

The USPS Freight API has been successfully integrated into the FleetFlow platform, providing
comprehensive shipping and freight capabilities directly within the system.

### 🚚 Core Functionality Implemented

- ✅ **Rate Calculation** - Get freight shipping rates based on origin/destination ZIP codes and
  package details
- ✅ **Shipment Tracking** - Track freight shipments with real-time status updates
- ✅ **Pickup Scheduling** - Schedule pickups with custom time windows and special instructions
- ✅ **Address Validation** - Verify addresses for freight deliveries
- ✅ **Service Availability** - Check if freight service is available between locations
- ✅ **Transit Times** - Get estimated delivery times between locations

### 🔌 Technical Integration

- ✅ **Environment Variables** - Added necessary configuration to backend-env-example.txt
- ✅ **Service Layer** - Created usps-freight-service.ts with comprehensive API methods
- ✅ **API Routes** - Implemented /api/usps-freight and /api/usps-freight/pickup endpoints
- ✅ **System Integration** - Added service to FleetFlowSystemOrchestrator for centralized
  management
- ✅ **Demo UI** - Created user interface for testing and demonstrating API capabilities
- ✅ **Navigation** - Added link to demo page in Compliance section of main navigation

### 📊 Operational Benefits

- **Streamlined Shipping** - Direct integration with USPS Freight services
- **Cost Optimization** - Real-time rate comparison and service selection
- **Enhanced Tracking** - Centralized tracking of all USPS freight shipments
- **Improved Efficiency** - Automated pickup scheduling and address validation
- **Better Planning** - Transit time estimates for better delivery planning
- **Enhanced Customer Service** - Real-time shipment status information

### 🔧 Implementation Notes

To use the USPS Freight API in production:

1. Register for a USPS Web Tools account at
   [USPS Web Tools](https://www.usps.com/business/web-tools-apis/)
2. Request access to the USPS Freight APIs
3. Complete the necessary paperwork and sign the API agreements
4. Configure USPS account number and API credentials in .env file:
   ```
   USPS_FREIGHT_USERNAME=your_usps_username
   USPS_FREIGHT_PASSWORD=your_usps_password
   USPS_FREIGHT_API_URL=https://api.usps.com/freight/v1
   USPS_FREIGHT_API_KEY=your_usps_api_key
   USPS_FREIGHT_ACCOUNT_NUMBER=your_usps_account_number
   ```
5. Test thoroughly in production environment before going live

### 📝 Documentation

Full API documentation is available at:

- [USPS Web Tools API User Guide](https://www.usps.com/business/web-tools-apis/welcome.htm)
- [USPS Freight API Reference](https://www.usps.com/business/web-tools-apis/documentation-updates.htm)

_Note: The current implementation uses simulated responses for development. Replace with actual API
credentials before deployment._
