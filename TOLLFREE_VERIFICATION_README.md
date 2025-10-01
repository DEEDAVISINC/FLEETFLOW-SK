# FleetFlow Toll-Free Verification Implementation

## Overview

FleetFlow TMS LLC now supports toll-free phone number verification for SMS messaging through
Twilio's toll-free verification API. This implementation allows you to verify toll-free numbers for
compliant business messaging.

## Implementation Details

### EnhancedTwilioService Methods

#### `createTollfreeVerification(options)`

Creates a new toll-free verification request with FleetFlow's pre-configured business information.

**Parameters:**

- `tollfreePhoneNumberSid` (required): The SID of the toll-free phone number to verify
- `customerProfileSid` (optional): Primary Customer Profile SID (required for approved profiles)
- Additional business information fields (all optional, FleetFlow defaults will be used)

**FleetFlow Business Defaults:**

- Business Name: "FleetFlow TMS LLC"
- Business Website: "https://fleetflowapp.com"
- Business Address: "755 W. Big Beaver Rd STE 2020, Troy, MI 48084"
- Notification Email: "support@fleetflowapp.com"
- Use Case: Mixed (Customer Care, Delivery Notifications)
- Opt-in Type: Web-based (SaaS platform)

#### `getTollfreeVerification(verificationSid)`

Retrieves the status of a toll-free verification request.

#### `listTollfreeVerifications(options)`

Lists existing toll-free verification requests with optional status filtering.

## API Endpoints

### POST `/api/twilio-enhanced?action=create-tollfree-verification`

Creates a toll-free verification request.

**Request Body:**

```json
{
  "tollfreePhoneNumberSid": "PNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "customerProfileSid": "BUxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "businessName": "FleetFlow TMS LLC",
  "businessWebsite": "https://fleetflowapp.com"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    /* Twilio verification object */
  },
  "sid": "VNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "message": "Toll-free verification created successfully: VN..."
}
```

### POST `/api/twilio-enhanced?action=get-tollfree-verification`

Retrieves verification status.

**Request Body:**

```json
{
  "verificationSid": "VNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### GET `/api/twilio-enhanced?action=list-tollfree-verifications`

Lists verifications with optional filters.

**Query Parameters:**

- `status`: Filter by status (pending, approved, rejected, etc.)
- `limit`: Maximum number of results (default: 20)

## Usage Example

```javascript
// Create toll-free verification
const response = await fetch('/api/twilio-enhanced?action=create-tollfree-verification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tollfreePhoneNumberSid: 'PNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    customerProfileSid: 'BUxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  }),
});

const result = await response.json();
if (result.success) {
  console.log('Verification created:', result.sid);
}
```

## Business Value

- **Regulatory Compliance**: Meet FCC requirements for toll-free messaging
- **Professional Image**: Toll-free numbers enhance business credibility
- **Higher Deliverability**: Verified numbers have better SMS delivery rates
- **Legal Protection**: Documentation of proper verification process
- **Transportation Industry**: Essential for logistics and fleet communications

## Prerequisites

1. **Twilio Account**: Active Twilio account with toll-free number
2. **Primary Customer Profile**: Approved business profile in Twilio
3. **Toll-Free Number**: Purchased toll-free number (PN SID required)
4. **Business Documentation**: Supporting documents for verification

## Verification Process

1. Purchase toll-free number in Twilio Console
2. Create Primary Customer Profile with FleetFlow business details
3. Submit verification using the API endpoint
4. Wait for Twilio approval (typically 1-2 business days)
5. Start using verified number for SMS messaging

## Testing

Run the toll-free verification test suite:

```bash
node test-tollfree-verification.js
```

This validates the API implementation and provides setup instructions.

## Integration with FleetFlow TMS

The toll-free verification system integrates seamlessly with FleetFlow's existing SMS
infrastructure:

- Uses the same EnhancedTwilioService for consistency
- Inherits rate limiting and monitoring capabilities
- Supports batch messaging and delivery tracking
- Maintains cost analysis and optimization features

## Support

For issues with toll-free verification:

1. Check Twilio Console for verification status
2. Ensure Primary Customer Profile is approved
3. Verify business documentation is complete
4. Contact Twilio support if verification is rejected

## Next Steps

1. Configure Twilio credentials in production environment
2. Purchase and configure toll-free number
3. Complete Primary Customer Profile setup
4. Submit verification request
5. Monitor approval status
6. Deploy to production with verified toll-free number
