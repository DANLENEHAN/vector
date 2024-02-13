#!/bin/bash

# Check if an argument was provided
if [ $# -eq 0 ]; then
  echo "No arguments provided. Usage: $0 [true|false]"
  exit 1
fi

# The first argument is the desired state of storybookEnabled
DESIRED_STATE=$1

# Path to your app.config.js
CONFIG_FILE="./app.config.js"

# Validate the argument
if [ "$DESIRED_STATE" != "true" ] && [ "$DESIRED_STATE" != "false" ]; then
  echo "Invalid argument: $DESIRED_STATE. Use 'true' or 'false'."
  exit 1
fi

# Update the app.config.js file
if [ "$DESIRED_STATE" == "true" ]; then
  sed -i '' 's/storybookEnabled: false/storybookEnabled: true/' "$CONFIG_FILE"
  echo "Storybook enabled."
else
  sed -i '' 's/storybookEnabled: true/storybookEnabled: false/' "$CONFIG_FILE"
  echo "Storybook disabled."
fi
