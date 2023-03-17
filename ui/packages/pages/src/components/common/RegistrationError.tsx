import React, { FunctionComponent } from "react";
import { Alert, AlertActionLink, CodeBlock, CodeBlockCode } from "@patternfly/react-core";
import { Design } from "@apicurio/apicurio-api-designer-models";


export type RegistrationErrorProps = {
    design: Design;
    error: any;
    onTryAgain: () => void;
    onCancel: () => void;
};

export const RegistrationError: FunctionComponent<RegistrationErrorProps> = ({ design, error, onTryAgain, onCancel }: RegistrationErrorProps) => {
    return (
        <Alert variant="danger"
            isInline={true}
            actionLinks={
                <React.Fragment>
                    <AlertActionLink onClick={onTryAgain}>Try again</AlertActionLink>
                    <AlertActionLink onClick={onCancel}>Cancel export</AlertActionLink>
                </React.Fragment>
            }
            title={`Error exporting '${design.name}' to service registry`}>
            <CodeBlock style={{ marginTop: "15px", marginBottom: "15px" }}>
                <CodeBlockCode id="code-content">{JSON.stringify(error, null, 4)}</CodeBlockCode>
            </CodeBlock>
        </Alert>
    );

};
