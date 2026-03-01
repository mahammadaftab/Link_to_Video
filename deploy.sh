#!/bin/bash

# Deployment script for Universal Video Generator

echo "🚀 Starting deployment of Universal Video Generator..."

# Function to deploy backend
deploy_backend() {
    echo "📦 Building backend..."
    cd backend
    
    # Install dependencies
    npm install
    
    # Build backend (if needed)
    # npm run build
    
    echo "✅ Backend deployed!"
    cd ..
}

# Function to deploy frontend
deploy_frontend() {
    echo "📱 Building frontend..."
    cd frontend
    
    # Install dependencies
    npm install
    
    # Build frontend
    npm run build
    
    echo "✅ Frontend deployed!"
    cd ..
}

# Function to deploy to Render (backend)
deploy_render() {
    echo "☁️ Deploying backend to Render..."
    
    # Check if render-cli is installed
    if ! command -v render &> /dev/null; then
        echo "❌ render-cli not found. Please install it first:"
        echo "   npm install -g render-cli"
        exit 1
    fi
    
    # Deploy backend to Render
    render deploy --serviceId <YOUR_BACKEND_SERVICE_ID> --notify
}

# Function to deploy to Vercel (frontend)
deploy_vercel() {
    echo "☁️ Deploying frontend to Vercel..."
    
    # Check if vercel-cli is installed
    if ! command -v vercel &> /dev/null; then
        echo "❌ vercel-cli not found. Please install it first:"
        echo "   npm install -g vercel-cli"
        exit 1
    fi
    
    # Deploy frontend to Vercel
    vercel --prod --token <YOUR_VERCEL_TOKEN>
}

# Main deployment process
case "$1" in
    "backend")
        deploy_backend
        ;;
    "frontend")
        deploy_frontend
        ;;
    "full")
        deploy_backend
        deploy_frontend
        ;;
    "render")
        deploy_render
        ;;
    "vercel")
        deploy_vercel
        ;;
    "all")
        deploy_backend
        deploy_frontend
        deploy_render
        deploy_vercel
        ;;
    *)
        echo "Usage: $0 {backend|frontend|full|render|vercel|all}"
        echo ""
        echo "Commands:"
        echo "  backend  - Build and deploy only the backend"
        echo "  frontend - Build and deploy only the frontend"
        echo "  full     - Build and deploy both backend and frontend locally"
        echo "  render   - Deploy backend to Render"
        echo "  vercel   - Deploy frontend to Vercel"
        echo "  all      - Deploy everything to all platforms"
        exit 1
        ;;
esac

echo "🎉 Deployment completed successfully!"