#!/bin/sh

if [ "x$CONTEXT_PATH" = "x" ]
then
  CONTEXT_PATH="/"
fi

if [ "x$NAV_PREFIX_PATH" = "x" ]
then
  NAV_PREFIX_PATH=""
fi

if [ "x$REGISTRY_API_URL" = "x" ]
then
  REGISTRY_API_URL="http://localhost:8090"
fi

if [ "x$DESIGNER_API_URL" = "x" ]
then
  DESIGNER_API_URL="http://localhost:8080/apis/designer/v0"
fi

if [ "x$EDITORS_URL" = "x" ]
then
  EDITORS_URL="/editors"
fi

if [ "x$SHOW_NAVIGATION" = "x" ]
then
  SHOW_NAVIGATION="false"
fi

if [ "x$REGISTRY_NAVIGATION_URL" = "x" ]
then
  REGISTRY_NAVIGATION_URL=""
fi

if [ "x$SHOW_MASTHEAD" = "x" ]
then
  SHOW_MASTHEAD="true"
fi

if [ "x$MASTHEAD_LABEL" = "x" ]
then
  MASTHEAD_LABEL="API Designer"
fi

if [ "x$AUTH_TYPE" = "x" ]
then
  AUTH_TYPE="none"
fi

if [ "x$AUTH_REDIRECT_URI" = "x" ]
then
  AUTH_REDIRECT_URI="/"
fi
if [ "x$AUTH_CLIENT_ID" = "x" ]
then
  AUTH_CLIENT_ID="apicurio-api-designer"
fi
if [ "x$AUTH_URL" = "x" ]
then
  AUTH_URL="https://auth.apicur.io/auth/realms/apicurio"
fi


echo "Generating config.js"


echo "const ApiDesignerConfig = {
    \"ui\" : {
        \"contextPath\" : \"$CONTEXT_PATH\",
        \"navPrefixPath\" : \"$NAV_PREFIX_PATH\"
    },
    \"apis\" : {
        \"registry\" : \"$REGISTRY_API_URL\",
        \"designer\" : \"$DESIGNER_API_URL\"
    },
    \"components\" : {
        \"masthead\" : {
            \"show\" : $SHOW_MASTHEAD,
            \"label\" : \"$MASTHEAD_LABEL\"
        },
        \"editors\" : {
            \"url\" : \"$EDITORS_URL\"
        },
        \"nav\" : {
            \"show\" : $SHOW_NAVIGATION,
            \"registry\" : \"$REGISTRY_NAVIGATION_URL\"
        }
    },
    \"auth\" : {
        \"type\" : \"$AUTH_TYPE\",
        \"options\" : {
            \"redirectUri\" : \"$AUTH_REDIRECT_URI\",
            \"clientId\" : \"$AUTH_CLIENT_ID\",
            \"url\" : \"$AUTH_URL\"
        }
    }
};
" > /opt/app-root/src/config.js


echo "Generated config.js successfully."
cat /opt/app-root/src/config.js

