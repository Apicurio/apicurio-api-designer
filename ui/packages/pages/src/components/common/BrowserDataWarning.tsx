import React, { FunctionComponent } from "react";
import { Alert } from "@patternfly/react-core";
import { PageConfig, usePageConfig } from "../../context/PageConfigContext";

/**
 * Properties
 */
export type BrowserWarningProps = Record<string, never>;

export const BrowserDataWarning: FunctionComponent<BrowserWarningProps> = () => {
    const pageConfig: PageConfig = usePageConfig();

    return pageConfig.serviceConfig.designs.type === "browser" ? (
        <Alert isInline variant="warning" title="Warning: Data is stored locally in your browser" style={{ marginBottom: "15px" }}>
            <p>
                In this version of API Designer, all designs are stored locally in your browser. Clearing your browser
                cache or switching to a new browser might result in loss of data. Make sure you save your work by
                downloading your designs locally or by exporting them to another system (e.g. Apicurio Registry).
            </p>
        </Alert>
    ) : ( <></> );
};
