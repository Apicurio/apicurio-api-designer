import { getKeycloakToken, getParsedKeycloakToken, } from "@app/auth/keycloak/keycloakAuth";
import { ApiDesignerConfigType, useApiDesignerConfig } from "@app/contexts/config";
import { AuthConfig } from "@apicurio/apicurio-api-designer-services";

/**
 * React hook to get the URL service.
 */
export const useKeycloakAuth: () => AuthConfig = (): AuthConfig => {
    const apiDesignerConfig: ApiDesignerConfigType | undefined = useApiDesignerConfig();
    if (apiDesignerConfig?.auth.type === "keycloakjs") {
        return {
            getToken: getKeycloakToken,
            getUsername: () => {
                return getParsedKeycloakToken().then(
                        (token) => (token as Record<string, string>)["username"]
                );
            }
        };
    } else {
        return {
            getToken: () => Promise.resolve(""),
            getUsername: () => Promise.resolve("local-user")
        };
    }
};
