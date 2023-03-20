import React, { FunctionComponent, useEffect, useState } from "react";
import "./ArtifactListItem.css";
import { Badge, Radio, Spinner } from "@patternfly/react-core";
import {
    ArtifactTypes,
    ContentTypes,
    CreateDesignContent,
    SearchedArtifact,
    SearchedVersion
} from "@apicurio/apicurio-api-designer-models";
import { isJson, isXml, isYaml } from "@apicurio/apicurio-api-designer-utils";
import { ArtifactTypeIcon, If, IsLoading, ObjectSelect } from "@apicurio/apicurio-api-designer-components";
import { ArtifactName } from "./ArtifactName";
import { ArtifactGroup } from "./ArtifactGroup";


/**
 * Properties
 */
export type ArtifactListItemProps = {
    artifact: SearchedArtifact;
    isSelected: boolean;
    onSelected: (artifact: SearchedArtifact) => void;
    onUnselected: (artifact: SearchedArtifact) => void;
    onArtifactLoaded: (artifact: SearchedArtifact, version: SearchedVersion, content: CreateDesignContent) => void;
    fetchArtifactVersions: (artifact: SearchedArtifact) => Promise<SearchedVersion[]>;
    fetchArtifactContent: (artifact: SearchedArtifact, version?: SearchedVersion) => Promise<string>;
}

/**
 * A list of artifacts in a RHOSR instance.
 */
export const ArtifactListItem: FunctionComponent<ArtifactListItemProps> = (
    { artifact, isSelected, onSelected, onUnselected, onArtifactLoaded, fetchArtifactVersions, fetchArtifactContent }: ArtifactListItemProps) => {

    const [isLoading, setLoading] = useState<boolean>(false);
    const [versions, setVersions] = useState<SearchedVersion[]>();
    const [selectedVersion, setSelectedVersion] = useState<SearchedVersion>();
    const [content, setContent] = useState<string>();
    const [isContentLoaded, setContentLoaded] = useState<boolean>(false);

    const statuses = (): string[] => {
        const rval: string[] = [];
        if (artifact.state === "DISABLED") {
            rval.push("Disabled");
        }
        if (artifact.state === "DEPRECATED") {
            rval.push("Deprecated");
        }
        return rval;
    };
    const description = (): string => {
        if (artifact.description) {
            return artifact.description;
        }
        return `An artifact of type ${artifact.type} with no description.`;
    };

    const shouldLoadVersions = (): boolean => {
        return versions === undefined || versions.length === 0;
    };

    const loadVersions = (): void => {
        setContentLoaded(false);
        setLoading(true);
        console.debug(`[ArtifactListItem] Loading versions for ${artifact.id}`);
        fetchArtifactVersions(artifact).then(versions => {
            setVersions(versions);
            setLoading(false);
            onVersionSelect(undefined);
        }).catch(() => {
            // TODO handle errors
        });
    };

    const onToggleSelected = (event: any): void => {
        // Bit of a hack - if the user clicks the Version drop-down, don't do the
        // artifact item toggling behavior.
        if (event && event.target && event.target.localName === "button") {
            return;
        }

        if (isSelected) {
            onUnselected(artifact);
        } else {
            if (shouldLoadVersions()) {
                loadVersions();
            } else {
                onVersionSelect(undefined);
            }
            onSelected(artifact);
        }
    };

    const onVersionSelect = (version?: SearchedVersion): void => {
        setSelectedVersion(version);
        setLoading(true);
        console.debug(`[ArtifactListItem] Version selected for ${artifact.id}, loading content. Version: `, version);
        fetchArtifactContent(artifact, version).then(content => {
            console.debug("[ArtifactListItem] Artifact content successfully fetched for: ", artifact.id);
            setContent(content);
            setLoading(false);
            setContentLoaded(true);
        }).catch(() => {
            // TODO handle errors loading the artifact content
        });
    };

    // Whenever the content changes, fire the "onArtifactLoaded" event.  Do this
    // from inside useEffect() so that it's not happening from an async callback.
    useEffect(() => {
        if (content !== undefined) {
            let contentType: string;
            if (isJson(content)) {
                contentType = ContentTypes.APPLICATION_JSON;
            } else if (isYaml(content)) {
                contentType = ContentTypes.APPLICATION_YAML;
            } else if (isXml(content)) {
                contentType = ContentTypes.APPLICATION_XML;
            } else if (artifact.type === ArtifactTypes.PROTOBUF) {
                contentType = ContentTypes.APPLICATION_PROTOBUF;
            } else if (artifact.type === ArtifactTypes.GRAPHQL) {
                contentType = ContentTypes.APPLICATION_GRAPHQL;
            } else {
                contentType = ContentTypes.APPLICATION_JSON;
            }
            const cdc: CreateDesignContent = {
                contentType,
                data: content
            };
            onArtifactLoaded(artifact, selectedVersion as SearchedVersion, cdc);
        }
    }, [content]);

    return (
        <div className={`artifact-list-item ${isSelected ? "selected" : ""} ${isContentLoaded ? "loaded" : ""}`}
            onClick={onToggleSelected}>
            <div className="artifact-list-item-radio">
                <IsLoading condition={isLoading} loadingComponent={(<Spinner size="sm" />)}>
                    <Radio id={`artifact-radio-${artifact.id}`} name="" isChecked={isSelected} />
                </IsLoading>
            </div>
            <div className="artifact-list-item-icon">
                <ArtifactTypeIcon isShowIcon={true} type={artifact.type}/>
            </div>
            <div className="artifact-list-item-info">
                <div className="artifact-title">
                    <ArtifactGroup groupId={artifact.groupId} />
                    <ArtifactName id={artifact.id} name={artifact.name} />
                    {
                        statuses().map( status =>
                            <Badge className="status-badge" key={status} isRead={true}>{status}</Badge>
                        )
                    }
                </div>
                <div className="artifact-description">{description()}</div>
            </div>
            <div className="artifact-list-item-versions">
                <If condition={isSelected}>
                    <ObjectSelect value={selectedVersion} items={versions as SearchedVersion[]}
                        toggleId={`artifact-list-item-${artifact.id}-version-select`}
                        noSelectionLabel="latest" menuAppendTo="parent"
                        onSelect={onVersionSelect} itemToString={version => version.version} />
                </If>
            </div>
        </div>
    );
};
