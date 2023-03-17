import React, { CSSProperties, FunctionComponent } from "react";

/**
 * Properties
 */
export type ArtifactGroupProps = {
    groupId: string|undefined;
    style?: CSSProperties | undefined;
}

/**
 * Displays a RHOSR artifact's group.
 */
export const ArtifactGroup: FunctionComponent<ArtifactGroupProps> = ({ groupId, style }: ArtifactGroupProps) => {
    const cname = (): string => {
        return !groupId ? "nogroup" : "group";
    };

    return (
        <span style={style} className={cname()}>{groupId}</span>
    );
};
