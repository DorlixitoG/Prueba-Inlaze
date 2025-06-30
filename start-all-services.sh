#!/bin/bash

echo "Starting Task Management Microservices..."

# Function to start a service in a new terminal
start_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    
    echo "Starting $service_name on port $port..."
    
    # For macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "tell application \"Terminal\" to do script \"cd $(pwd)/$service_path && npm run start:dev\""
    # For Linux with gnome-terminal
    elif command -v gnome-terminal &> /dev/null; then
        gnome-terminal --tab --title="$service_name" -- bash -c "cd $service_path && npm run start:dev; exec bash"
    # For Windows with Git Bash
    elif [[ "$OSTYPE" == "msys" ]]; then
        start "cmd" /k "cd $service_path && npm run start:dev"
    else
        echo "Please start $service_name manually: cd $service_path && npm run start:dev"
    fi
    
    sleep 2
}

# Start all services
start_service "Auth Service" "auth-service" "3001"
start_service "Projects Service" "projects-service" "3002"
start_service "Tasks Service" "tasks-service" "3003"
start_service "Comments Service" "comments-service" "3004"
start_service "Notifications Service" "notifications-service" "3005"
start_service "API Gateway" "api-gateway" "4000"
start_service "Frontend" "frontend" "3000"

echo "All services are starting..."
echo "Frontend will be available at: http://localhost:3000"
echo "API Gateway will be available at: http://localhost:4000"
echo ""
echo "Services running on:"
echo "- Auth Service: http://localhost:3001"
echo "- Projects Service: http://localhost:3002"
echo "- Tasks Service: http://localhost:3003"
echo "- Comments Service: http://localhost:3004"
echo "- Notifications Service: http://localhost:3005"
