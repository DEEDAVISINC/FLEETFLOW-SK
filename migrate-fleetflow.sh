#!/bin/bash

# FleetFlow Migration Script
# Automated setup for new computer migration
echo "🚛 FleetFlow Migration Script v1.0"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_info "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js found: $NODE_VERSION"

        # Check if version is 18 or higher
        NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR_VERSION" -ge 18 ]; then
            print_status "Node.js version is compatible (18+)"
        else
            print_error "Node.js version must be 18 or higher. Current: $NODE_VERSION"
            print_info "Please update Node.js: https://nodejs.org/"
            exit 1
        fi
    else
        print_error "Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
}

# Create project directory
create_project() {
    print_info "Setting up FleetFlow project directory..."

    if [ ! -d "FLEETFLOW" ]; then
        mkdir FLEETFLOW
        print_status "Created FLEETFLOW directory"
    else
        print_warning "FLEETFLOW directory already exists"
    fi

    cd FLEETFLOW

    # Create essential directory structure
    mkdir -p app/components
    mkdir -p app/services
    mkdir -p app/api
    mkdir -p app/contexts
    mkdir -p lib
    mkdir -p scripts
    mkdir -p docs

    print_status "Created project directory structure"
}

# Initialize package.json
init_package() {
    print_info "Initializing package.json..."

    cat > package.json << 'EOL'
{
  "name": "fleetflow",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit --skipLibCheck"
  },
  "dependencies": {
    "@heroicons/react": "^2.2.0",
    "@react-google-maps/api": "^2.20.7",
    "@supabase/auth-helpers-nextjs": "^0.10.0",
    "@supabase/supabase-js": "^2.50.5",
    "axios": "^1.10.0",
    "chart.js": "^4.5.0",
    "date-fns": "^2.30.0",
    "next": "^15.3.3",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-icons": "^5.5.0",
    "twilio": "^5.7.1",
    "uuid": "^11.1.0"
  },
  "devDependencies": {
    "@types/node": "^22.15.29",
    "@types/react": "^19.1.6",
    "@types/react-dom": "^19.1.6",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.31.0",
    "eslint-config-next": "^15.4.2",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.10",
    "typescript": "^5.8.3"
  }
}
EOL

    print_status "Package.json created"
}

# Install dependencies
install_deps() {
    print_info "Installing Node.js dependencies..."
    print_warning "This may take a few minutes..."

    npm install

    if [ $? -eq 0 ]; then
        print_status "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Create environment template
create_env_template() {
    print_info "Creating environment variable templates..."

    cat > .env.example << 'EOL'
# FleetFlow Environment Variables
# Copy this file to .env.local and fill in your actual values

# Database Configuration
DATABASE_URL=your_database_url_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# AI Services
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Communication Services
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
SENDGRID_API_KEY=your_sendgrid_api_key_here

# External API Keys
FMCSA_API_KEY=7de24c4a0eade12f34685829289e0446daf7880e
BILL_COM_API_KEY=your_bill_com_api_key_here
SQUARE_APPLICATION_ID=your_square_app_id_here

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOL

    print_status "Environment template created (.env.example)"
    print_warning "⚠️  IMPORTANT: Copy .env.example to .env.local and add your actual API keys!"
}

# Create Next.js config
create_nextjs_config() {
    print_info "Creating Next.js configuration..."

    cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  typescript: {
    // Allow production builds to complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow production builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
EOL

    print_status "Next.js configuration created"
}

# Create Tailwind config
create_tailwind_config() {
    print_info "Creating Tailwind CSS configuration..."

    cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fleetflow: {
          primary: '#3b82f6',
          secondary: '#14b8a6',
          accent: '#f4a832',
        },
      },
    },
  },
  plugins: [],
}
EOL

    print_status "Tailwind configuration created"
}

# Create TypeScript config
create_typescript_config() {
    print_info "Creating TypeScript configuration..."

    cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOL

    print_status "TypeScript configuration created"
}

