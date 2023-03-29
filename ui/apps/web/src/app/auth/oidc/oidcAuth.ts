import { User, UserManager, UserManagerSettings } from "oidc-client-ts";
import { ApiDesignerConfigType } from "@app/contexts/config";

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

/**
 * get client configuration settings
 */
export const getClientSettings: (() => UserManagerSettings) = () => {
    const configOptions: any = only(OIDC_CONFIG_OPTIONS, apiDesignerConfig.auth.options);

    return {
        authority: configOptions.url,
        client_id: configOptions.clientId,
        redirect_uri: configOptions.redirectUri,
        response_type: "code",
        scope: "openid profile email",
        filterProtocolClaims: true,
        loadUserInfo: true
    };
};

export let userManager: UserManager = new UserManager(getClientSettings());
export let user: AuthenticatedUser | undefined;
export let oidcUser: User | undefined;

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
        let currentUser = await userManager.getUser();
        if (url.searchParams.get("state") || currentUser) {
            await userManager.signinRedirectCallback().then(user => {
                oidcUser = user;
                userManager.startSilentRenew();
            });
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
    return oidcUser.id_token;
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
        return user.username;
    };

/**
 * logout of oidc, clear cache and offline store then redirect to
 * oidc login page
 *
 * @param oidc the oidc instance
 * @param client offix client
 *
 */
export const logout = async (
    userManager: UserManager | undefined
): Promise<void> => {
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

export const doLogin = async () => {
    await userManager.signinRedirect()
        .then(() => {
            userManager.signinRedirectCallback()
                .then(user => {
                oidcUser = user;
            });
        }).catch(reason => {
        console.log(reason);
    });
}