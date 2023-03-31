import React, { FunctionComponent, useEffect, useState } from "react";
import { Registry } from "@rhoas/registry-management-sdk";
import { EmptyState, EmptyStateBody, EmptyStateVariant, Spinner, Title } from "@patternfly/react-core";
import {
    ArtifactSearchResults,
    CreateDesignContent, GetArtifactsCriteria,
    Paging,
    SearchedArtifact,
    SearchedVersion
} from "@apicurio/apicurio-api-designer-models";
import { ArtifactListToolbar, ArtifactListToolbarCriteria } from "./ArtifactListToolbar";
import {
    RhosrInstanceService,
    RhosrInstanceServiceFactory,
    useRhosrInstanceServiceFactory
} from "@apicurio/apicurio-api-designer-services";
import { IfRhosr } from "../common/IfRhosr";
import { ListWithToolbar } from "@apicurio/apicurio-api-designer-components";
import { ArtifactList } from "./ArtifactList";

/**
 * Properties
 */
export type ArtifactSelectorProps = {
    registries: Registry[];
    onSelected: (registry?: Registry, artifact?: SearchedArtifact, version?: SearchedVersion, content?: CreateDesignContent) => void;
};

/**
 * A control that allows the user to find and select a single version of a single artifact from
 * a service registry instance.
 */
export const ArtifactSelector: FunctionComponent<ArtifactSelectorProps> = ({ registries, onSelected }: ArtifactSelectorProps) => {
    const [ querying, setQuerying ] = useState(true);
    const [ paging, setPaging ] = useState<Paging>({
        pageSize: 20,
        page: 1
    });
    const [ criteria, setCriteria ] = useState<ArtifactListToolbarCriteria>({
        filterValue: "",
        ascending: true,
        filterSelection: "name"
    });
    const [ registry, setRegistry ] = useState<Registry>();
    const [ artifacts, setArtifacts ] = useState<ArtifactSearchResults|undefined>();
    const [ rhosrInstance, setRhosrInstance ] = useState<RhosrInstanceService>();

    const rhosrInstanceFactory: RhosrInstanceServiceFactory = useRhosrInstanceServiceFactory();

    const onRegistrySelected = (registry: Registry): void => {
        setRegistry(registry);
    };

    const onCriteriaChange = (criteria: ArtifactListToolbarCriteria): void =>  {
        setCriteria(criteria);
    };

    const onPagingChange = (paging: Paging): void => {
        setPaging(paging);
    };

    const fetchArtifactVersions = (artifact: SearchedArtifact): Promise<SearchedVersion[]> => {
        const ri: RhosrInstanceService = rhosrInstance as RhosrInstanceService;
        return ri.getArtifactVersions(artifact.groupId, artifact.id);
    };

    const fetchArtifactContent = (artifact: SearchedArtifact, version?: SearchedVersion): Promise<string> => {
        const ri: RhosrInstanceService = rhosrInstance as RhosrInstanceService;
        return ri.getArtifactContent(artifact.groupId, artifact.id, version?.version||"latest");
    };

    const onArtifactSelected = (artifact?: SearchedArtifact, version?: SearchedVersion, content?: CreateDesignContent): void => {
        onSelected(registry, artifact, version, content);
    };

    // Initialization
    useEffect(() => {
        if (registries && registries.length > 0) {
            setRegistry(registries[0]);
        }
    }, []);

    // Whenever the registry changes, create a rhosr instance service for it.
    useEffect(() => {
        if (registry) {
            const rhosrInstance: RhosrInstanceService = rhosrInstanceFactory.createFor(registry as Registry);
            setRhosrInstance(rhosrInstance);
        }
    }, [registry]);

    // Query for artifacts when relevant changes occur.
    useEffect(() => {
        if (rhosrInstance) {
            const gac: GetArtifactsCriteria = {
                sortAscending: criteria.ascending,
                type: criteria.filterSelection,
                value: criteria.filterValue
            };
            setQuerying(true);
            rhosrInstance.getArtifacts(gac, paging).then(results => {
                setArtifacts(results);
                setQuerying(false);
            }).catch(error => {
                // TODO handle error
                console.error("[RegistryPage] Error searching for artifacts: ", error);
                setArtifacts({
                    artifacts: [],
                    count: 0,
                    page: 1,
                    pageSize: 20
                });
                setQuerying(false);
            });
        }
        onSelected(undefined, undefined, undefined);
    }, [rhosrInstance, criteria, paging]);

    const toolbar: React.ReactNode = (
        <ArtifactListToolbar registries={registries} criteria={criteria} paging={paging}
            onRegistrySelected={onRegistrySelected}
            menuAppendTo={document.getElementById("artifact-selector")}
            onCriteriaChange={onCriteriaChange} onPagingChange={onPagingChange}
            artifacts={artifacts} />
    );

    const emptyState: React.ReactNode = (
        <IfRhosr registry={registry} scope="read">
            <EmptyState variant={EmptyStateVariant.xs}>
                <Title headingLevel="h4" size="md">{"None found"}</Title>
                <EmptyStateBody>{"No artifacts found in the registry instance."}</EmptyStateBody>
            </EmptyState>
        </IfRhosr>
    );

    const filteredEmptyState: React.ReactNode = (
        <IfRhosr registry={registry} scope="read">
            <EmptyState variant={EmptyStateVariant.xs}>
                <Title headingLevel="h4" size="md">{"None found"}</Title>
                <EmptyStateBody>{"No artifacts matched the filter criteria."}</EmptyStateBody>
            </EmptyState>
        </IfRhosr>
    );

    const loadingComponent: React.ReactNode = (
        <Spinner size="lg" style={{ marginTop: "10px" }} />
    );

    return (
        <div id="artifact-selector">
            <ListWithToolbar toolbar={toolbar}
                alwaysShowToolbar={true}
                emptyState={emptyState}
                filteredEmptyState={filteredEmptyState}
                isFiltered={criteria.filterValue !== ""}
                isLoading={querying}
                isError={false}
                loadingComponent={loadingComponent}
                isEmpty={!artifacts || artifacts.count === 0}
            >
                <IfRhosr registry={registry} scope="read">
                    <ArtifactList artifacts={artifacts?.artifacts} fetchArtifactContent={fetchArtifactContent}
                        onArtifactSelected={onArtifactSelected}
                        fetchArtifactVersions={fetchArtifactVersions} />
                </IfRhosr>
            </ListWithToolbar>
        </div>
    );
};
