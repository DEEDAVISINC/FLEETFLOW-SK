#!/bin/bash

# Digital Ocean Environment Variable Setup Script
# This script helps you set environment variables in Digital Ocean

echo "🔧 Digital Ocean Environment Variable Setup"
echo "==========================================="
echo ""

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "📦 Installing Digital Ocean CLI (doctl)..."
    echo ""

    # Download doctl directly
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Detected macOS"
        curl -sL https://github.com/digitalocean/doctl/releases/download/v1.104.0/doctl-1.104.0-darwin-amd64.tar.gz | tar -xzv
        sudo mv doctl /usr/local/bin
    else
        echo "Detected Linux"
        curl -sL https://github.com/digitalocean/doctl/releases/download/v1.104.0/doctl-1.104.0-linux-amd64.tar.gz | tar -xzv
        sudo mv doctl /usr/local/bin
    fi

    echo "✅ doctl installed"
    echo ""
fi

# Check if authenticated
if ! doctl auth list &> /dev/null; then
    echo "🔑 You need to authenticate with Digital Ocean"
    echo ""
    echo "Get your API token from:"
    echo "https://cloud.digitalocean.com/account/api/tokens"
    echo ""
    read -p "Enter your Digital Ocean API token: " DO_TOKEN
    doctl auth init -t "$DO_TOKEN"
    echo ""
fi

# List apps
echo "📱 Your Digital Ocean Apps:"
doctl apps list
echo ""

read -p "Enter your App ID (from the list above): " APP_ID
echo ""

# Read environment variables from file
ENV_FILE="DIGITAL_OCEAN_ENV_VARS.txt"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: $ENV_FILE not found"
    exit 1
fi

echo "📝 Setting environment variables from $ENV_FILE..."
echo ""

# Parse and set each variable
while IFS='=' read -r key value; do
    # Skip comments and empty lines
    if [[ $key =~ ^#.*$ ]] || [[ -z $key ]]; then
        continue
    fi

    # Remove leading/trailing whitespace
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)

    # Skip if value contains placeholder text
    if [[ $value == *"your_"* ]] || [[ $value == *"_here"* ]]; then
        echo "⏭️  Skipping $key (placeholder value)"
        continue
    fi

    echo "✅ Setting $key"
    doctl apps update "$APP_ID" --env "$key=$value"
done < <(grep -v '^#' "$ENV_FILE" | grep -v '^$')

echo ""
echo "✅ Environment variables set!"
echo ""
echo "🚀 Your app will automatically redeploy with the new variables"
echo ""
echo "Monitor deployment at:"
echo "https://cloud.digitalocean.com/apps/$APP_ID"
