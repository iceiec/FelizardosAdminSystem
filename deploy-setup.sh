#!/bin/bash
# Quick deployment setup script
# Run this after you've created Supabase and Render/Railway projects

echo "=== Felizardo Admin System - Deployment Setup ==="
echo ""

# Check if running from project root
if [ ! -f "package.json" ] && [ ! -f "backend/package.json" ]; then
    echo "Error: Please run this script from the project root directory"
    exit 1
fi

echo "Step 1: Setting up backend environment variables..."
echo ""
echo "Enter your Supabase connection details:"
read -p "Database URL (postgresql://...): " DATABASE_URL
read -sp "JWT Secret (press Enter to generate): " JWT_SECRET
echo ""

if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Generated JWT_SECRET: $JWT_SECRET"
fi

# Create backend .env
cat > backend/.env << EOF
DATABASE_URL=$DATABASE_URL
JWT_SECRET=$JWT_SECRET
NODE_ENV=production
PORT=5000
EOF

echo "✓ Backend .env created"
echo ""

echo "Step 2: Setting up frontend environment variables..."
read -p "Backend URL (https://...onrender.com/api): " BACKEND_URL

cat > frontend/.env << EOF
VITE_API_URL=$BACKEND_URL
EOF

echo "✓ Frontend .env created"
echo ""

echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Push changes to GitHub:"
echo "   git add ."
echo "   git commit -m 'Add deployment configuration'"
echo "   git push"
echo ""
echo "2. Deploy backend on Render/Railway"
echo "3. Deploy frontend on Vercel"
echo ""
echo "4. Test at your Vercel URL"
echo ""
echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
