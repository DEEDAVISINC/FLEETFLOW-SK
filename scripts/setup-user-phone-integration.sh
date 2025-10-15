#!/bin/bash

# Sales Copilot AI + Phone System User Setup Script
# This script automates the complete setup process for individual users

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FLEETFLOW_API_URL="${FLEETFLOW_API_URL:-http://localhost:3001}"
ADMIN_TOKEN="${ADMIN_TOKEN}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if required tools are installed
    command -v curl >/dev/null 2>&1 || { log_error "curl is required but not installed."; exit 1; }
    command -v jq >/dev/null 2>&1 || { log_error "jq is required but not installed."; exit 1; }

    # Check environment variables
    if [ -z "$ADMIN_TOKEN" ]; then
        log_error "ADMIN_TOKEN environment variable is required"
        log_info "Set it with: export ADMIN_TOKEN='your-admin-jwt-token'"
        exit 1
    fi

    log_success "Prerequisites check passed"
}

# Validate user exists
validate_user() {
    local user_email="$1"

    log_info "Validating user: $user_email"

    local response=$(curl -s -w "\n%{http_code}" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        "$FLEETFLOW_API_URL/api/admin/users/search?email=$user_email")

    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n -1)

    if [ "$http_code" != "200" ]; then
        log_error "Failed to find user: $user_email (HTTP $http_code)"
        log_error "Response: $body"
        exit 1
    fi

    # Extract user ID
    USER_ID=$(echo "$body" | jq -r '.user.id')
    USER_NAME=$(echo "$body" | jq -r '.user.name')

    if [ "$USER_ID" = "null" ] || [ -z "$USER_ID" ]; then
        log_error "User not found: $user_email"
        exit 1
    fi

    log_success "Found user: $USER_NAME ($USER_ID)"
}

# Create Twilio phone number for user
create_phone_number() {
    local user_email="$1"
    local user_name="$2"

    log_info "Creating Twilio phone number for: $user_name"

    # This would typically call Twilio API to purchase/assign a number
    # For now, we'll simulate this step

    log_warning "Manual step required: Purchase phone number in Twilio Console"
    log_info "1. Go to https://console.twilio.com/"
    log_info "2. Navigate to Phone Numbers → Manage"
    log_info "3. Purchase a local number for $user_name"
    log_info "4. Configure Voice URL: $FLEETFLOW_API_URL/api/twilio-calls/twiml"
    log_info "5. Set Status Callback: $FLEETFLOW_API_URL/api/twilio-calls/status"
    log_info ""

    read -p "Enter the assigned phone number (e.g., +15551234567): " PHONE_NUMBER

    if [ -z "$PHONE_NUMBER" ]; then
        log_error "Phone number is required"
        exit 1
    fi

    log_success "Phone number assigned: $PHONE_NUMBER"
}

# Configure user phone settings
configure_user_phone() {
    local user_id="$1"
    local user_name="$2"
    local phone_number="$3"

    log_info "Configuring phone settings for: $user_name"

    local payload=$(cat <<EOF
{
  "userId": "$user_id",
  "phoneNumber": "$phone_number",
  "callerIdName": "FleetFlow Sales",
  "voiceEnabled": true,
  "recordingEnabled": true,
  "aiIntegrationEnabled": true,
  "tenantId": "org-depointe-001"
}
EOF
)

    local response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "$FLEETFLOW_API_URL/api/admin/users/phone-config")

    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n -1)

    if [ "$http_code" != "200" ] && [ "$http_code" != "201" ]; then
        log_error "Failed to configure user phone settings (HTTP $http_code)"
        log_error "Response: $body"
        exit 1
    fi

    log_success "Phone configuration completed for $user_name"
}

# Grant user permissions
grant_permissions() {
    local user_id="$1"
    local user_name="$2"

    log_info "Granting permissions for: $user_name"

    local permissions=(
        "phone.call"
        "phone.monitor"
        "crm.access"
        "ai.sales-copilot"
        "phone.record"
        "ai.voice-analysis"
    )

    for permission in "${permissions[@]}"; do
        local payload=$(cat <<EOF
{
  "userId": "$user_id",
  "permission": "$permission",
  "grantedBy": "setup-script"
}
EOF
)

        local response=$(curl -s -w "\n%{http_code}" \
            -X POST \
            -H "Authorization: Bearer $ADMIN_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$payload" \
            "$FLEETFLOW_API_URL/api/admin/permissions/grant")

        local http_code=$(echo "$response" | tail -n1)

        if [ "$http_code" != "200" ] && [ "$http_code" != "201" ]; then
            log_warning "Failed to grant permission: $permission (HTTP $http_code)"
        else
            log_info "✓ Granted: $permission"
        fi
    done

    log_success "Permissions granted for $user_name"
}

