import { NextResponse } from 'next/server';

const privacyPolicyHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - FleetFlow™</title>
    <style>
        body {
            font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #374151;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            margin: 0;
            padding: 40px 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 30px;
        }
        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 10px;
        }
        h2 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 15px;
            border-left: 4px solid #3b82f6;
            padding-left: 15px;
        }
        .section { margin-bottom: 30px; }
        ul { padding-left: 20px; margin-bottom: 15px; }
        li { margin-bottom: 8px; }
        .contact-box {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            border: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="font-size: 3rem; margin-bottom: 15px;">🔒</div>
            <h1>Privacy Policy</h1>
            <div style="font-size: 1.1rem; color: #64748b; font-weight: 500;">FleetFlow™ Technologies, Inc.</div>
            <div style="font-size: 0.9rem; color: #94a3b8; margin-top: 5px;">Effective Date: December 2024 | Last Updated: December 2024</div>
        </div>

        <div class="section">
            <h2>1. Information We Collect</h2>
            <p>FleetFlow collects information necessary to provide transportation management services, including:</p>
            <ul>
                <li><strong>Personal Information:</strong> Contact details, driver qualifications, employment information</li>
                <li><strong>Operational Data:</strong> Load information, vehicle data, route information, performance metrics</li>
                <li><strong>Financial Information:</strong> Billing information, payment data, banking details (where authorized)</li>
                <li><strong>Technical Data:</strong> System usage information, IP addresses, device information</li>
            </ul>
        </div>

        <div class="section">
            <h2>2. How We Use Your Information</h2>
            <p>We use collected information for the following purposes:</p>
            <ul>
                <li>Providing transportation management services</li>
                <li>Processing payments and billing</li>
                <li>Ensuring compliance with DOT and other regulations</li>
                <li>Improving our services and platform functionality</li>
                <li>Customer support and communication</li>
                <li>Legal compliance and regulatory reporting</li>
            </ul>
        </div>

        <div class="section">
            <h2>3. Data Sharing and Disclosure</h2>
            <p>We share information only as necessary for business operations and legal compliance:</p>
            <ul>
                <li><strong>Service Providers:</strong> Third-party vendors who assist in providing our services</li>
                <li><strong>Regulatory Authorities:</strong> DOT, FMCSA, and other regulatory bodies as required</li>
                <li><strong>Business Partners:</strong> Carriers, shippers, and other business partners as needed for operations</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
            </ul>
        </div>

        <div class="section">
            <h2>4. Your Privacy Rights</h2>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Opt-out of certain data processing activities</li>
            </ul>
        </div>

        <div class="section">
            <h2>5. Data Security</h2>
            <p>We implement comprehensive security measures to protect your information:</p>
            <ul>
                <li>End-to-end encryption for data transmission</li>
                <li>AES-256 encryption for data storage</li>
                <li>Multi-factor authentication for system access</li>
                <li>Regular security audits and assessments</li>
                <li>24/7 security monitoring and incident response</li>
            </ul>
        </div>

        <div class="section">
            <h2>6. Contact Information</h2>
            <p>For questions about this privacy policy or to exercise your privacy rights:</p>
            <div class="contact-box">
                <p><strong>Privacy Team:</strong> privacy@fleetflowapp.com</p>
                <p><strong>General Contact:</strong> contact@fleetflowapp.com</p>
                <p><strong>Address:</strong> FleetFlow Technologies, Inc.<br>[Address will be provided upon platform launch]</p>
            </div>
        </div>

        <div class="section">
            <h2>7. Updates to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any material changes via email or through our platform. Your continued use of FleetFlow after such changes indicates your acceptance of the updated privacy policy.</p>
        </div>
    </div>
</body>
</html>`;

export async function GET() {
  return new NextResponse(privacyPolicyHTML, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
