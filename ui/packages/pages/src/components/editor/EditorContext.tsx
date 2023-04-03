import React, { FunctionComponent, useEffect, useState } from "react";
import "./EditorContext.css";
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Dropdown,
    DropdownItem,
    DropdownSeparator,
    DropdownToggle,
    Text,
    TextContent
} from "@patternfly/react-core";
import Moment from "react-moment";
import { Registry } from "@rhoas/registry-management-sdk";
import {
    ArtifactTypes,
    Design,
    DesignContext,
    TestRegistryErrorResponse
} from "@apicurio/apicurio-api-designer-models";
import { LocalStorageService, useLocalStorageService } from "@apicurio/apicurio-api-designer-services";
import { AlertsService, useAlertsService } from "@apicurio/apicurio-api-designer-services/src/AlertsService";
import { ExportDesign } from "@apicurio/apicurio-api-designer-models/src/designs/ExportDesign";
import { TestRegistryModal } from "./TestRegistryModal";
import { NavLink } from "../common/NavLink";
import { ArtifactTypeIcon, If, ToggleIcon } from "@apicurio/apicurio-api-designer-components";
import { DesignDescription } from "../common/DesignDescription";
import { RegistryNavLink } from "../common/RegistryNavLink";
import { ExportToRegistryModal } from "../common/ExportToRegistryModal";

/**
 * Properties
 */
export type EditorContextProps = {
    design: Design;
    dirty: boolean;
    artifactContent: string;
    onSave: () => void;
    onFormat: () => void;
    onDelete: () => void;
    onDownload: () => void;
    onRename: () => void;
    onCompareContent: () => void;
    onExpandTestRegistryCausesPanel: (error: TestRegistryErrorResponse) => void;
    onRegistrationTestRegistry: (registry: Registry, group: string | undefined, artifactId: string) => void;
    isPanelOpen?: boolean;
}

type EditorContextMenuItem = {
    label?: string;
    key: string;
    isSeparator?: boolean;
    accept?: (props: EditorContextProps) => boolean;
    isDisabled?: (props: EditorContextProps) => boolean;
};

const menuActions: EditorContextMenuItem[] = [
    {
        label: "Edit design metadata",
        key: "action-rename",
    },
    {
        label: "Format design content",
        key: "action-format",
        accept: (props: EditorContextProps) => { return [ArtifactTypes.AVRO, ArtifactTypes.JSON].includes(props.design.type); },
    },
    {
        label: "Show design changes",
        key: "action-compare",
        isDisabled: (props: EditorContextProps) => { return !props.dirty; },
    },
    {
        key: "action-separator-1",
        isSeparator: true
    },
    {
        label: "Run Service Registry check",
        key: "action-test-registry"
    },
    {
        label: "Export design to Service Registry",
        key: "action-export-to-rhosr",
    },
    {
        label: "Download design",
        key: "action-download"
    },
    {
        key: "action-separator-2",
        isSeparator: true
    },
    {
        label: "Delete design",
        key: "action-delete"
    },
];


/**
 * The context of the design when editing a design on the editor page.
 */
