const ApiDesignerConfig = {
    "ui": {
        "contextPath": "/",
        "navPrefixPath": ""
    },
    "apis": {
        "designer": "https://designer-api.dev.apicur.io/apis/designer/v0"
    },
    "components": {
        "masthead": {
            "show": true,
            "label": "API Designer"
        },
        "editors": {
            "url": "http://localhost:7070/editors"
        },
        "nav": {
            "show": false,
            "registry": "registry-nav"
        }
    },
    "auth": {
        "type": "oidc",
        "options": {
            "redirectUri": "http://localhost:8888",
            "clientId": "designer-ui",
            "url": "https://sso.dev.apicur.io/realms/apicurio"
        }
    }
};
