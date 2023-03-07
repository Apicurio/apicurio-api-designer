import React, { FunctionComponent } from "react";
import { Truncate } from "@patternfly/react-core";
import styled from "styled-components";

const StyledTruncate = styled(Truncate)`
    color: ${props => props.content == "No description." ? "var(--pf-global--Color--200)" : "inherit"};
`;

/**
 * Properties
 */
export type DescriptionProps = {
    description: string | undefined;
    truncate?: boolean;
    className?: string;
}


export const Description: FunctionComponent<DescriptionProps> = ({ description, truncate, className }: DescriptionProps) => {
    return truncate ? (
        <div>
            <StyledTruncate className={className || ""} content={description || "No description."} tooltipPosition="top" />
        </div>
    ) : (
        <div className={className || ""}>{description || "No description."}</div>
    );
};
