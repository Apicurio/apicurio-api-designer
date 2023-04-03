import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import {
    Drawer,
    DrawerActions,
    DrawerCloseButton,
    DrawerContent,
    DrawerContentBody,
    DrawerHead,
    DrawerPanelBody,
    DrawerPanelContent,
    PageSection,
    PageSectionVariants,
    Text,
    TextContent,
    TextVariants,
    Title,
    TitleSizes
} from "@patternfly/react-core";
import { CreateDesign, CreateDesignContent, Design, Template } from "@apicurio/apicurio-api-designer-models";
import { DesignsService, useDesignsService } from "@apicurio/apicurio-api-designer-services";
import { NavigationService, useNavigation } from "@apicurio/apicurio-api-designer-services/src/NavigationService";
import { cloneObject, propertyReplace } from "@apicurio/apicurio-api-designer-utils";
import { CreateDesignModal } from "./components/home/CreateDesignModal";
import { DesignDetailsPanel } from "./components/home/DesignDetailsPanel";
import { ImportDesignModal } from "./components/home/ImportDesignModal";
import { ImportFrom } from "./components/home/ImportDropdown";
import { DesignsPanel } from "./components/home/DesignsPanel";
import { ImportFromRegistryModal } from "./components/home/ImportFromRegistryModal";
import { ErrorModal } from "./components/common/ErrorModal";

export type HomePageProps = Record<string, never>;

export const HomePage: FunctionComponent<HomePageProps> = () => {
    const [ error, setError ] = useState<any>();
    const [ isCreating, setCreating ] = useState<boolean>(false);
    const [ isImporting, setImporting ] = useState<boolean>(false);
    const [ isDrawerExpanded, setDrawerExpanded ] = useState(true);
    const [ isCreateModalOpen, setCreateModalOpen ] = useState(false);
    const [ isImportModalOpen, setImportModalOpen ] = useState(false);
    const [ isImportFromRegistryModalOpen, setImportFromRegistryModalOpen ] = useState(false);
    const [ importType, setImportType ] = useState<ImportFrom>(ImportFrom.FILE);
    const [ selectedDesign, setSelectedDesign ] = useState<Design>();

    const drawerRef: any = useRef<HTMLSpanElement>();

    const designsSvc: DesignsService = useDesignsService();
    const nav: NavigationService = useNavigation();

    useEffect(() => {
        console.info("[HomePageProps] --- API Designer UI i-17");
    }, []);

    const onDrawerExpand = (): void => {
        drawerRef.current && drawerRef.current.focus();
    };

    const onDesignSelected = (design: Design | undefined): void => {
        setSelectedDesign(design);
        if (design) {
            setDrawerExpanded(true);
        } else {
            setDrawerExpanded(false);
        }
    };

    const onImport = (from: ImportFrom): void => {
        setImportType(from);
        if (from !== ImportFrom.RHOSR) {
            setImportModalOpen(true);
        } else {
            setImportFromRegistryModalOpen(true);
        }
    };

    const createDesign = async (info: CreateDesign, template: Template): Promise<void> => {
        const dc: CreateDesignContent = {
            contentType: template.content.contentType,
            data: cloneObject(template.content.data)
        };
        if (typeof dc.data === "string") {
            dc.data = dc.data.replace("$NAME", info.name).replace("$SUMMARY", info.description||"");
        } else {
            propertyReplace(dc.data, "$NAME", info.name);
            propertyReplace(dc.data, "$SUMMARY", info.description||"");
        }
        setCreating(true);
        return designsSvc.createDesign(info, dc).then((design: Design) => {
            setCreating(false);
            setCreateModalOpen(false);
            nav.navigateTo(`/designs/${design.id}/editor`);
        }).catch((error: any) => {
            console.error(error);
            setCreateModalOpen(false);
            setCreating(false);
            setError(error);
        });
    };

    const importDesign = async (cd: CreateDesign, content: CreateDesignContent): Promise<void> => {
        setImporting(true);
        return designsSvc.createDesign(cd, content).then((design) => {
            setImporting(false);
            setImportModalOpen(false);
            nav.navigateTo(`/designs/${design.id}/editor`);
        }).catch((error: any) => {
            console.error(error);
            setImporting(false);
            setImportModalOpen(false);
            setError(error);
        });
    };

    // The content of the side panel.  This should be a details panel with metadata and history (for example).
    const panelContent: any = (
        <DrawerPanelContent>
            <DrawerHead>
                <TextContent>
                    <Text component={TextVariants.small} className="pf-u-mb-0">
                        Name
                    </Text>
                    <Title
                        headingLevel="h2"
                        size={TitleSizes["xl"]}
                        className="pf-u-mt-0"
                    >
                        <div className="design-details-header">
                            <div className="design-name">{selectedDesign?.name}</div>
                        </div>
                    </Title>
                </TextContent>
                <DrawerActions>
                    <DrawerCloseButton onClick={() => onDesignSelected(undefined)} />
                </DrawerActions>
            </DrawerHead>
            <DrawerPanelBody>
                <DesignDetailsPanel design={selectedDesign} />
            </DrawerPanelBody>
        </DrawerPanelContent>
    );

    return (
        <React.Fragment>
            <Drawer isStatic={false} position="right" isInline={false} isExpanded={isDrawerExpanded} onExpand={onDrawerExpand}>
                <DrawerContent panelContent={panelContent}>
                    <DrawerContentBody className="home-panel-body">
                        <PageSection variant={PageSectionVariants.light} className="description pf-m-padding-on-xl">
                            <TextContent>
                                <Text component="h1" className="title">API and Schema Designs</Text>
                                <Text component="p" className="description">
                                    API Designer is a tool to design your APIs (OpenAPI, AsyncAPI) and schemas
                                    (Apache Avro, Google Protobuf, JSON Schema). Manage your collection of API and
                                    schema designs by creating, importing, and editing. Save your work by downloading
                                    your designs locally or by exporting them to OpenShift Service Registry.
                                </Text>
                            </TextContent>
                            <CreateDesignModal isOpen={isCreateModalOpen} onCreate={createDesign}
                                isCreating={isCreating}
                                onCancel={() => {setCreateModalOpen(false);}} />
                            <ImportDesignModal isOpen={isImportModalOpen} onImport={importDesign}
                                isImporting={isImporting}
                                onCancel={() => {setImportModalOpen(false);}}
                                importType={importType} />
                            <ImportFromRegistryModal isOpen={isImportFromRegistryModalOpen} onImport={importDesign}
                                isImporting={isImporting}
                                onCancel={() => {setImportFromRegistryModalOpen(false);}} />
                            <ErrorModal title={"Error detected"} message={undefined} error={error} isOpen={error !== undefined} onClose={() => setError(undefined)} />
                        </PageSection>
                        <PageSection variant={PageSectionVariants.default} isFilled={true}>
                            <DesignsPanel onCreate={() => {setCreateModalOpen(true);}}
                                onDesignSelected={onDesignSelected}
                                selectedDesign={selectedDesign}
                                onImport={onImport} />
                        </PageSection>
                    </DrawerContentBody>
                </DrawerContent>
            </Drawer>
        </React.Fragment>
    );
};
