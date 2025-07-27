#!/bin/bash

# Build script for Email Campaign Manager with Nodemailer
# This script prepares the application for production deployment

echo "Building Email Campaign Manager..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file from example if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env file from template. Please configure your email settings."
fi

# Check if environment variables are set for production
if [ "$NODE_ENV" = "production" ]; then
    echo "Production mode detected"
    
    # Validate required environment variables
    if [ -z "$EMAIL_SERVICE" ] || [ -z "$EMAIL_USER" ] || [ -z "$EMAIL_PASS" ]; then
        echo "⚠️  Warning: Email configuration not complete"
        echo "Set these environment variables:"
        echo "  EMAIL_SERVICE (gmail, outlook, yahoo, or custom)"
        echo "  EMAIL_USER (your email address)"
        echo "  EMAIL_PASS (your app password)"
    else
        echo "✅ Email configuration found"
    fi
fi

echo "Build completed successfully!"
echo "To start the server, run: npm start"
echo "The application will be available at http://localhost:3000"
