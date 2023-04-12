const ApiDesignerConfig = {
    "ui" : {
        "contextPath" : "/ui/",
        "navPrefixPath" : ""
    },
    "apis" : {
        "registry" : "registry-api-url",
        "designer" : "http://localhost:8080/apis/designer/v0"
    },
    "components" : {
        "masthead" : {
            "show" : true,
            "label" : "API Designer"
        },
        "editors" : {
            "url" : "http://localhost:7070/editors"
        },
        "nav" : {
            "show" : false,
            "registry" : "registry-nav"
        }
    },
    "auth" : {
        "type" : "oidc",
        "options" : {
            "redirectUri" : "http://localhost:7070/ui/",
            "clientId" : "apicurio-studio",
            "url" : "https://auth.apicur.io/auth/realms/apicurio-local"
        }
    }
};
