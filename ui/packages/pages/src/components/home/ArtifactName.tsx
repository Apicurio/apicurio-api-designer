import React, { CSSProperties, FunctionComponent } from "react";

/**
 * Properties
 */
export type ArtifactNameProps = {
    id: string;
    name: string;
    style?: CSSProperties | undefined;
}

/**
 * Displays a RHOSR artifact's name.
 */
export const ArtifactName: FunctionComponent<ArtifactNameProps> = ({ id, name }: ArtifactNameProps) => {
    return name ? (
        <React.Fragment>
            <span className="name">{name}</span>
            <span className="id">{id}</span>
        </React.Fragment>
    ) : (
        <React.Fragment>
            <span className="name">{id}</span>
        </React.Fragment>
    );
};
