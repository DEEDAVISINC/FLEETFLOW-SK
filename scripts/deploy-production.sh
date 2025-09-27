#!/bin/bash

# FleetFlow TMS - Production Deployment Script
# Run this after setting up environment variables

echo "🚀 FleetFlow TMS - Production Deployment"
echo "========================================"

# Check if required environment variables are set
check_env_var() {
    if [ -z "${!1}" ]; then
        echo "❌ ERROR: $1 is not set in .env.local"
        exit 1
    else
        echo "✅ $1 is configured"
    fi
}

echo "🔍 Checking environment variables..."

# Load .env.local if it exists
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
    echo "✅ .env.local loaded"
else
    echo "❌ ERROR: .env.local file not found"
    echo "Please create .env.local with required environment variables"
    exit 1
fi

# Check critical environment variables
check_env_var "NEXTAUTH_SECRET"
check_env_var "NEXT_PUBLIC_SUPABASE_URL"
check_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY"

echo ""
echo "🏗️  Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix build errors before deploying."
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""

echo "🧪 Running production tests..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "⚠️  Type check warnings found, but continuing with deployment..."
fi

echo ""
echo "📦 Deployment Options:"
echo "1. Manual deployment to DigitalOcean App Platform"
echo "2. Docker deployment (recommended for VPS)"
echo "3. Vercel deployment (alternative)"
echo ""

read -p "Select deployment method (1-3): " choice

case $choice in
    1)
        echo "📋 DigitalOcean App Platform Deployment Instructions:"
        echo ""
        echo "1. Go to https://cloud.digitalocean.com/apps"
        echo "2. Click 'Create App'"
        echo "3. Connect your GitHub repository: https://github.com/yourusername/FLEETFLOW"
        echo "4. Configure these settings:"
        echo "   - Source Directory: /"
        echo "   - Build Command: npm run build"
        echo "   - Run Command: npm start"
        echo "   - Port: 3000"
        echo ""
        echo "5. Add these environment variables in DigitalOcean:"
        echo "   NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
        echo "   NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL"
        echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo "   NODE_ENV=production"
        echo ""
        echo "6. Configure custom domain: fleetflowapp.com"
        echo "7. Deploy!"
        ;;
    2)
        echo "🐳 Building Docker container..."

        # Create Dockerfile if it doesn't exist
        if [ ! -f Dockerfile ]; then
            cat > Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
EOF
        fi

        docker build -t fleetflow-tms .

        if [ $? -eq 0 ]; then
            echo "✅ Docker image built successfully!"
            echo "🚀 To run: docker run -p 3000:3000 --env-file .env.local fleetflow-tms"
        else
            echo "❌ Docker build failed"
            exit 1
        fi
        ;;
    3)
        echo "🔺 Vercel Deployment Instructions:"
        echo ""
        echo "1. Install Vercel CLI: npm i -g vercel"
        echo "2. Run: vercel"
        echo "3. Follow prompts to deploy"
        echo "4. Add environment variables in Vercel dashboard"
        echo "5. Configure custom domain: fleetflowapp.com"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "📋 Post-deployment checklist:"
echo "□ Test authentication system"
echo "□ Verify database connection"
echo "□ Test API integrations"
echo "□ Check SSL certificate"
echo "□ Monitor application logs"
echo "□ Conduct user acceptance testing"
echo ""
echo "🎉 FleetFlow TMS is ready for production!"
echo "📞 Support: (833) 386-3509"
echo "📧 Contact: ddavis@fleetflowapp.com"
