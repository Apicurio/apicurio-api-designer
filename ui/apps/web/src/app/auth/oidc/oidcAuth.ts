import { UserManager } from "oidc-client-ts";
import { ApiDesignerConfigType, useApiDesignerConfig } from "@app/contexts/config";

const OIDC_CONFIG_OPTIONS: string[] = ["url", "clientId", "redirectUri"];

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

export const initUserManager: (() => UserManager) = () => {
    if (apiDesignerConfig?.auth.type === "oidc") {
        const configOptions: any = only(OIDC_CONFIG_OPTIONS, apiDesignerConfig.auth.options);

        return new UserManager({
            authority: configOptions.url,
            client_id: configOptions.clientId,
            redirect_uri: configOptions.redirectUri,
            response_type: "code",
            scope: "openid profile email",
            filterProtocolClaims: true,
            loadUserInfo: true
        });
    } else {
        return undefined;
    }
};

export const userManager: UserManager = initUserManager()

export interface AuthenticatedUser {
    username: string;
    displayName: string;
    fullName: string;
    roles?: any;
}

/**
 * Get oidc instance
 *
 * @return an initiated oidc instance or `undefined`
 * if oidc isn't configured
 *
 */
export const getOidc = async (): Promise<UserManager | undefined> => {
    await init();
    return userManager;
};

/**
 * Initiate oidc auth instance.
 *
 * Set oidc auth to undefined if
 * oidc auth isn't configured
 *
 */
export const init = async (): Promise<void> => {
    try {
        const url = new URL(window.location.href);
        const currentUser = await userManager.getUser();
        if (url.searchParams.get("state") || currentUser) {
            await userManager.signinRedirectCallback();
        } else {
            await doLogin();
        }
    } catch {
        console.warn(
            "Auth: Unable to initialize authentication. Client side will not be configured to use authentication"
        );
    }
};

/**
 * Use oidc update token function to retrieve
 * oidc token
 *
 * @return oidc token or empty string if oidc
 * isn't configured
 *
 */
export const getOidcToken = async (): Promise<string> => {
    const user = await userManager.getUser();
    return user.id_token;
};

/**
 * Use oidc update token function to retrieve
 * oidc token
 *
 * @return oidc token or empty string if oidc
 * isn't configured
 *
 */
export const getUsername =
    async (): Promise<string> => {
    const user = await userManager.getUser();
        return user.profile.preferred_username
    };

/**
 * logout of oidc, clear cache and offline store then redirect to
 * oidc login page
 *
 * @param oidc the oidc instance
 * @param client offix client
 *
 */
export const getLogout = async (): Promise<void> => {
    if (userManager) {
        await userManager.removeUser()
        await userManager.signoutRedirect({ post_logout_redirect_uri: window.location.href });
    }
};

export const fakeUser: (() => AuthenticatedUser) = () => {
    return {
        displayName: "User",
        fullName: "User",
        roles: [],
        username: "User"
    };
}

export const isAuthenticated = async (): Promise<boolean> => {
    return await userManager.getUser() != null;
}

export const doLogin = async () => {
    await userManager.signinRedirect()
        .then(() => {
            userManager.startSilentRenew();
            userManager.signinRedirectCallback()
        }).catch(reason => {
            console.log(reason);
        });
}