# Configure AI settings
configure_ai() {
    local user_id="$1"
    local user_name="$2"

    log_info "Configuring AI settings for: $user_name"

    local payload=$(cat <<EOF
{
  "userId": "$user_id",
  "salesStyle": "consultative",
  "industryFocus": "transportation",
  "objectionHandling": "soft_close",
  "communicationStyle": "professional",
  "keyTriggers": [
    "budget concerns",
    "timing issues",
    "competitor mentions",
    "technical questions"
  ],
  "responseStyle": "concise",
  "quietMode": false,
  "voiceGuidance": true
}
EOF
)

    local response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "$FLEETFLOW_API_URL/api/admin/users/ai-config")

    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n -1)

    if [ "$http_code" != "200" ] && [ "$http_code" != "201" ]; then
        log_warning "Failed to configure AI settings (HTTP $http_code)"
        log_warning "Response: $body"
    else
        log_success "AI configuration completed for $user_name"
    fi
}

# Setup CRM integration
configure_crm() {
    local user_id="$1"
    local user_name="$2"

    log_info "Configuring CRM integration for: $user_name"

    local payload=$(cat <<EOF
{
  "userId": "$user_id",
  "crmSyncEnabled": true,
  "autoUpdateContacts": true,
  "callLoggingEnabled": true,
  "leadScoringIntegration": true,
  "followUpAutomation": true
}
EOF
)

    local response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "$FLEETFLOW_API_URL/api/admin/users/crm-config")

    local http_code=$(echo "$response" | tail -n1)

    if [ "$http_code" != "200" ] && [ "$http_code" != "201" ]; then
        log_warning "Failed to configure CRM integration (HTTP $http_code)"
    else
        log_success "CRM integration configured for $user_name"
    fi
}

# Send setup notification
send_notification() {
    local user_email="$1"
    local user_name="$2"
    local phone_number="$3"

    log_info "Sending setup notification to: $user_email"

    local subject="🎯 Your Sales Copilot AI + Phone System is Ready!"
    local message=$(cat <<EOF
Hi $user_name,

Your Sales Copilot AI integration is now complete! Here's what you can do:

📞 Your Phone Number: $phone_number
🎯 Sales Copilot AI: Fully activated
📊 CRM Integration: Automatic sync enabled
📈 Performance Tracking: Real-time analytics

Quick Start:
1. Log into FleetFlow at https://fleetflowapp.com
2. Grant microphone permissions in your browser
3. Look for the phone widget in the bottom-right corner
4. Start making AI-powered sales calls!

Training Resources:
- Sales Copilot AI Guide: https://docs.fleetflow.com/sales-copilot
- Phone System Integration: https://docs.fleetflow.com/phone-integration

Need help? Contact support@fleetflow.com

Happy selling!
FleetFlow Team
EOF
)

    # This would send an email - for now just log it
    log_success "Setup notification prepared for $user_email"
    log_info "Subject: $subject"
    echo "$message"
}

# Main setup function
setup_user() {
    local user_email="$1"

    echo ""
    log_info "🚀 Starting Sales Copilot AI + Phone Integration Setup"
    log_info "User: $user_email"
    echo ""

    # Step 1: Validate user
    validate_user "$user_email"

    # Step 2: Create phone number
    create_phone_number "$user_email" "$USER_NAME"

    # Step 3: Configure phone settings
    configure_user_phone "$USER_ID" "$USER_NAME" "$PHONE_NUMBER"

    # Step 4: Grant permissions
    grant_permissions "$USER_ID" "$USER_NAME"

    # Step 5: Configure AI
    configure_ai "$USER_ID" "$USER_NAME"

    # Step 6: Configure CRM
    configure_crm "$USER_ID" "$USER_NAME"

    # Step 7: Send notification
    send_notification "$user_email" "$USER_NAME" "$PHONE_NUMBER"

    echo ""
    log_success "🎉 Setup completed successfully for $USER_NAME!"
    log_info "Phone Number: $PHONE_NUMBER"
    log_info "User can now make AI-powered sales calls"
    echo ""
}

# Print usage
usage() {
    echo "Sales Copilot AI + Phone System User Setup Script"
    echo ""
    echo "Usage:"
    echo "  $0 <user_email>"
    echo ""
    echo "Environment Variables:"
    echo "  FLEETFLOW_API_URL  - API endpoint (default: http://localhost:3001)"
    echo "  ADMIN_TOKEN        - Admin JWT token (required)"
    echo ""
    echo "Example:"
    echo "  export ADMIN_TOKEN='your-jwt-token'"
    echo "  $0 john.sales@fleetflow.com"
    echo ""
    exit 1
}

# Main script
main() {
    if [ $# -ne 1 ]; then
        usage
    fi

    local user_email="$1"

    check_prerequisites
    setup_user "$user_email"
}

# Run main function with all arguments
main "$@"</contents>
</xai:function_call