export const EditorContext: FunctionComponent<EditorContextProps> = (props: EditorContextProps) => {

    const lss: LocalStorageService = useLocalStorageService();

    const [designContext, setDesignContext] = useState<DesignContext>();
    const [isActionMenuToggled, setActionMenuToggled] = useState(false);
    const [isExpanded, setExpanded] = useState(lss.getConfigProperty("editor-context.isExpanded", "false") === "true");
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const [isTestRegistryModalOpen, setIsTestRegistryModalOpen] = useState(false);

    const alerts: AlertsService = useAlertsService();

    const onActionMenuToggle = (value: boolean): void => {
        setActionMenuToggled(value);
    };

    const onToggleExpand = (): void => {
        const newExpanded: boolean = !isExpanded;
        lss.setConfigProperty("editor-context.isExpanded", "" + newExpanded);
        setExpanded(newExpanded);
    };

    const actionMenuToggle: React.ReactNode = (
        <DropdownToggle id="action-toggle" toggleVariant="secondary" onToggle={onActionMenuToggle}>Actions</DropdownToggle>
    );

    const onActionMenuSelect = (event?: React.SyntheticEvent<HTMLDivElement>): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const action: string = event?.target.attributes["data-id"].value;
        setActionMenuToggled(false);
        switch (action) {
            case "action-compare":
                props.onCompareContent();
                return;
            case "action-export-to-rhosr":
                setRegisterModalOpen(true);
                return;
            case "action-format":
                props.onFormat();
                return;
            case "action-rename":
                props.onRename();
                return;
            case "action-delete":
                props.onDelete();
                return;
            case "action-download":
                props.onDownload();
                return;
            case "action-test-registry":
                setIsTestRegistryModalOpen(true);
                return;
        }
    };

    const hasRhosrContext = (): boolean => {
        return designContext !== undefined && designContext.type && designContext.type === "registry";
    };

    const hasFileContext = (): boolean => {
        return designContext !== undefined && designContext.type && designContext.type === "file";
    };

    const hasUrlContext = (): boolean => {
        return designContext !== undefined && designContext.type && designContext.type === "url";
    };

    const onRegisterDesignConfirmed = (event: ExportDesign): void => {
        setRegisterModalOpen(false);
        alerts.designExportedToRhosr(event);
    };

    useEffect(() => {
        if (props.design) {
            const context: DesignContext|undefined = props.design.origin;
            setDesignContext(context);
        }
    }, [props.design]);

    const menuItems: any[] = menuActions.filter(action => !action.accept ? true : action.accept(props)).map(action => (
        action.isSeparator ? (
            <DropdownSeparator key={action.key} />
        ) : (
            <DropdownItem key={action.key} data-id={action.key} isDisabled={action.isDisabled ? action.isDisabled(props) : false}>{action.label}</DropdownItem>
        )
    ));

    return (
        <React.Fragment>
            <TestRegistryModal isOpen={isTestRegistryModalOpen}
                design={props.design}
                onCancel={() => setIsTestRegistryModalOpen(false)}
                onSubmit={(...params) => {
                    props.onRegistrationTestRegistry(...params);
                    setIsTestRegistryModalOpen(false);
                }} />
            <div className="editor-context">
                <div className="editor-context-breadcrumbs">
                    <Breadcrumb style={{ marginBottom: "10px" }}>
                        <BreadcrumbItem component="button">
                            <NavLink location="/">API and Schema Designs</NavLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isActive={true}>{props.design?.name}</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <div className="editor-context-last-modified">
                    <span>Last modified:</span>
                    <Moment date={props.design.modifiedOn} fromNow={true} />
                </div>
                <div className="editor-context-actions">
                    <Dropdown
                        onSelect={onActionMenuSelect}
                        toggle={actionMenuToggle as any}
                        style={{ zIndex: 1000 }}
                        isOpen={isActionMenuToggled}
                        isPlain
                        dropdownItems={menuItems}
                    />
                </div>
                <div className="editor-context-save">
                    <Button className="btn-save" variant="primary" onClick={props.onSave} isDisabled={!props.dirty}>Save</Button>
                </div>
                <div className="editor-context-toggle">
                    <Button className="btn-toggle" variant="plain" onClick={onToggleExpand}>
                        <ToggleIcon expanded={isExpanded} onClick={() => { setExpanded(!isExpanded); }} />
                    </Button>
                </div>
            </div>
            <If condition={isExpanded}>
                <div className="editor-context-details">
                    <TextContent>
                        <Text component="h1" className="title">{props.design?.name}</Text>
                        <DesignDescription className="description" description={props.design?.description} />
                    </TextContent>
                    <div className="metadata">
                        <DescriptionList isHorizontal={true} isCompact={true}>
                            <DescriptionListGroup>
                                <DescriptionListTerm>Type</DescriptionListTerm>
                                <DescriptionListDescription>
                                    <ArtifactTypeIcon type={props.design.type} isShowLabel={true} isShowIcon={true} />
                                </DescriptionListDescription>
                            </DescriptionListGroup>
                            <If condition={hasRhosrContext}>
                                <DescriptionListGroup>
                                    <DescriptionListTerm>Artifact</DescriptionListTerm>
                                    <DescriptionListDescription>
                                        <span className="group">{designContext?.registry?.groupId || "default"}</span>
                                        <span> / </span>
                                        <RegistryNavLink context={designContext}>
                                            <span className="group">{designContext?.registry?.artifactId}</span>
                                            <span> </span>
                                            <span>(</span>
                                            <span className="group">{designContext?.registry?.version || "latest"}</span>
                                            <span>)</span>
                                        </RegistryNavLink>
                                    </DescriptionListDescription>
                                </DescriptionListGroup>
                            </If>
                            <If condition={hasFileContext}>
                                <DescriptionListGroup>
                                    <DescriptionListTerm>File name</DescriptionListTerm>
                                    <DescriptionListDescription>
                                        <span>{designContext?.file?.fileName}</span>
                                    </DescriptionListDescription>
                                </DescriptionListGroup>
                            </If>
                            <If condition={hasUrlContext}>
                                <DescriptionListGroup>
                                    <DescriptionListTerm>URL</DescriptionListTerm>
                                    <DescriptionListDescription>
                                        <a href={designContext?.url?.url}>{designContext?.url?.url}</a>
                                    </DescriptionListDescription>
                                </DescriptionListGroup>
                            </If>
                        </DescriptionList>
                    </div>
                </div>
            </If>
            <ExportToRegistryModal design={props.design as Design}
                isOpen={isRegisterModalOpen}
                onExported={onRegisterDesignConfirmed}
                onCancel={() => setRegisterModalOpen(false)} />
        </React.Fragment>
    );
};
