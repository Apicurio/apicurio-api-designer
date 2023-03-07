import React, { FunctionComponent } from "react";
import { Truncate } from "@patternfly/react-core";
import styled from "styled-components";

/**
 * Properties
 */
export type DesignDescriptionProps = {
    description: string | undefined;
    truncate?: boolean;
    className?: string;
}

const StyledTruncate = styled(Truncate)`
    color: ${props => props.className?.indexOf("no-description") != -1 ? "var(--pf-global--Color--200)" : "inherit"};
`;

export const DesignDescription: FunctionComponent<DesignDescriptionProps> = ({ description, truncate, className }: DesignDescriptionProps) => {
    let classes: string = "";
    if (className) {
        classes = className;
    }
    if (!description) {
        classes = classes + " no-description";
    }
    return truncate ? (
        <div>
            <StyledTruncate className={classes} content={description || "No description."} tooltipPosition="top" />
        </div>
    ) : (
        <div className={classes}>{description || "No description."}</div>
    );
};
