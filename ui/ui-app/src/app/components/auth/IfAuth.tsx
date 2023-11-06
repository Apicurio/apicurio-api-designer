import React, { FunctionComponent } from "react";
import { ApiDesignerConfigType, useApiDesignerConfig } from "@app/contexts/config.ts";

/**
 * Properties
 */
export type IfAuthProps = {
    enabled?: boolean;
    children?: React.ReactNode;
};

/**
 * Wrapper around a set of arbitrary child elements and displays them only if the
 * indicated authentication parameters are true.
 */
export const IfAuth: FunctionComponent<IfAuthProps> = (props: IfAuthProps) => {
    const config: ApiDesignerConfigType | undefined = useApiDesignerConfig();

    const accept = () => {
        let rval: boolean = true;
        if (props.enabled !== undefined) {
            rval = rval && (config?.auth.type === "oidc");
        }
        return rval;
    };

    if (accept()) {
        return <React.Fragment children={props.children} />;
    } else {
        return <React.Fragment />;
    }

};
