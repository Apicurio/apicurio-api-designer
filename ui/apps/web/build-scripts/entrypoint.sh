#!/bin/sh

echo "---------------------------------------------"
echo "Performing the Initial Setup..."
echo "---------------------------------------------"
source /usr/local/bin/create-config.sh

echo "---------------------------------------------"
echo "Setup Complete. Nginx Server Started....."
echo "---------------------------------------------"
source /usr/libexec/s2i/run
