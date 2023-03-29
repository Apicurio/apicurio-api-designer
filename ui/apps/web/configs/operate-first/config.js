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
        "type": "oidc",
        "options": {
            "url": "https://auth.apicur.io/auth/realms/operate-first-apicurio",
            "clientId": "ad-ui",
            "redirectUri": "http://localhost:8080",
        }
    }
}
