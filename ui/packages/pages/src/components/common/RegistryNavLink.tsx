import React, { FunctionComponent, useEffect, useState } from "react";
import { Registry } from "@rhoas/registry-management-sdk";
import { RegistryArtifactCoordinates } from "@apicurio/apicurio-api-designer-models";
import { RhosrService, useRhosrService } from "@apicurio/apicurio-api-designer-services";
import { stripTrailingSlash } from "@apicurio/apicurio-api-designer-utils";

/**
 * Properties
 */
export type RegistryNavLinkProps = {
    registry?: Registry;
    coordinates: RegistryArtifactCoordinates | undefined;
    children?: React.ReactNode;
};

/**
 * A navigation link to an artifact in a service registry instance.  The context passed to this
 * component must be of type "registry".
 */
export const RegistryNavLink: FunctionComponent<RegistryNavLinkProps> = ({ registry, coordinates, children }: RegistryNavLinkProps) => {
    const [href, setHref] = useState<string>();

    const rhosr: RhosrService | undefined = registry === undefined ? useRhosrService() : undefined;

    const setHrefFrom = (registry: Registry, coordinates: RegistryArtifactCoordinates): void => {
        const group: string = coordinates?.groupId || "default";
        const id: string = coordinates?.artifactId || "unknown";
        setHref(`${stripTrailingSlash(registry.browserUrl)}/artifacts/${group}/${id}`);
    };

    useEffect(() => {
        setHref(undefined);
        if (coordinates) {
            if (registry) {
                setHrefFrom(registry, coordinates);
            } else {
                rhosr.getRegistry(coordinates.instanceId).then(registry => {
                    setHrefFrom(registry, coordinates);
                });
            }
        }
    }, [coordinates]);

    return (
        href ? <a href={href} children={children as any} /> : <span children={children as any} />
    );
};
