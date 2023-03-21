import Keycloak, { KeycloakTokenParsed } from "keycloak-js";
import { ApiDesignerConfigType } from "@app/contexts/config";

const KC_CONFIG_OPTIONS: string[] = ["url", "realm", "clientId"];
const KC_INIT_OPTIONS: string[] = [
    "useNonce",
    "adapter",
    "onLoad",
    "token",
    "refreshToken",
    "idToken",
    "timeSkew",
    "checkLoginIframe",
    "checkLoginIframeInterval",
    "responseMode",
    "redirectUri",
    "silentCheckSsoRedirectUri",
    "silentCheckSsoFallback",
    "flow",
    "pkceMethod",
    "enableLogging",
    "scope",
    "messageReceiveTimeout"
];



const apiDesignerConfig: ApiDesignerConfigType = ApiDesignerConfig || window["ApiDesignerConfig"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function only(items: string[], allOptions: any): any {
    const rval = {};
    items.forEach(item => {
        if (allOptions[item] !== undefined) {
            rval[item] = allOptions[item];
        }
    });
    return rval;
}

export let keycloak: Keycloak | undefined;

/**
 * Get keycloak instance
 *
 * @return an initiated keycloak instance or `undefined`
 * if keycloak isn't configured
 *
 */
export const getKeycloak = async (): Promise<Keycloak | undefined> => {
    if (!keycloak) await init();
    return keycloak;
};

/**
 * Initiate keycloak instance.
 *
 * Set keycloak to undefined if
 * keycloak isn't configured
 *
 */
export const init = async (): Promise<void> => {
    try {
        const configOptions = only(KC_CONFIG_OPTIONS, apiDesignerConfig.auth.options);
        keycloak = new Keycloak(configOptions);
        if (keycloak) {
            const initOptions = only(KC_INIT_OPTIONS, apiDesignerConfig.auth.options);
            await keycloak.init(initOptions);
        }
    } catch {
        keycloak = undefined;
        console.warn(
            "Auth: Unable to initialize keycloak. Client side will not be configured to use authentication"
        );
    }
};

/**
 * Use keycloak update token function to retrieve
 * keycloak token
 *
 * @return keycloak token or empty string if keycloak
 * isn't configured
 *
 */
export const getKeycloakToken = async (): Promise<string> => {
    await keycloak?.updateToken(50);
    if (keycloak?.token) return keycloak.token;
    console.error("No keycloak token available");
    return "foo";
};

/**
 * Use keycloak update token function to retrieve
 * keycloak token
 *
 * @return keycloak token or empty string if keycloak
 * isn't configured
 *
 */
export const getParsedKeycloakToken =
    async (): Promise<KeycloakTokenParsed> => {
        await keycloak?.updateToken(50);
        if (keycloak?.tokenParsed) return keycloak.tokenParsed;
        console.error("No keycloak token available");
        return {} as KeycloakTokenParsed;
    };

/**
 * logout of keycloak, clear cache and offline store then redirect to
 * keycloak login page
 *
 * @param keycloak the keycloak instance
 * @param client offix client
 *
 */
export const logout = async (
    keycloak: Keycloak | undefined
): Promise<void> => {
    if (keycloak) {
        await keycloak.logout();
    }
};
