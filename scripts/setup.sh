#!/bin/bash
set -e

echo "========================================="
echo "  🎬 Cinema App - Automated Setup"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "⚠️  Detected Windows environment"
    echo "Please make sure Docker Desktop is running!"
    echo ""
    read -p "Press Enter to continue..."
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

if ! command_exists docker; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites met${NC}"
echo ""

# Step 1: Backend setup
echo "📦 Step 1/6: Setting up backend..."
cd backend

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Created .env file from .env.example${NC}"
    echo ""
    echo "==========================================="
    echo "  🔑 TMDB API KEY REQUIRED"
    echo "==========================================="
    echo ""
    echo "To populate the database with movies, you need a TMDB API key."
    echo ""
    echo "How to get your FREE TMDB API key (takes 5 minutes):"
    echo "  1. Go to: https://www.themoviedb.org/signup"
    echo "  2. Create a free account and verify your email"
    echo "  3. After login, go to: Settings → API"
    echo "  4. Click 'Request an API Key' → Choose 'Developer'"
    echo "  5. Fill the form (use 'Educational/Personal')"
    echo "  6. Copy your API Key (v3 auth)"
    echo ""
    read -p "Enter your TMDB API Key (or press Enter to skip for now): " tmdb_key

    if [ -n "$tmdb_key" ]; then
        # Update TMDB API key in .env
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/YOUR_TMDB_API_KEY_HERE/$tmdb_key/" .env
        else
            sed -i "s/YOUR_TMDB_API_KEY_HERE/$tmdb_key/" .env
        fi
        echo -e "${GREEN}✅ TMDB API key configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipped TMDB API key. You can add it later in backend/.env${NC}"
    fi

    # Generate JWT secrets
    echo ""
    echo "🔐 Generating secure JWT secrets..."
    JWT_SECRET=$(openssl rand -base64 32)
    REFRESH_SECRET=$(openssl rand -base64 32)

    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/YOUR_SUPER_SECRET_JWT_KEY_CHANGE_THIS_IN_PRODUCTION/$JWT_SECRET/" .env
        sed -i '' "s/YOUR_SUPER_SECRET_REFRESH_TOKEN_KEY_CHANGE_THIS/$REFRESH_SECRET/" .env
    else
        sed -i "s/YOUR_SUPER_SECRET_JWT_KEY_CHANGE_THIS_IN_PRODUCTION/$JWT_SECRET/" .env
        sed -i "s/YOUR_SUPER_SECRET_REFRESH_TOKEN_KEY_CHANGE_THIS/$REFRESH_SECRET/" .env
    fi
    echo -e "${GREEN}✅ JWT secrets generated${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo ""
echo "📥 Installing backend dependencies..."
npm install --legacy-peer-deps
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

cd ..

# Step 2: Frontend setup
echo ""
echo "🎨 Step 2/6: Setting up frontend..."
cd frontend

if [ ! -f .env.local ]; then
    cp .env.example .env.local 2>/dev/null || echo "VITE_API_URL=http://localhost:3000/api" > .env.local
    echo -e "${GREEN}✅ Frontend .env.local created${NC}"
else
    echo -e "${GREEN}✅ .env.local file already exists${NC}"
fi

echo ""
echo "📥 Installing frontend dependencies..."
npm install --legacy-peer-deps
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

cd ..

# Step 3: Start Docker containers
echo ""
echo "🐳 Step 3/6: Starting Docker containers..."
cd backend
docker compose up -d
echo -e "${GREEN}✅ Docker containers started${NC}"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo "   - pgAdmin: http://localhost:5050"

# Step 4: Wait for database
echo ""
echo "⏳ Step 4/6: Waiting for database to be ready (15 seconds)..."
sleep 15
echo -e "${GREEN}✅ Database should be ready${NC}"

# Step 5: Database setup
echo ""
echo "🗄️  Step 5/6: Setting up database..."
echo "   Generating Prisma client..."
npx prisma generate
echo "   Running migrations..."
npx prisma migrate deploy
echo -e "${GREEN}✅ Database migrations completed${NC}"

# Step 6: Seed database
echo ""
echo "🌱 Step 6/6: Seeding database with TMDB data..."
if grep -q "YOUR_TMDB_API_KEY_HERE" .env; then
    echo -e "${YELLOW}⚠️  TMDB API key not configured - skipping seed${NC}"
    echo "   You can run 'npm run seed:tmdb' later after adding your API key"
else
    echo "   This will take 3-5 minutes to fetch and import 100+ movies..."
    npm run seed:tmdb || echo -e "${YELLOW}⚠️  Seeding failed - you can retry with: cd backend && npm run seed:tmdb${NC}"
fi

cd ..

# Summary
echo ""
echo "========================================="
echo "  ✅ Setup Complete!"
echo "========================================="
echo ""
echo "🚀 To start the application:"
echo ""
echo "  Terminal 1 (Backend):"
echo "  $ cd backend"
echo "  $ npm run dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "  $ cd frontend"
echo "  $ npm run dev"
echo ""
echo "📱 Access points:"
echo "  • Frontend:  http://localhost:5173"
echo "  • API:       http://localhost:3000/api"
echo "  • API Docs:  http://localhost:3000/api/docs"
echo "  • pgAdmin:   http://localhost:5050"
echo ""
echo "👤 Default admin credentials:"
echo "  • Email:    admin@cinema.com"
echo "  • Password: Admin@123"
echo ""
echo "📚 Need help? Check README.md"
echo ""
