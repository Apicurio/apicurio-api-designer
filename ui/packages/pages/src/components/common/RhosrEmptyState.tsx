import React, { FunctionComponent } from "react";
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title } from "@patternfly/react-core";
import { AddCircleOIcon } from "@patternfly/react-icons";

/**
 * Properties
 */
export type RhosrEmptyStateProps  = {
    message: string;
};


export const RhosrEmptyState: FunctionComponent<RhosrEmptyStateProps> = ({ message }) => {
    return (
        <EmptyState>
            <EmptyStateIcon icon={AddCircleOIcon} />
            <Title headingLevel="h4" size="lg">
                No Service Registry instances
            </Title>
            <EmptyStateBody>
                { message }
            </EmptyStateBody>
            <a href="/application-services/service-registry">Create Service Registry instance</a>
        </EmptyState>
    );
};
