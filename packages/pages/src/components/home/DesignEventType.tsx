import React, { FunctionComponent } from "react";
import { DesignContext, DesignEvent } from "@apicurio/apicurio-api-designer-models";


export type DesignEventTypeProps = {
    event: DesignEvent;
    variant?: "long" | "short";  // Default is "long"
};


export const DesignEventType: FunctionComponent<DesignEventTypeProps> = ({ event, variant }: DesignEventTypeProps) => {
    const typeLabel = (): React.ReactNode => {
        switch (event.type) {
            case "download":
                return variant === "short" ? <span>File</span> : <span>Downloaded to file system</span>;
            case "create":
                return variant === "short" ? <span>New</span> : <span>Created new design</span>;
            case "import":
                return importTypeLabel();
            case "register":
                // eslint-disable-next-line no-case-declarations
                const context: DesignContext = {
                    type: "rhosr",
                    rhosr: event.data
                };
                return variant === "short" ? <span>Service Registry</span> : (
                    <React.Fragment>
                        <span>Exported to Service Registry </span>
                        {/*<RegistryNavLink context={context}>*/}
                        {/*    <span>(</span>*/}
                        {/*    <span>{context.rhosr?.groupId || "default"}</span>*/}
                        {/*    <span> / </span>*/}
                        {/*    <span>{context.rhosr?.artifactId}</span>*/}
                        {/*    <span> - </span>*/}
                        {/*    <span>{context.rhosr?.version || "latest"})</span>*/}
                        {/*</RegistryNavLink>*/}
                    </React.Fragment>
                );
            case "update":
                return variant === "short" ? <span>Edited</span> : <span>Modified using the editor</span>;
        }
    };

    const importTypeLabel = (): React.ReactNode => {
        const context: DesignContext = event.data.context;
        switch (context.type) {
            case "file":
                return variant === "short" ? <span>File</span> : <span>{`Imported from file ${context.file?.fileName}`}</span>;
            case "rhosr":
                return variant === "short" ? <span>Service Registry</span> : (
                    <React.Fragment>
                        <span>Imported from Service Registry </span>
                        {/*<RegistryNavLink context={context}>*/}
                        {/*    <span>(</span>*/}
                        {/*    <span>{context.rhosr?.groupId || "default"}</span>*/}
                        {/*    <span> / </span>*/}
                        {/*    <span>{context.rhosr?.artifactId}</span>*/}
                        {/*    <span> - </span>*/}
                        {/*    <span>{context.rhosr?.version || "latest"})</span>*/}
                        {/*</RegistryNavLink>*/}
                    </React.Fragment>
                );
            case "url":
                return variant === "short" ? <span>URL</span> : (
                    <React.Fragment>
                        <span>Imported from URL: </span>
                        <a href={context.url?.url}>{context.url?.url}</a>
                    </React.Fragment>
                );
        }
        return <span>Imported content</span>;
    };

    return (
        <React.Fragment children={typeLabel()} />
    );
};
