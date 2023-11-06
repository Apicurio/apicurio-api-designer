import React, { FunctionComponent, useEffect, useState } from "react";
import { EmptyState, EmptyStateBody, EmptyStateHeader, EmptyStateIcon, Spinner } from "@patternfly/react-core";
import { ErrorCircleOIcon } from "@patternfly/react-icons";
import { If } from "@app/components";
import { getOidc } from "@app/auth";
import { ApiDesignerConfigType, useApiDesignerConfig } from "@app/contexts/config.ts";

enum AuthState {
    AUTHENTICATING, AUTHENTICATED, AUTHENTICATION_FAILED
}

/**
 * Properties
 */
export type OidcAuthProps = {
    children: React.ReactNode;
};

/**
 * Protect the application with OIDC authentication.
 */
export const ApplicationAuth: FunctionComponent<OidcAuthProps> = (props: OidcAuthProps) => {
    const [authState, setAuthState] = useState(AuthState.AUTHENTICATING);
    const config: ApiDesignerConfigType | undefined = useApiDesignerConfig();

    useEffect(() => {
        if (config?.auth.type === "oidc") {
            getOidc().then(() => {
                console.info("[ApplicationAuth] Authentication successful.");
                setAuthState(AuthState.AUTHENTICATED);
            }).catch(error => {
                // TODO display the auth error
                console.error("[ApplicationAuth] Authentication failed: ", error);
                setAuthState(AuthState.AUTHENTICATION_FAILED);
            });
        } else {
            setAuthState(AuthState.AUTHENTICATED);
        }
    }, []);

    return (
        <>
            <If condition={authState === AuthState.AUTHENTICATING}>
                <EmptyState>
                    <EmptyStateHeader titleText="Loading" headingLevel="h4" />
                    <EmptyStateBody>
                        <Spinner size="xl" aria-label="Loading spinner" />
                    </EmptyStateBody>
                </EmptyState>
            </If>
            <If condition={authState === AuthState.AUTHENTICATION_FAILED}>
                <EmptyState>
                    <EmptyStateHeader titleText="Empty state" headingLevel="h4" icon={<EmptyStateIcon icon={ErrorCircleOIcon} />} />
                    <EmptyStateBody>
                        Authentication failed.
                    </EmptyStateBody>
                </EmptyState>
            </If>
            <If condition={authState === AuthState.AUTHENTICATED} children={props.children} />
        </>
    );
};
