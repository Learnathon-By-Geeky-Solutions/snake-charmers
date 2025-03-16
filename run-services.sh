#!/bin/bash

# Define services to start
services=(
  "auth-service"
  "location-service"
  "trip-service"
  "ambulance-finder-service"
  "frontend"
)

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting all microservices...${NC}"

# Start all services in the background
for service in "${services[@]}"; do
  if [[ "$service" == "frontend" ]]; then
    echo -e "${GREEN}Starting $service...${NC}"
    docker compose -f $service/docker-compose.yml up --build $service &
  else
    echo -e "${GREEN}Starting $service...${NC}"
    docker compose -f $service/docker-compose.dev.yml up --build $service &
  fi
  # Small delay to avoid overwhelming system resources
  sleep 2
done

# Start coordinator service with air
echo -e "${GREEN}Starting coordinator-service with air...${NC}"
cd coordinator-service/cmd && air &

echo -e "${BLUE}All services started in background.${NC}"
echo -e "${BLUE}Use 'docker ps' to check running containers.${NC}"

# Keep script running so user can see output from all services
echo -e "${BLUE}Press Ctrl+C to stop all services.${NC}"
wait