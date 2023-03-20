#!/bin/sh

if [ "x$ADS_UI_URL" = "x" ]
then
  ADS_UI_URL="http://localhost:9009"
fi

if [ "x$SRS_API_URL" = "x" ]
then
  SRS_API_URL="http://localhost:8000"
fi

if [ "x$AUTH_ENABLED" = "x" ]
then
  AUTH_ENABLED="false"
fi

if [ "x$EDITORS_URL" = "x" ]
then
  EDITORS_URL="http://localhost:9011"
fi

if [ "x$NAV_ENABLED" = "x" ]
then
  NAV_ENABLED="false"
fi

if [ "x$NAV_REGISTRY_URL" = "x" ]
then
  NAV_REGISTRY_URL=""
fi



echo "Generating config.js"
echo "const ApiDesignerConfig = {
  \"apis\": {
    \"srs\": \"$SRS_API_URL\"
  },
  \"federatedModules\": {
    \"ads\": \"$ADS_UI_URL\",
    \"editors\": \"$EDITORS_URL\"
  },
  \"auth\": {
    \"enabled\": $AUTH_ENABLED
  },
  \"apps\": {
    \"showNav\": $NAV_ENABLED,
    \"registry\": \"$NAV_REGISTRY_URL\"
  }
}" > /opt/app-root/src/config.js

echo "Generated config.js successfully."
cat /opt/app-root/src/config.js

