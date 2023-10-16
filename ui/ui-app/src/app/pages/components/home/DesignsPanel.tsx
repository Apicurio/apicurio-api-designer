import React, { FunctionComponent, useEffect, useState } from "react";
import { Alert, AlertActionCloseButton, Card, CardBody } from "@patternfly/react-core";
import { ImportFrom } from "./ImportDropdown";
import { DesignsEmptyState } from "./DesignsEmptyState";
import { DesignsEmptyStateFiltered } from "./DesignsEmptyStateFiltered";
import { DesignsToolbar } from "./DesignsToolbar";
import { DesignList } from "./DesignList";
import { DeleteDesignModal } from "./DeleteDesignModal";
import { RenameModal } from "../common/RenameModal";
import { PageConfig, usePageConfig } from "@app/pages";
import {
    Design,
    DesignsSearchCriteria,
    DesignsSearchResults,
    DesignsSort,
    Paging,
    RenameDesign
} from "@models/designs";
import { If, ListWithToolbar } from "@app/components";
import { DesignsService, useDesignsService } from "@services/DesignsService.ts";
import { DownloadService, useDownloadService } from "@services/DownloadService.ts";
import { NavigationService, useNavigation } from "@services/NavigationService.ts";
import { AlertsService, useAlertsService } from "@services/AlertsService.tsx";
import { LocalStorageService, useLocalStorageService } from "@services/LocalStorageService.ts";
import { contentTypeForDesign, convertToValidFilename, fileExtensionForDesign } from "@utils/content.utils.ts";


export type DesignsPanelProps = {
    selectedDesign: Design | undefined;
    onDesignSelected: (design: Design | undefined) => void;
    onCreate: () => void;
    onImport: (from: ImportFrom) => void;
}

