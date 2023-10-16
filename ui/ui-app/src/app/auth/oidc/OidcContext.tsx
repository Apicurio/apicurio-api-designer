import { getOidcToken, getUsername } from "@app/auth/oidc/oidcAuth";
import { ApiDesignerConfigType, useApiDesignerConfig } from "@app/contexts/config";
import { AuthConfig } from "@services/ServiceConfigContext.tsx";

/**
 * React hook to get the URL service.
 */
export const useOidcAuth: () => AuthConfig = (): AuthConfig => {
    const apiDesignerConfig: ApiDesignerConfigType | undefined = useApiDesignerConfig();
    if (apiDesignerConfig?.auth.type === "oidc") {
        return {
            getToken: getOidcToken,
            getUsername: getUsername
        };
    } else {
        return {
            getToken: () => Promise.resolve(""),
            getUsername: () => Promise.resolve("local-user")
        };
    }
};
