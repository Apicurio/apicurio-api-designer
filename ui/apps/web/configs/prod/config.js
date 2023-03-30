const ApiDesignerConfig = {
    "apis": {
        "registry": "https://api.openshift.com",
        "designer": "https://api.openshift.com/api/api_designer/v0"
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
            "realm": "redhat-external",
            "auth-server-url": "https://sso.redhat.com/auth/",
            "ssl-required": "all",
            "resource": "cloud-services",
            "client": "apicurio-studio",
            "public-client": true,
            "confidential-port": 0
        }
    }
}
