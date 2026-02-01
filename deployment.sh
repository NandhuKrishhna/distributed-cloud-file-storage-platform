#!/bin/bash

# Log start
echo "CI/CD Pipeline Started"

# Pull changes
echo "Pulling the latest changes from git..."
git pull

# Install dependencies (Recommended to ensure new packages are installed)
# echo "Installing dependencies..."
# npm install

# Restart the server
# IMPORTANT: This command restarts the Node.js process running this script.
# Once 'pm2 restart' executes, this parent process will terminate.
# No further output from this script will be captured by the webhook logs
# because the listener (the server) has effectively killed itself.
echo "Restarting the server (Logs will end here)..."
pm2 restart 0
