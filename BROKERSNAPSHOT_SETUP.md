# BrokerSnapshot Integration Setup

## Overview
FleetFlow now includes integration with BrokerSnapshot.com to look up and monitor carriers and drivers using your existing BrokerSnapshot account credentials.

## Setup Instructions

### 1. Configure Your Credentials
1. Open the file `/Users/deedavis/FLEETFLOW/.env.local`
2. Replace `your_username_here` with your BrokerSnapshot.com username/email
3. Replace `your_password_here` with your BrokerSnapshot.com password
4. Save the file

### 2. Install Dependencies
The system needs Puppeteer for web automation. Run:
```bash
npm install puppeteer @types/puppeteer
```

### 3. Access the Feature
- Navigate to **Management > Carrier Verification** in FleetFlow
- Or search for "carrier verification" or "brokersnapshot" in the global search

## Features

### Carrier Lookup
- Enter an MC number to look up carrier information
- View company details, DOT numbers, truck/driver counts
- See safety ratings and insurance status
- Add carriers to your monitoring list

### Driver Lookup
- Search by license number and state
- View driver information, endorsements, violations
- Check medical certificate status and HAZMAT endorsements

### Carrier Monitoring
- Add multiple carriers to a monitoring list
- Run bulk checks to update all monitored carriers
- Track changes in carrier status over time

## Security Notes
- Your BrokerSnapshot credentials are stored locally and securely
- The system uses automated browser sessions to access data
- No credentials are transmitted to external servers except BrokerSnapshot.com
- Keep your `.env.local` file secure and never commit it to version control

## Troubleshooting

### Common Issues
1. **Login fails**: Verify your BrokerSnapshot credentials are correct
2. **Data not found**: BrokerSnapshot may have changed their website structure
3. **Slow performance**: The system waits between requests to avoid being blocked

### Browser Headless Mode
- The system runs in headless mode (invisible browser) by default
- For debugging, you can modify the service to show the browser window
- Check browser console logs for detailed error information

## Legal Compliance
- This integration respects BrokerSnapshot's terms of service
- Data is only accessed with your valid account credentials
- Use responsibly and in accordance with BrokerSnapshot's usage policies
