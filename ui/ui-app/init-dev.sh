#!/bin/sh

echo "----"
echo "Initializing development environment for UI-only development."
echo "----"

CONFIG_TYPE=$1

if [ "x$CONFIG_TYPE" = "x" ]
then
  CONFIG_TYPE="none"
fi

cp configs/$CONFIG_TYPE/config.js config.js

echo "Done.  Try:  'npm run dev'"
