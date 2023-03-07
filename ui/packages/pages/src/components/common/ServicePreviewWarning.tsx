import React, { FunctionComponent } from "react";
import { Alert } from "@patternfly/react-core";

/**
 * Properties
 */
export type ServicePreviewWarningProps = Record<string, never>;

export const ServicePreviewWarning: FunctionComponent<ServicePreviewWarningProps> = () => {
    return (
        <Alert isInline variant="warning" title="Service Preview: Data is stored locally in your browser" style={{ marginBottom: "15px" }}>
            <p>
                In the Service Preview release of OpenShift API Designer, all designs are stored locally in your
                browser. Clearing your browser cache or switching to a new browser might result in loss of data.
                Make sure you save your work by downloading your designs locally or by exporting them to a Red Hat
                OpenShift Service Registry instance.
            </p>
        </Alert>
    );
};
