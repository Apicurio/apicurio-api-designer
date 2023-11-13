const ApiDesignerConfig = {
    "ui": {
        "contextPath": "/",
        "navPrefixPath": ""
    },
    "apis": {
        "designer": "https://apicurio-designer-api-rhaf-apicurio.apps.dev-eng-ocp4-mas.dev.3sca.net/apis/designer/v0"
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
            "url": "https://keycloak-rhaf-apicurio.apps.dev-eng-ocp4-mas.dev.3sca.net/realms/apicurio"
        }
    }
};
