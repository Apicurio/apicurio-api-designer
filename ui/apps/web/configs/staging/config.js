const ApiDesignerConfig = {
    "apis": {
        "registry": "https://api.stage.openshift.com",
        "designer": "https://api.stage.openshift.com/api/api_designer/v0"
    },
    "ui": {
        "contextPath": "/",
        "navPrefixPath": ""
    },
    "components": {
        "masthead": {
            "show": true,
            "label": "API DESIGNER"
        },
        "editors": {
            "url": "http://localhost:9011"
        },
        "nav": {
            "show": false
        }
    },
    "auth": {
        "type": "keycloakjs",
        "options": {
            "auth-server-url": "https://sso.redhat.com/auth/realms/redhat-external",
            "clientId": "apicurio-studio",
            "redirectUri": "http://localhost:8080"
        }
    }
}
