import { FunctionComponent } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@patternfly/react-icons";

/**
 * Properties
 */
export type ToggleIconProps = {
    expanded: boolean;
    onClick: () => void;
};

export const ToggleIcon: FunctionComponent<ToggleIconProps> = ({ expanded, onClick }: ToggleIconProps) => {
    return expanded ? (
        <ChevronDownIcon onClick={onClick} />
    ) : (
        <ChevronRightIcon onClick={onClick} />
    );
};