export const DesignsPanel: FunctionComponent<DesignsPanelProps> = ({ selectedDesign, onDesignSelected, onCreate, onImport }: DesignsPanelProps) => {
    const [ isLoading, setLoading ] = useState(false);
    const [ error, setError ] = useState<any>();
    const [ showDataWarning, setShowDataWarning ] = useState(true);
    const [ refresh, setRefresh ] = useState(1);
    const [ isFiltered, setFiltered ] = useState(false);
    const [ paging, setPaging ] = useState<Paging>({
        pageSize: 20,
        page: 1
    });
    const [ criteria, setCriteria ] = useState<DesignsSearchCriteria>({
        filterValue: "",
        filterOn: "name"
    });
    const [ sort, setSort ] = useState<DesignsSort>({
        by: "modifiedOn",
        direction: "desc"
    });
    const [ designs, setDesigns ] = useState<DesignsSearchResults>();
    const [ designToDelete, setDesignToDelete ] = useState<Design>();
    const [ isDeleteModalOpen, setDeleteModalOpen ] = useState(false);
    const [ designToRename, setDesignToRename ] = useState<Design>();
    const [ isRenameModalOpen, setRenameModalOpen ] = useState(false);

    const pageConfig: PageConfig = usePageConfig();
    const designsSvc: DesignsService = useDesignsService();
    const downloadSvc: DownloadService = useDownloadService();
    const nav: NavigationService = useNavigation();
    const alerts: AlertsService = useAlertsService();
    const local: LocalStorageService = useLocalStorageService();

    const doRefresh = (): void => {
        setRefresh(refresh + 1);
    };

    const onEditDesign = (design: Design): void => {
        nav.navigateTo(`/designs/${design.id}/editor`);
    };

    const onRenameDesign = (design: Design): void => {
        setDesignToRename(design);
        setRenameModalOpen(true);
    };

    const doRenameDesign = (event: RenameDesign): void => {
        designsSvc.renameDesign(designToRename?.id as string, event.name, event.description).then(() => {
            if (designToRename) {
                designToRename.name = event.name;
                designToRename.description = event.description;
            }
            setRenameModalOpen(false);
            alerts.designRenamed(event);
        }).catch(error => {
            // TODO error handling
            console.error(error);
        });
    };

    const onDeleteDesign = (design: Design): void => {
        setDesignToDelete(design);
        setDeleteModalOpen(true);
    };

    const onDeleteDesignConfirmed = (design: Design): void => {
        designsSvc.deleteDesign(design.id).then(() => {
            doRefresh();
            alerts.designDeleted(design);
        }).catch(error => {
            console.error("[DesignsPanel] Error deleting design: ", error);
            alerts.designDeleteFailed(design, error);
        });
        setDeleteModalOpen(false);
    };

    const onDownloadDesign = (design: Design): void => {
        designsSvc.getDesignContent(design.id).then(content => {
            const filename: string = `${convertToValidFilename(design.name)}.${fileExtensionForDesign(design, content)}`;
            const contentType: string = contentTypeForDesign(design, content);
            const theContent: string = typeof content.data === "object" ? JSON.stringify(content.data, null, 4) : content.data as string;
            downloadSvc.downloadToFS(theContent, contentType, filename);
        }).catch((error: any) => {
            // TODO error handling
            console.error(error);
        });
    };

    const onCriteriaChange = (criteria: DesignsSearchCriteria): void =>  {
        setCriteria(criteria);
        setPaging({
            page: 1,
            pageSize: paging.pageSize
        });
        setFiltered(criteria.filterValue != undefined && criteria.filterValue.trim().length > 0);
        doRefresh();
    };

    const onSortDesigns = (sort: DesignsSort): void => {
        setSort(sort);
        doRefresh();
    };

    const onPagingChange = (paging: Paging): void => {
        setPaging(paging);
        doRefresh();
    };

    useEffect(() => {
        const defaultShowDataWarning: string = `${pageConfig.serviceConfig.designs.type === "browser"}`;
        setShowDataWarning("true" === local.getConfigProperty("designs.panel.show-data-warning", defaultShowDataWarning));
    }, [local, pageConfig]);

    useEffect(() => {
        setLoading(true);
        setError(undefined);
        onDesignSelected(undefined);
        designsSvc.searchDesigns(criteria, paging, sort).then(designs => {
            console.debug("[DesignsPanel] Designs loaded: ", designs);
            setDesigns(designs);
            setLoading(false);
        }).catch(error => {
            console.error(error);
            setLoading(false);
            setError(error);
        });
    }, [refresh]);

    const emptyState: React.ReactNode = (
        <DesignsEmptyState onCreate={onCreate} onImport={onImport} />
    );

    const emptyStateFiltered: React.ReactNode = (
        <DesignsEmptyStateFiltered onClear={() => {
            onCriteriaChange({
                filterValue: "",
                filterOn: ""
            });
        }} />
    );

    const toolbar: React.ReactNode = (
        <DesignsToolbar designs={designs} criteria={criteria} paging={paging}
            onCreate={onCreate} onImport={onImport}
            onCriteriaChange={onCriteriaChange} onPagingChange={onPagingChange} />
    );

    const onCloseDataWarning = (): void => {
        setShowDataWarning(false);
        local.setConfigProperty("designs.panel.show-data-warning", "false");
    };

    return (
        <div className="designs-panel" style={{ minHeight: "100%" }}>
            <ListWithToolbar toolbar={toolbar}
                emptyState={emptyState}
                filteredEmptyState={emptyStateFiltered}
                isLoading={isLoading}
                isError={error !== undefined}
                isFiltered={isFiltered}
                isEmpty={!designs || designs.count === 0}>
                <Card isSelectable={false}>
                    <CardBody className="panel-body first-child-no-padding" style={{ padding: "0px" }}>
                        <If condition={showDataWarning}>
                            <Alert className="panel-alert"
                                isInline={true}
                                variant="info"
                                title="Service Preview: Data is stored locally in your browser"
                                actionClose={<AlertActionCloseButton onClose={onCloseDataWarning} />}
                                style={{ marginBottom: "15px" }}>
                                <p>
                                    In this configuration of API Designer, all designs are stored
                                    locally in your browser. Clearing your browser cache or switching to a new browser
                                    might result in loss of data. Make sure you save your work by downloading your
                                    designs locally.
                                </p>
                            </Alert>
                        </If>
                        <DesignList designs={designs as DesignsSearchResults}
                            selectedDesign={selectedDesign}
                            sort={sort}
                            onSelect={onDesignSelected}
                            onSort={onSortDesigns}
                            onEdit={onEditDesign}
                            onRename={onRenameDesign}
                            onDownload={onDownloadDesign}
                            onDelete={onDeleteDesign} />
                    </CardBody>
                </Card>
            </ListWithToolbar>
            <DeleteDesignModal design={designToDelete}
                isOpen={isDeleteModalOpen}
                onDelete={onDeleteDesignConfirmed}
                onDownload={onDownloadDesign}
                onCancel={() => setDeleteModalOpen(false)} />
            <RenameModal design={designToRename}
                isOpen={isRenameModalOpen}
                onRename={doRenameDesign}
                onCancel={() => setRenameModalOpen(false)} />
        </div>
    );
};
