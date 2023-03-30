const ApiDesignerConfig = {
    "apis": {
        "registry": "https://fleet-manager-mt-apicurio-apicurio-registry.apps.smaug.na.operate-first.cloud",
        "designer": "TBD"
    },
    "ui": {
        "contextPath": "/",
        "navPrefixPath": ""
    },
    "components": {
        "masthead": {
            "show": true,
            "label": "APPLICATIONS"
        },
        "editors": {
            "url": "http://localhost:9011"
        },
        "nav": {
            "show": true,
            "registry": "https://apicurio-registry-mt-ui-mt-apicurio-apicurio-registry.apps.smaug.na.operate-first.cloud/"
        }
    },
    "auth": {
        "type": "keycloakjs",
        "options": {
            "realm": "operate-first-apicurio",
            "url": "https://auth.apicur.io/auth",
            "clientId": "ad-ui",
            "public-client": true,
            "enable-cors": true,
            "cors-max-age" : 1000,
            "cors-allowed-methods" : "POST, PUT, DELETE, GET",
            "cors-exposed-headers" : "WWW-Authenticate",
            "onLoad": "login-required",
            "checkLoginIframe": false
        }
    }
}