# Create basic global CSS
create_global_css() {
    print_info "Creating global styles..."

    cat > app/globals.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

/* FleetFlow Custom Styles */
.fleetflow-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.glassmorphism {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
EOL

    print_status "Global CSS created"
}

# Create README
create_readme() {
    print_info "Creating README..."

    cat > README.md << 'EOL'
# FleetFlow™ Transportation Management System

## 🚛 Overview
FleetFlow is an advanced transportation management system providing comprehensive fleet operations, driver management, and logistics solutions.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation
1. Clone/copy the project files
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure
```
FLEETFLOW/
├── app/                  # Next.js app directory
│   ├── components/       # React components
│   ├── services/        # Business logic services
│   ├── api/            # API routes
│   └── contexts/       # React contexts
├── lib/                # Utilities and helpers
├── scripts/           # Database and setup scripts
└── docs/              # Documentation
```

## 🔑 Key Features
- **BOL Management**: Complete Bill of Lading workflow
- **Driver Portal**: Enhanced driver management and onboarding
- **Fleet Tracking**: Real-time GPS tracking and route optimization
- **FreightFlow RFx**: Request for Quote/Proposal system
- **AI Integration**: Claude AI-powered automation
- **Compliance**: DOT compliance and safety management

## 🛠️ Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## 📚 Documentation
Visit `/documentation` in the app for complete feature documentation.

## 🔧 Configuration
All configuration is handled through environment variables. See `.env.example` for required variables.

---
FleetFlow™ - The Professional Transportation Management Platform
EOL

    print_status "README.md created"
}

# Create a basic page to test the setup
create_test_page() {
    print_info "Creating test page..."

    cat > app/page.tsx << 'EOL'
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          FleetFlow™
        </h1>

        <p style={{
          fontSize: '20px',
          color: '#4a5568',
          marginBottom: '30px'
        }}>
          Transportation Management System
        </p>

        <div style={{
          background: '#e6fffa',
          border: '1px solid #81e6d9',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#0d4763', marginBottom: '10px' }}>
            🎉 Migration Successful!
          </h3>
          <p style={{ color: '#2d3748', margin: 0 }}>
            FleetFlow has been successfully set up on your new computer.
            Start by configuring your environment variables in .env.local
          </p>
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none'
          }}>
            🚛 Ready to start FleetFlow operations
          </div>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#f7fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ color: '#2d3748', marginBottom: '15px' }}>Next Steps:</h4>
          <ol style={{
            textAlign: 'left',
            color: '#4a5568',
            lineHeight: '1.6',
            paddingLeft: '20px'
          }}>
            <li>Copy your .env.local file with API keys</li>
            <li>Set up Supabase database connection</li>
            <li>Import your BOL workflow components</li>
            <li>Configure user authentication</li>
            <li>Test core functionality</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
EOL

    print_status "Test page created"
}

# Main execution
main() {
    echo ""
    print_info "Starting FleetFlow migration setup..."
    echo ""

    # Run all setup functions
    check_node
    echo ""

    create_project
    echo ""

    init_package
    echo ""

    install_deps
    echo ""

    create_env_template
    echo ""

    create_nextjs_config
    create_tailwind_config
    create_typescript_config
    echo ""

    create_global_css
    echo ""

    create_test_page
    echo ""

    create_readme
    echo ""

    print_status "FleetFlow migration setup completed successfully!"
    echo ""
    print_info "======================================="
    print_info "🎯 NEXT STEPS:"
    print_info "======================================="
    print_warning "1. Copy your .env.local file with API keys"
    print_warning "2. Import your BOL components and services"
    print_warning "3. Set up database connection"
    print_warning "4. Test the application:"
    echo -e "   ${BLUE}cd FLEETFLOW${NC}"
    echo -e "   ${BLUE}npm run dev${NC}"
    echo ""
    print_status "🌐 Then visit: http://localhost:3000"
    echo ""
    print_info "📦 Use the MIGRATION_EXPORT_PACKAGE.ts file to import your components"
    echo ""
}

# Run the main function
main

