import React, { FunctionComponent, useEffect, useState } from "react";
import {
    Button,
    OnPerPageSelect,
    OnSetPage,
    Pagination,
    SearchInput,
    SelectVariant,
    Toolbar,
    ToolbarContent,
    ToolbarItem
} from "@patternfly/react-core";
import { SortAlphaDownAltIcon, SortAlphaDownIcon } from "@patternfly/react-icons";
import { Registry } from "@rhoas/registry-management-sdk";
import { ArtifactSearchResults, Paging } from "@apicurio/apicurio-api-designer-models";
import { ObjectSelect } from "@apicurio/apicurio-api-designer-components";


export interface ArtifactListToolbarCriteria {
    filterSelection: string;
    filterValue: string;
    ascending: boolean;
}

export type ArtifactListToolbarProps = {
    registries: Registry[];
    criteria: ArtifactListToolbarCriteria;
    paging: Paging;
    artifacts?: ArtifactSearchResults;
    menuAppendTo?: HTMLElement | (() => HTMLElement) | "parent" | "inline" | undefined | null;
    onRegistrySelected: (registry: Registry) => void;
    onCriteriaChange: (criteria: ArtifactListToolbarCriteria) => void;
    onPagingChange: (paging: Paging) => void;
}


export const ArtifactListToolbar: FunctionComponent<ArtifactListToolbarProps> = (
    { registries, criteria, onCriteriaChange, paging, onPagingChange, artifacts, onRegistrySelected, menuAppendTo }: ArtifactListToolbarProps) => {
    const [ registry, setRegistry ] = useState<Registry>();
    const [ filterValue, setFilterValue ] = useState(criteria.filterValue);

    const onRegistrySelectInternal = (registry: Registry): void => {
        setRegistry(registry);
        onRegistrySelected(registry);
    };

    const onToggleAscending = (): void => {
        onCriteriaChange({
            ...criteria,
            ascending: !criteria.ascending
        });
    };

    const onSetPage: OnSetPage = (event: any, newPage: number, perPage?: number): void => {
        onPagingChange({
            ...paging,
            page: newPage,
            pageSize: perPage ? perPage : paging.pageSize
        });
    };

    const onPerPageSelect: OnPerPageSelect = (event: any, newPerPage: number): void => {
        onPagingChange({
            ...paging,
            pageSize: newPerPage
        });
    };

    const onFilterChange = (_: any, value: string): void => {
        setFilterValue(value);
    };

    const onSearch = (): void => {
        onCriteriaChange({
            ...criteria,
            filterValue
        });
    };

    const onClear = (): void => {
        setFilterValue("");
        onCriteriaChange({
            ...criteria,
            filterValue: ""
        });
    };

    const totalArtifactCount = (): number => {
        return artifacts?.count || 0;
    };

    useEffect(() => {
        if (registries && registries.length > 0) {
            setRegistry(registries[0]);
        }
    }, [registries]);

    useEffect(() => {
        setFilterValue(criteria.filterValue);
    }, [criteria]);

    return (
        <Toolbar id="artifacts-toolbar-1" className="artifacts-toolbar" style={{ padding: "0px", borderBottom: "1px solid #ddd" }}>
            <ToolbarContent style={{ width: "100%" }}>
                <ToolbarItem variant="search-filter">
                    <ObjectSelect value={registry} items={registries}
                        variant={SelectVariant.single}
                        onSelect={onRegistrySelectInternal}
                        toggleId="artifact-list-toolbar-registries"
                        menuAppendTo={menuAppendTo || "parent"}
                        itemToString={item => item.name} />
                </ToolbarItem>
                <ToolbarItem variant="search-filter">
                    <SearchInput aria-label="Filter artifacts" value={filterValue} onChange={onFilterChange} onSearch={onSearch} onClear={onClear} />
                </ToolbarItem>
                <ToolbarItem className="sort-icon-item">
                    <Button variant="plain" aria-label="edit" data-testid="toolbar-btn-sort" onClick={onToggleAscending}>
                        {
                            criteria.ascending ? <SortAlphaDownIcon/> : <SortAlphaDownAltIcon/>
                        }
                    </Button>
                </ToolbarItem>
                <ToolbarItem className="artifact-paging-item" style={{ flexGrow: "1", textAlign: "right" }}>
                    <Pagination
                        style={{ padding: "5px" }}
                        variant="bottom"
                        dropDirection="down"
                        isCompact={true}
                        itemCount={totalArtifactCount()}
                        perPage={paging.pageSize}
                        page={paging.page}
                        onSetPage={onSetPage}
                        onPerPageSelect={onPerPageSelect}
                        widgetId="artifact-list-pagination"
                        className="artifact-list-pagination"
                    />
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );
};
