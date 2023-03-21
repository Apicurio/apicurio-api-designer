#!/bin/sh

if [ "x$BASENAME" = "x" ]
then
  BASENAME="/"
fi

if [ "x$REGISTRY_API_URL" = "x" ]
then
  REGISTRY_API_URL="http://localhost:8090"
fi

if [ "x$AUTH_TYPE" = "x" ]
then
  AUTH_TYPE="none"
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

if [ "x$KEYCLOAK_REALM" = "x" ]
then
  KEYCLOAK_REALM="operate-first-apicurio"
fi
if [ "x$KEYCLOAK_URL" = "x" ]
then
  KEYCLOAK_URL="https://auth.apicur.io/auth/"
fi
if [ "x$KEYCLOAK_SSL_REQUIRED" = "x" ]
then
  KEYCLOAK_SSL_REQUIRED="external"
fi
if [ "x$KEYCLOAK_RESOURCE" = "x" ]
then
  KEYCLOAK_RESOURCE="ad-ui"
fi


echo "Generating config.js"

echo "const ApiDesignerConfig = {
    \"apis\": {
        \"registry\": \"$REGISTRY_API_URL\"
    },
    \"ui\": {
        \"basename\": \"$BASENAME\"
    },
    \"components\": {
        \"editors\": {
            \"url\": \"$EDITORS_URL\"
        },
        \"nav\": {
            \"show\": $NAV_ENABLED,
            \"registry\": \"$NAV_REGISTRY_URL\"
        }
    },
    \"auth\": {
        \"type\": \"$AUTH_TYPE\",
        \"options\": {
          \"realm\": \"$KEYCLOAK_REALM\",
          \"auth-server-url\": \"$KEYCLOAK_URL\",
          \"ssl-required\": \"$KEYCLOAK_SSL_REQUIRED\",
          \"resource\": \"$KEYCLOAK_RESOURCE\",
          \"public-client\": true,
          \"confidential-port\": 0
        }
    }
}
" > /opt/app-root/src/config.js


echo "Generated config.js successfully."
cat /opt/app-root/src/config.js

