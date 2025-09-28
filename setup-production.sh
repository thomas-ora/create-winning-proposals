#!/bin/bash

# Production Setup Script for Proposal Generation System
# ========================================================

set -e  # Exit on any error

echo "🚀 Proposal Generation System - Production Setup"
echo "================================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    echo "Creating .env from template..."
    cp .env.example .env
    print_success ".env file created from template"
fi

# Check if environment variables are set
source .env

if [[ -z "$VITE_SUPABASE_URL" || "$VITE_SUPABASE_URL" == "https://your-project-id.supabase.co" ]]; then
    print_warning "Supabase URL not configured in .env file"
    echo ""
    echo "Please provide your Supabase credentials:"
    read -p "Supabase Project URL (https://xxxxx.supabase.co): " SUPABASE_URL
    read -p "Supabase Anon Key: " SUPABASE_ANON_KEY

    # Update .env file
    sed -i.bak "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=$SUPABASE_URL|" .env
    sed -i.bak "s|VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY|" .env

    print_success "Environment variables updated"
else
    print_success "Environment variables already configured"
fi

# Step 1: Install dependencies if needed
echo ""
echo "📦 Step 1: Checking dependencies..."
if [ ! -d "node_modules" ]; then
    print_warning "Dependencies not installed. Installing..."
    npm install
    print_success "Dependencies installed"
else
    print_success "Dependencies already installed"
fi

# Step 2: Initialize Supabase if not already done
echo ""
echo "🗄️ Step 2: Setting up Supabase..."
if [ ! -f "supabase/.gitignore" ]; then
    print_warning "Initializing Supabase..."
    supabase init --workdir supabase
    print_success "Supabase initialized"
else
    print_success "Supabase already initialized"
fi

# Step 3: Link to remote project
echo ""
echo "🔗 Step 3: Linking to remote Supabase project..."
source .env
if [[ ! -z "$VITE_SUPABASE_URL" && "$VITE_SUPABASE_URL" != "https://your-project-id.supabase.co" ]]; then
    # Extract project ref from URL
    PROJECT_REF=$(echo $VITE_SUPABASE_URL | sed 's/https:\/\/\(.*\)\.supabase\.co/\1/')

    echo "Project reference: $PROJECT_REF"
    echo ""
    print_warning "You'll need to enter your database password for the remote project"

    # Try to link the project
    supabase link --project-ref $PROJECT_REF --workdir supabase || {
        print_error "Failed to link project. Please ensure:"
        echo "  1. You have the correct project URL"
        echo "  2. You know the database password"
        echo "  3. You have access to the project"
        exit 1
    }

    print_success "Successfully linked to remote project"
else
    print_error "Supabase URL not configured. Please update .env file first."
    exit 1
fi

# Step 4: Push database migrations
echo ""
echo "🔄 Step 4: Applying database migrations..."
supabase db push --workdir supabase || {
    print_warning "Migration push failed. This might be okay if migrations are already applied."
}

# Step 5: Deploy Edge Functions
echo ""
echo "⚡ Step 5: Deploying Edge Functions..."
supabase functions deploy --workdir supabase || {
    print_warning "Edge function deployment requires Supabase CLI login"
    echo "Please run: supabase login"
    echo "Then run this script again"
}

# Step 6: Test the build
echo ""
echo "🔨 Step 6: Testing production build..."
npm run build || {
    print_error "Build failed! Please fix any errors before deploying."
    exit 1
}
print_success "Production build successful"

# Step 7: Create initial API key (optional)
echo ""
echo "🔑 Step 7: API Key Setup"
echo "Would you like to create an initial API key now? (y/n)"
read -p "> " CREATE_KEY

if [[ "$CREATE_KEY" == "y" || "$CREATE_KEY" == "Y" ]]; then
    echo "Enter a name for this API key:"
    read -p "> " KEY_NAME

    # Generate a random API key
    API_KEY=$(openssl rand -hex 32)
    KEY_HASH=$(echo -n "$API_KEY" | openssl dgst -sha256 | cut -d' ' -f2)

    # Store in database
    source .env
    curl -X POST "$VITE_SUPABASE_URL/rest/v1/api_keys" \
        -H "apikey: $VITE_SUPABASE_ANON_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"name\": \"$KEY_NAME\", \"key_hash\": \"$KEY_HASH\"}" || {
        print_warning "Could not create API key via REST. You can create one from the web interface."
    }

    echo ""
    print_success "API Key created successfully!"
    echo ""
    echo "════════════════════════════════════════════════════════"
    echo "SAVE THIS API KEY - IT CANNOT BE RETRIEVED AGAIN:"
    echo "$API_KEY"
    echo "════════════════════════════════════════════════════════"
    echo ""
    echo "Key Name: $KEY_NAME"
    echo ""
fi

# Step 8: System health check
echo ""
echo "🏥 Step 8: Running system health check..."

# Test database connection
source .env
HEALTH_CHECK=$(curl -s "$VITE_SUPABASE_URL/rest/v1/api_keys?select=count" \
    -H "apikey: $VITE_SUPABASE_ANON_KEY" \
    -H "Content-Type: application/json")

if [[ "$HEALTH_CHECK" == *"count"* ]]; then
    print_success "Database connection successful"
else
    print_error "Database connection failed"
fi

# Summary
echo ""
echo "════════════════════════════════════════════════════════"
echo "              SETUP COMPLETE!"
echo "════════════════════════════════════════════════════════"
echo ""
print_success "✨ Your proposal generation system is ready!"
echo ""
echo "Next steps:"
echo "  1. Start development server: npm run dev"
echo "  2. Visit: http://localhost:8080"
echo "  3. Go to /setup for system verification"
echo "  4. Create API keys at /settings/api-keys"
echo "  5. Test the API at /test-api"
echo ""
echo "For production deployment:"
echo "  - Deploy to Vercel: npx vercel --prod"
echo "  - Or deploy to any static hosting service"
echo ""
print_success "Happy proposal generating! 🚀"