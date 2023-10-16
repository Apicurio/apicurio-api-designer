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
    DropdownItem, MenuToggle, MenuToggleElement,
    Text,
    TextContent
} from "@patternfly/react-core";
import { NavLink } from "../common/NavLink";
import { DesignDescription } from "../common/DesignDescription";
import { ArtifactTypes, Design, DesignEvent } from "@models/designs";
import { LocalStorageService, useLocalStorageService } from "@services/LocalStorageService.ts";
import { DesignsService, useDesignsService } from "@services/DesignsService.ts";
import { DropdownSeparator } from "@patternfly/react-core/deprecated";
import { If, ToggleIcon, ArtifactTypeIcon } from "@app/components";

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
}

type EditorContextMenuItem = {
    label?: string;
    key: string;
    isSeparator?: boolean;
    accept?: (props: EditorContextProps) => boolean;
    isDisabled?: (props: EditorContextProps) => boolean;
};


/**
 * The context of the design when editing a design on the editor page.
 */
export const EditorContext: FunctionComponent<EditorContextProps> = (props: EditorContextProps) => {
    const lss: LocalStorageService = useLocalStorageService();

    const [originEvent, setOriginEvent] = useState<DesignEvent>();
    const [isActionMenuToggled, setActionMenuToggled] = useState(false);
    const [isExpanded, setExpanded] = useState(lss.getConfigProperty("editor-context.isExpanded", "false") === "true");

    const designService: DesignsService = useDesignsService();

    const menuActions: EditorContextMenuItem[] = [
        {
            label: "Edit design metadata",
            key: "action-rename",
        },
        {
            label: "Format design content",
            key: "action-format",
            accept: (props: EditorContextProps) => { return [ArtifactTypes.AVRO, ArtifactTypes.JSON].includes(props.design?.type); }
        },
        {
            label: "Show design changes",
            key: "action-compare",
            isDisabled: (props: EditorContextProps) => { return !props.dirty; }
        },
        {
            key: "action-separator-1",
            isSeparator: true
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

    const onActionMenuToggle = (): void => {
        setActionMenuToggled(!isActionMenuToggled);
    };

    const onToggleExpand = (): void => {
        const newExpanded: boolean = !isExpanded;
        lss.setConfigProperty("editor-context.isExpanded", "" + newExpanded);
        setExpanded(newExpanded);
    };

    const onActionMenuSelect = (event?: React.MouseEvent<Element, MouseEvent>): void => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const action: string = event?.target.attributes["data-id"].value;
        setActionMenuToggled(false);
        switch (action) {
            case "action-compare":
                props.onCompareContent();
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
        }
    };

    const hasFileContext = (): boolean => {
        return originEvent?.data.import?.file !== undefined;
    };

    const hasUrlContext = (): boolean => {
        return originEvent?.data.import?.url !== undefined;
    };

    useEffect(() => {
        if (props.design) {
            designService.getFirstEvent(props.design.id).then(event => {
                setOriginEvent(event);
            }).catch(error => {
                // FIXME handle errors
                console.error(error);
            });
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
                    {/*<Moment date={props.design?.modifiedOn} fromNow={true} />*/}
                </div>
                <div className="editor-context-actions">
                    <Dropdown
                        onSelect={onActionMenuSelect}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle ref={toggleRef} onClick={onActionMenuToggle} isExpanded={isActionMenuToggled}>
                                Dropdown
                            </MenuToggle>
                        )}
                        style={{ zIndex: 1000 }}
                        isOpen={isActionMenuToggled}
                        isPlain
                    >
                        {
                            menuItems
                        }
                    </Dropdown>
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
                                    <ArtifactTypeIcon type={props.design?.type} isShowLabel={true} isShowIcon={true} />
                                </DescriptionListDescription>
                            </DescriptionListGroup>
                            <If condition={hasFileContext}>
                                <DescriptionListGroup>
                                    <DescriptionListTerm>File name</DescriptionListTerm>
                                    <DescriptionListDescription>
                                        <span>{originEvent?.data.import?.file}</span>
                                    </DescriptionListDescription>
                                </DescriptionListGroup>
                            </If>
                            <If condition={hasUrlContext}>
                                <DescriptionListGroup>
                                    <DescriptionListTerm>URL</DescriptionListTerm>
                                    <DescriptionListDescription>
                                        <a href={originEvent?.data.import?.url}>{originEvent?.data.import?.url}</a>
                                    </DescriptionListDescription>
                                </DescriptionListGroup>
                            </If>
                        </DescriptionList>
                    </div>
                </div>
            </If>
        </React.Fragment>
    );
};
