#!/bin/bash

# Personal Portfolio Website Setup Script
# This script helps you quickly set up your personal data from the examples

set -e

echo "🚀 Setting up your Personal Portfolio Website..."
echo

# Check if data directory exists
if [ ! -d "data" ]; then
    mkdir data
fi

# Copy example files to data directory
echo "📋 Copying example files to data directory..."
for file in data.example/*.example.*; do
    if [ -f "$file" ]; then
        # Get the filename without .example
        filename=$(basename "$file")
        newname=${filename/.example/}
        
        # Only copy if the target doesn't exist
        if [ ! -f "data/$newname" ]; then
            cp "$file" "data/$newname"
            echo "   ✓ Created data/$newname"
        else
            echo "   ⚠ data/$newname already exists, skipping"
        fi
    fi
done

echo

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating .env.local file..."
    cp .env.example .env.local
    echo "   ✓ Created .env.local from example"
    echo "   💡 Add your OpenAI API key to .env.local for chat functionality"
else
    echo "⚠ .env.local already exists, skipping"
fi

echo

# Install dependencies
echo "📦 Installing dependencies..."
if command -v bun &> /dev/null; then
    echo "   Using Bun..."
    bun install
elif command -v npm &> /dev/null; then
    echo "   Using npm..."
    npm install
else
    echo "   ❌ Neither npm nor bun found. Please install Node.js or Bun first."
    exit 1
fi

echo
echo "Setup complete! ✅"
echo
echo "Next steps:"
echo "   1. Edit the files in the 'data/' folder with your information"
echo "   2. Set up environment variables in .env.local:"
echo "      OPENAI_API_KEY=your-key-here"
echo "      SITE_URL=https://yourwebsite.com"
echo "      ENABLE_CORS=true (set to false for development if needed)"
echo "      ALLOWED_ORIGINS=https://yourwebsite.com (optional, comma-separated)"
echo "   3. Run 'npm run dev' or 'bun dev' to start developing"
echo "   4. Visit http://localhost:3000 to see your site"
echo
echo "Need help? Check out:"
echo "   - README.md for full documentation"
echo "   - data.example/README.example.md for data structure guide"
