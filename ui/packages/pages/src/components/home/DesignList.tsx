import React, { FunctionComponent, useEffect, useState } from "react";
import Moment from "react-moment";
import { KebabToggle, Truncate } from "@patternfly/react-core";
import { IAction } from "@patternfly/react-table";
import { ThProps } from "@patternfly/react-table/src/components/TableComposable/Th";
import { CustomActionsToggleProps } from "@patternfly/react-table/src/components/Table/ActionsColumn";
import { Design, DesignsSearchResults, DesignsSort } from "@apicurio/apicurio-api-designer-models";
import { DesignDescription } from "../common/DesignDescription";
import { NavLink } from "../common/NavLink";
import { ArtifactTypeIcon } from "@apicurio/apicurio-api-designer-components";
import { DesignOriginLabel } from "./DesignOriginLabel";
import { ResponsiveTable } from "@rhoas/app-services-ui-components";


export type DesignListProps = {
    designs: DesignsSearchResults;
    selectedDesign: Design | undefined;
    sort: DesignsSort;
    onSort: (sort: DesignsSort) => void;
    onRename: (design: Design) => void;
    onEdit: (design: Design) => void;
    onDelete: (design: Design) => void;
    onRegister: (design: Design) => void;
    onDownload: (design: Design) => void;
    onSelect: (design: Design|undefined) => void;
}

export const DesignList: FunctionComponent<DesignListProps> = (
    { designs, selectedDesign, sort, onSort, onEdit, onRename, onDelete, onRegister, onDownload, onSelect }: DesignListProps) => {

    const [sortByIndex, setSortByIndex] = useState<number>();

    const columns: any[] = [
        { index: 0, id: "name", label: "Name", width: 40, sortable: true },
        { index: 1, id: "type", label: "Type", width: 15, sortable: false },
        { index: 2, id: "modified-on", label: "Time updated", width: 15, sortable: true },
        { index: 3, id: "context", label: "Origin", width: 25, sortable: false },
    ];

    const renderColumnData = (column: Design, colIndex: number): React.ReactNode => {
        // Name.
        if (colIndex === 0) {
            return (
                <div>
                    <NavLink className="design-title" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        location={`/designs/${column.id}/editor`}>
                        <Truncate content={column.name} tooltipPosition="top" />
                    </NavLink>
                    <DesignDescription className="design-summary" style={{ overflow: "hidden", textOverflow: "hidden", whiteSpace: "nowrap", fontSize: "14px" }}
                        description={column.summary}
                        truncate={true} />
                </div>
            );
        }
        // Type.
        if (colIndex === 1) {
            return (
                <ArtifactTypeIcon type={column.type} isShowIcon={true} isShowLabel={true} />
            );
        }
        // Modified on.
        if (colIndex === 2) {
            return (
                <Moment date={column.modifiedOn} fromNow={true} />
            );
        }
        // Origin.
        if (colIndex === 3) {
            return <DesignOriginLabel design={column} />;
        }
        return (
            <span />
        );
    };

    const renderActionsToggle = (props: CustomActionsToggleProps): React.ReactNode => {
        return (
            <KebabToggle isDisabled={props.isDisabled} isOpen={props.isOpen} onToggle={(value, event) => {
                event.preventDefault();
                event.stopPropagation();
                props.onToggle(value);
            }} />
        );
    };

    const actionsFor = (design: any): IAction[] => {
        return [
            { title: "View design details", onClick: () => onSelect(design) },
            { isSeparator: true, },
            { title: "Edit design content", onClick: () => onEdit(design) },
            { title: "Edit design metadata", onClick: () => onRename(design) },
            { title: "Export design to Service Registry", onClick: () => onRegister(design) },
            { title: "Download design", onClick: () => onDownload(design) },
            { isSeparator: true, },
            { title: "Delete design", onClick: () => onDelete(design) }
        ];
    };

    const sortParams = (column: any): ThProps["sort"] | undefined => {
        return column.sortable ? {
            sortBy: {
                index: sortByIndex,
                direction: sort.direction
            },
            onSort: (_event, index, direction) => {
                const sort: DesignsSort = {
                    by: index === 0 ? "name" : "modified-on",
                    direction
                };
                onSort(sort);
            },
            columnIndex: column.index
        } : undefined;
    };

    useEffect(() => {
        setSortByIndex(sort.by === "name" ? 0 : 2);
    }, [sort]);

    return (
        <div className="design-list">
            <ResponsiveTable
                ariaLabel="list of designs"
                columns={columns}
                data={designs.designs}
                expectedLength={designs.count}
                minimumColumnWidth={350}
                onRowClick={(row) => onSelect(row.row.id === selectedDesign?.id ? undefined : row.row)}
                renderHeader={({ column, Th }) => (
                    <Th sort={sortParams(column)}
                        className="design-list-header"
                        key={`header-${column.id}`}
                        width={column.width}
                        modifier="truncate">{column.label}</Th>
                )}
                renderCell={({ row, colIndex, Td }) => (
                    <Td className="design-list-cell" key={`cell-${colIndex}-${row.id}`}
                        style={{ maxWidth: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        children={renderColumnData(row as Design, colIndex) as any} />
                )}
                renderActions={({ row, ActionsColumn }) => (
                    <ActionsColumn key={`actions-${row["id"]}`}
                        actionsToggle={renderActionsToggle as any}
                        items={actionsFor(row)}/>
                )}
                isRowSelected={({ row }) => row.id === selectedDesign?.id}
            />
        </div>
    );
};
