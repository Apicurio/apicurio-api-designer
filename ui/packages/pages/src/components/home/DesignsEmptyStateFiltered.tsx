import React, { FunctionComponent } from "react";
import {
    Bullseye,
    Button,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateVariant,
    Title
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

/**
 * Properties
 */
export type DesignsEmptyStateFilteredProps = {
    onClear: () => void;
};

/**
 * The empty state UI shown to the user when no designs are available, either due to
 * filtering or because no designs have been created yet.
 */
export const DesignsEmptyStateFiltered: FunctionComponent<DesignsEmptyStateFilteredProps> = ({ onClear }: DesignsEmptyStateFilteredProps) => {
    return (
        <Bullseye style={{ backgroundColor: "white" }}>
            <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={SearchIcon} />
                <Title headingLevel="h2" size="lg">
                    No matching designs
                </Title>
                <EmptyStateBody>Adjust your filters and try again.</EmptyStateBody>
                <Button variant="link" onClick={onClear}>Clear all filters</Button>
            </EmptyState>
        </Bullseye>
    );
};
