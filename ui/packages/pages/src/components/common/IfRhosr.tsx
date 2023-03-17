import React, { FunctionComponent, useEffect, useState } from "react";
import { Registry } from "@rhoas/registry-management-sdk";
import { Alert } from "@patternfly/react-core";
import { UserInfo } from "@apicurio/apicurio-api-designer-models";
import { RhosrInstanceServiceFactory, useRhosrInstanceServiceFactory } from "@apicurio/apicurio-api-designer-services";
import { IsLoading } from "@apicurio/apicurio-api-designer-components";

export type RhosrScopeType = "read" | "write" | "admin";


/**
 * Properties
 */
export type IfRhosrProps = {
    registry: Registry | undefined;
    scope: RhosrScopeType;
    onHasAccess?: (accessible: boolean) => void;
    children?: React.ReactNode;
};

/**
 * Wrapper around a set of arbitrary child elements and displays them only if the
 * given registry instance is accessible by the user at the level needed.  This
 * component can be used to guard functionality that will only work if the user
 * has permission to interact with the registry in the required way.
 */
export const IfRhosr: FunctionComponent<IfRhosrProps> = ({ registry, scope, onHasAccess, children }: IfRhosrProps) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfo>();

    const rhosrFactory: RhosrInstanceServiceFactory = useRhosrInstanceServiceFactory();

    const userHasAccess = (info: UserInfo|undefined): boolean => {
        switch (scope) {
            case "read":
                return (info?.viewer||false) || (info?.developer||false) || (info?.admin||false);
            case "write":
                return (info?.developer||false) || (info?.admin||false);
            case "admin":
                return (info?.admin||false);
        }
        return false;
    };

    useEffect(() => {
        setLoading(true);
        if (registry !== undefined) {
            rhosrFactory.createFor(registry).getCurrentUser().then(userInfo => {
                setUserInfo(userInfo);
                if (onHasAccess) {
                    onHasAccess(userHasAccess(userInfo));
                }
                setLoading(false);
            }).catch(error => {
                console.info("[IfRhosr] Error response getting user info for registry instance: ", error);
                setUserInfo({
                    admin: false,
                    developer: false,
                    viewer: false,
                    displayName: "",
                    username: ""
                });
                if (onHasAccess) {
                    onHasAccess(false);
                }
                setLoading(false);
            });
        } else {
            if (onHasAccess) {
                onHasAccess(false);
            }
        }
    }, [registry]);

    return (
        <IsLoading condition={isLoading}>
            {
                userHasAccess(userInfo) ? (
                    <React.Fragment children={children}/>
                ) : (
                    <Alert variant="danger" isInline={true} title="Permission denied (no access)">
                        <p>
                            You do not have sufficient access privileges to Service Registry instance
                            <span style={{ fontWeight: "bold" }}> {registry?.name}</span>.

                            Contact your organization admin or the owner of the Service Registry instance to request the appropriate access.
                        </p>
                    </Alert>
                )
            }
        </IsLoading>
    );
};
