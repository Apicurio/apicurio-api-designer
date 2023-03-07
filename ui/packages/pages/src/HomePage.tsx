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
import { ArtifactTypeIcon } from "@apicurio/apicurio-api-designer-components";
import { CreateDesignModal } from "./components/home/CreateDesignModal";
import { DesignDetailsPanel } from "./components/home/DesignDetailsPanel";
import { ImportDesignModal } from "./components/home/ImportDesignModal";
import { ImportFrom } from "./components/home/ImportDropdown";

export type HomePageProps = Record<string, never>;

export const HomePage: FunctionComponent<HomePageProps> = () => {
    const [ isDrawerExpanded, setDrawerExpanded ] = useState(true);
    const [ isCreateModalOpen, setCreateModalOpen ] = useState(false);
    const [ isImportModalOpen, setImportModalOpen ] = useState(false);
    const [ isImportFromRhosrModalOpen, setImportFromRhosrModalOpen ] = useState(false);
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
            setImportFromRhosrModalOpen(true);
        }
    };

    const createDesign = async (info: CreateDesign, template: Template): Promise<void> => {
        const dc: CreateDesignContent = {
            contentType: template.content.contentType,
            data: cloneObject(template.content.data)
        };
        if (typeof dc.data === "string") {
            dc.data = dc.data.replace("$NAME", info.name).replace("$SUMMARY", info.summary||"");
        } else {
            propertyReplace(dc.data, "$NAME", info.name);
            propertyReplace(dc.data, "$SUMMARY", info.summary||"");
        }
        return designsSvc.createDesign(info, dc).then((design: Design) => {
            setCreateModalOpen(false);
            nav.navigateTo(`/designs/${design.id}/editor`);
        }).catch((error: any) => {
            // TODO handle error
            console.error(error);
        });
    };

    const importDesign = async (cd: CreateDesign, content: CreateDesignContent): Promise<void> => {
        return designsSvc.createDesign(cd, content).then((design) => {
            setImportModalOpen(false);
            nav.navigateTo(`/designs/${design.id}/editor`);
        }).catch(error => {
            // TODO handle error
            console.error(error);
        });
    };

    // The content of the side panel.  This should be a details panel with metadata and history (for example).
    const panelContent: React.ReactNode = (
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
                            <div className="design-icon"><ArtifactTypeIcon type={selectedDesign?.type||"AVRO"} /></div>
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
                        <PageSection variant={PageSectionVariants.light} className="summary pf-m-padding-on-xl">
                            <TextContent>
                                <Text component="h1" className="title">API and Schema Designs</Text>
                                <Text component="p" className="description">
                                    API Designer is a tool to design your APIs (OpenAPI, AsyncAPI) and schemas
                                    (Apache Avro, Google Protobuf, JSON Schema). Manage your collection of API and
                                    schema designs by creating, importing, and editing. Save your work by downloading
                                    your designs locally or by exporting them to OpenShift Service Registry.
                                </Text>
                            </TextContent>
                            <CreateDesignModal isOpen={isCreateModalOpen} onCreate={createDesign} onCancel={() => {setCreateModalOpen(false);}} />
                            <ImportDesignModal isOpen={isImportModalOpen} onImport={importDesign} onCancel={() => {setImportModalOpen(false);}}
                                importType={importType} />
                            {/*<ImportFromRhosrModal isOpen={isImportFromRhosrModalOpen} onImport={importDesign} onCancel={() => {setImportFromRhosrModalOpen(false);}} />*/}
                        </PageSection>
                        <PageSection variant={PageSectionVariants.default} isFilled={true}>
                            <h1>DESIGNS GO HERE</h1>
                            {/*<DesignsPanel onCreate={() => {setCreateModalOpen(true);}}*/}
                            {/*    onDesignSelected={onDesignSelected}*/}
                            {/*    selectedDesign={selectedDesign}*/}
                            {/*    onImport={onImport} />*/}
                        </PageSection>
                    </DrawerContentBody>
                </DrawerContent>
            </Drawer>
        </React.Fragment>
    );
};
