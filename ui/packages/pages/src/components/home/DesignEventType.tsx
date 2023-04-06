import React, { FunctionComponent } from "react";
import { DesignContext, DesignEvent } from "@apicurio/apicurio-api-designer-models";


export type DesignEventTypeProps = {
    event: DesignEvent;
    variant?: "long" | "short";  // Default is "long"
};


export const DesignEventType: FunctionComponent<DesignEventTypeProps> = ({ event, variant }: DesignEventTypeProps) => {
    const typeLabel = (): React.ReactNode => {
        switch (event.type) {
            case "DOWNLOAD":
                return variant === "short" ? <span>File</span> : <span>Downloaded to file system</span>;
            case "CREATE":
                return variant === "short" ? <span>New</span> : <span>Created new design</span>;
            case "IMPORT":
                return importTypeLabel();
            case "UPDATE":
                return variant === "short" ? <span>Edited</span> : <span>Modified using the editor</span>;
            case "REGISTER":
                // eslint-disable-next-line no-case-declarations
                // const context: DesignContext = {
                //     type: "registry",
                //     registry: event.data
                // };
                return variant === "short" ? <span>Service Registry</span> : (
                    <React.Fragment>
                        <span>Exported to Service Registry </span>
                        {/*<RegistryNavLink context={context}>*/}
                        {/*    <span>(</span>*/}
                        {/*    <span>{context.registry?.groupId || "default"}</span>*/}
                        {/*    <span> / </span>*/}
                        {/*    <span>{context.registry?.artifactId}</span>*/}
                        {/*    <span> - </span>*/}
                        {/*    <span>{context.registry?.version || "latest"})</span>*/}
                        {/*</RegistryNavLink>*/}
                    </React.Fragment>
                );
        }
    };

    const importTypeLabel = (): React.ReactNode => {
        if (event.data.import.url) {
            return variant === "short" ? <span>URL</span> : (
                <React.Fragment>
                    <span>Imported from URL: </span>
                    <a href={event.data.import.url}>{event.data.import.url}</a>
                </React.Fragment>
            );
        }
        if (event.data.import.file) {
            return variant === "short" ? <span>File</span> : <span>{`Imported from file ${event.data.import.file}`}</span>;
        }
        if (event.data.import.registry) {
            return variant === "short" ? <span>Service Registry</span> : (
                <React.Fragment>
                    <span>Imported from Service Registry </span>
                    {/*<RegistryNavLink context={context}>*/}
                    {/*    <span>(</span>*/}
                    {/*    <span>{context.registry?.groupId || "default"}</span>*/}
                    {/*    <span> / </span>*/}
                    {/*    <span>{context.registry?.artifactId}</span>*/}
                    {/*    <span> - </span>*/}
                    {/*    <span>{context.registry?.version || "latest"})</span>*/}
                    {/*</RegistryNavLink>*/}
                </React.Fragment>
            );
        }
        return <span>Imported content</span>;
    };

    return (
        <React.Fragment children={typeLabel()} />
    );
};
