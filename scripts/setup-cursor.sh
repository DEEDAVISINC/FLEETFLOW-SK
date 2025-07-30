#!/bin/bash

# FleetFlow Cursor Editor Optimization Setup Script
# Sets up the perfect development environment for FleetFlow

set -e

echo "🚀 FleetFlow Cursor Editor Optimization Setup"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    log_error "Please run this script from your FleetFlow project root directory"
    exit 1
fi

log_info "Setting up Cursor Editor optimization for FleetFlow..."

# ================================================================
# 1. INSTALL DEVELOPMENT DEPENDENCIES
# ================================================================

log_info "Installing development dependencies..."

# ESLint and Prettier packages
PACKAGES=(
    "@typescript-eslint/eslint-plugin"
    "@typescript-eslint/parser"
    "eslint-config-next"
    "eslint-config-prettier"
    "eslint-plugin-import"
    "eslint-plugin-jsx-a11y"
    "eslint-plugin-react"
    "eslint-plugin-react-hooks"
    "eslint-plugin-unused-imports"
    "eslint-import-resolver-typescript"
    "prettier"
    "prettier-plugin-tailwindcss"
    "@types/node"
    "@types/react"
    "@types/react-dom"
    "nodemon"
)

# Install packages
npm install --save-dev "${PACKAGES[@]}"

log_success "Development dependencies installed"

# ================================================================
# 2. INSTALL SUPABASE CLI
# ================================================================

log_info "Installing/updating Supabase CLI..."

if command -v supabase &> /dev/null; then
    log_info "Supabase CLI already installed, updating..."
    npm update -g supabase@latest
else
    log_info "Installing Supabase CLI globally..."
    npm install -g supabase@latest
fi

log_success "Supabase CLI ready"

# ================================================================
# 3. UPDATE PACKAGE.JSON SCRIPTS
# ================================================================

log_info "Adding npm scripts for development workflow..."

# Update package.json with development scripts
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts = pkg.scripts || {};

// Add development scripts
pkg.scripts['lint'] = 'next lint';
pkg.scripts['lint:fix'] = 'next lint --fix';
pkg.scripts['format'] = 'prettier --write .';
pkg.scripts['format:check'] = 'prettier --check .';
pkg.scripts['type-check'] = 'tsc --noEmit';

// Add type generation scripts
pkg.scripts['types:generate'] = './scripts/generate-types.sh development';
pkg.scripts['types:generate:all'] = './scripts/generate-types.sh development && ./scripts/generate-types.sh staging && ./scripts/generate-types.sh production';
pkg.scripts['types:generate:prod'] = './scripts/generate-types.sh production';
pkg.scripts['types:generate:staging'] = './scripts/generate-types.sh staging';
pkg.scripts['types:watch'] = 'nodemon --watch supabase/migrations --ext sql --exec \"npm run types:generate\"';

// Add quality check scripts
pkg.scripts['check:all'] = 'npm run type-check && npm run lint && npm run format:check';
pkg.scripts['fix:all'] = 'npm run format && npm run lint:fix';

// Pre-commit hook script
pkg.scripts['pre-commit'] = 'npm run check:all';

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

log_success "Package.json scripts updated"

# ================================================================
# 4. SETUP GIT HOOKS
# ================================================================

log_info "Configuring Git for better commit messages..."

# Set up git commit message template
git config commit.template .gitmessage

# Set up useful Git aliases
git config alias.st status
git config alias.co checkout
git config alias.br branch
git config alias.up 'pull --rebase'
git config alias.cm 'commit -m'
git config alias.ac 'add -A && git commit -m'
git config alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

log_success "Git configuration updated"

# ================================================================
# 5. CREATE TYPE DIRECTORIES
# ================================================================

log_info "Creating directories for generated types..."

mkdir -p lib/types
mkdir -p lib/hooks
mkdir -p lib/utils
mkdir -p supabase

log_success "Directory structure created"

# ================================================================
# 6. GENERATE INITIAL TYPES (if Supabase is configured)
# ================================================================

log_info "Checking Supabase configuration..."

if [ -n "$NEXT_PUBLIC_SUPABASE_URL" ] && [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    log_info "Supabase configured, generating initial types..."

    if [ -f "./scripts/generate-types.sh" ]; then
        chmod +x ./scripts/generate-types.sh
        ./scripts/generate-types.sh development || log_warning "Type generation failed - configure Supabase environment variables first"
    else
        log_warning "Type generation script not found"
    fi
else
    log_warning "Supabase environment variables not configured - skipping type generation"
    log_info "Set up your .env.local file with Supabase credentials first"
fi

# ================================================================
# 7. SETUP CURSOR-SPECIFIC CONFIGURATIONS
# ================================================================

log_info "Setting up Cursor-specific configurations..."

# Create .cursor directory for Cursor-specific settings
mkdir -p .cursor

# Create Cursor project settings
cat > .cursor/settings.json << 'EOF'
{
  "fleetflow.projectType": "nextjs-supabase",
  "fleetflow.environment": "development",
  "supabase.defaultProject": "fleetflow-development",
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.inlayHints.enabled": "onUnlessPressed"
}
EOF

log_success "Cursor configurations created"

# ================================================================
# 8. VALIDATE CONFIGURATION
# ================================================================

log_info "Validating configuration..."

# Check ESLint configuration
if npx eslint --print-config . > /dev/null 2>&1; then
    log_success "ESLint configuration valid"
else
    log_warning "ESLint configuration may have issues"
fi

# Check Prettier configuration
if npx prettier --check .prettierrc.json > /dev/null 2>&1; then
    log_success "Prettier configuration valid"
else
    log_warning "Prettier configuration may have issues"
fi

# Check TypeScript configuration
if npx tsc --noEmit --skipLibCheck > /dev/null 2>&1; then
    log_success "TypeScript configuration valid"
else
    log_warning "TypeScript configuration may have issues - check tsconfig.json"
fi

# ================================================================
# 9. DISPLAY NEXT STEPS
# ================================================================

log_success "🎉 Cursor Editor optimization complete!"

echo ""
log_info "Next Steps:"
echo "1. 📦 Install recommended extensions in Cursor:"
echo "   - Open Command Palette (Cmd/Ctrl + Shift + P)"
echo "   - Type: 'Extensions: Show Recommended Extensions'"
echo "   - Install all recommended extensions"
echo ""
echo "2. 🗄️ Configure Supabase (if not already done):"
echo "   - Install Supabase extension in Cursor"
echo "   - Set up your environment variables"
echo "   - Run: npm run types:generate"
echo ""
echo "3. 🔧 Available commands:"
echo "   - npm run lint           # Check for linting issues"
echo "   - npm run lint:fix       # Fix linting issues automatically"
echo "   - npm run format         # Format all code with Prettier"
echo "   - npm run type-check     # Check TypeScript types"
echo "   - npm run check:all      # Run all quality checks"
echo "   - npm run fix:all        # Fix all auto-fixable issues"
echo "   - npm run types:generate # Generate Supabase types"
echo ""
echo "4. 🎯 Git workflow:"
echo "   - Use structured commit messages (template loaded)"
echo "   - Run: git commit  # Uses FleetFlow commit template"
echo ""
echo "5. 🚀 Start developing:"
echo "   - npm run dev        # Start development server"
echo "   - All formatting and linting will happen automatically!"

log_success "Happy coding with FleetFlow! 🚛✨"
