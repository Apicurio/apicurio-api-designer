import React, { FunctionComponent, useEffect, useState } from "react";
import { Alert, AlertActionCloseButton, Card, CardBody } from "@patternfly/react-core";
import {
    Design,
    DesignsSearchCriteria,
    DesignsSearchResults,
    DesignsSort,
    Paging, RenameDesign
} from "@apicurio/apicurio-api-designer-models";
import { ImportFrom } from "./ImportDropdown";
import {
    DesignsService,
    DownloadService, LocalStorageService, NavigationService,
    useDesignsService,
    useDownloadService, useLocalStorageService, useNavigation
} from "@apicurio/apicurio-api-designer-services";
import { AlertsService, useAlertsService } from "@apicurio/apicurio-api-designer-services/src/AlertsService";
import { ExportDesign } from "@apicurio/apicurio-api-designer-models/src/designs/ExportDesign";
import {
    contentTypeForDesign,
    convertToValidFilename,
    fileExtensionForDesign
} from "@apicurio/apicurio-api-designer-utils";
import { If, ListWithToolbar } from "@apicurio/apicurio-api-designer-components";
import { DesignsEmptyState } from "./DesignsEmptyState";
import { DesignsEmptyStateFiltered } from "./DesignsEmptyStateFiltered";
import { DesignsToolbar } from "./DesignsToolbar";
import { DesignList } from "./DesignList";
import { DeleteDesignModal } from "./DeleteDesignModal";
import { RenameModal } from "../common/RenameModal";
import { ExportToRegistryModal } from "../common/ExportToRegistryModal";


export type DesignsPanelProps = {
    selectedDesign: Design | undefined;
    onDesignSelected: (design: Design | undefined) => void;
    onCreate: () => void;
    onImport: (from: ImportFrom) => void;
}

export const DesignsPanel: FunctionComponent<DesignsPanelProps> = ({ selectedDesign, onDesignSelected, onCreate, onImport }: DesignsPanelProps) => {
    const [ isLoading, setLoading ] = useState(false);
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
        by: "modified-on",
        direction: "desc"
    });
    const [ designs, setDesigns ] = useState<DesignsSearchResults>();
    const [ designToDelete, setDesignToDelete ] = useState<Design>();
    const [ isDeleteModalOpen, setDeleteModalOpen ] = useState(false);
    const [ designToRegister, setDesignToRegister ] = useState<Design>();
    const [ isRegisterModalOpen, setRegisterModalOpen ] = useState(false);
    const [ designToRename, setDesignToRename ] = useState<Design>();
    const [ isRenameModalOpen, setRenameModalOpen ] = useState(false);

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
        designsSvc.renameDesign(designToRename?.id as string, event.name, event.summary).then(() => {
            if (designToRename) {
                designToRename.name = event.name;
                designToRename.summary = event.summary;
            }
            setRenameModalOpen(false);
            alerts.designRenamed(event);
        }).catch(() => {
            // TODO error handling
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

    const onRegisterDesign = (design: Design): void => {
        setDesignToRegister(design);
        setRegisterModalOpen(true);
    };

    const onRegisterDesignConfirmed = (event: ExportDesign): void => {
        setRegisterModalOpen(false);
        alerts.designExportedToRhosr(event);
    };

    const onDownloadDesign = (design: Design): void => {
        designsSvc.getDesignContent(design.id).then(content => {
            const filename: string = `${convertToValidFilename(design.name)}.${fileExtensionForDesign(design, content)}`;
            const contentType: string = contentTypeForDesign(design, content);
            const theContent: string = typeof content.data === "object" ? JSON.stringify(content.data, null, 4) : content.data as string;
            downloadSvc.downloadToFS(design, theContent, contentType, filename);
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
        setShowDataWarning("true" === local.getConfigProperty("designs.panel.show-data-warning", "true"));
    }, []);

    useEffect(() => {
        setLoading(true);
        onDesignSelected(undefined);
        designsSvc.searchDesigns(criteria, paging, sort).then(designs => {
            console.debug("[DesignsPanel] Designs loaded: ", designs);
            setDesigns(designs);
            setLoading(false);
        }).catch(error => {
            // TODO need error handling
            console.error(error);
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
                                    In the Service Preview release of OpenShift API Designer, all designs are stored
                                    locally in your browser. Clearing your browser cache or switching to a new browser
                                    might result in loss of data. Make sure you save your work by downloading your
                                    designs locally or by exporting them to a Red Hat OpenShift Service Registry instance.
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
                            onRegister={onRegisterDesign}
                            onDelete={onDeleteDesign} />
                    </CardBody>
                </Card>
            </ListWithToolbar>
            <DeleteDesignModal design={designToDelete}
                isOpen={isDeleteModalOpen}
                onDelete={onDeleteDesignConfirmed}
                onDownload={onDownloadDesign}
                onCancel={() => setDeleteModalOpen(false)} />
            <ExportToRegistryModal design={designToRegister as Design}
                isOpen={isRegisterModalOpen}
                onExported={onRegisterDesignConfirmed}
                onCancel={() => setRegisterModalOpen(false)} />
            <RenameModal design={designToRename}
                isOpen={isRenameModalOpen}
                onRename={doRenameDesign}
                onCancel={() => setRenameModalOpen(false)} />
        </div>
    );
};
