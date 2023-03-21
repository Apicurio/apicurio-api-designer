const ApiDesignerConfig = {
    "apis": {
        "registry": "https://api.openshift.com"
    },
    "ui": {
        "basename": "/"
    },
    "components": {
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
