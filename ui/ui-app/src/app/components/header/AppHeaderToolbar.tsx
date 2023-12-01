import { FunctionComponent, useState } from "react";
import { Button, Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem } from "@patternfly/react-core";
import { QuestionCircleIcon } from "@patternfly/react-icons";
import { AvatarDropdown, IfAuth } from "@app/components";
import { AppAboutModal, BackendInfo, FrontendInfo } from "@apicurio/common-ui-components";
import { ApiDesignerConfigType, useApiDesignerConfig, VersionType } from "@app/contexts/config.ts";


export type AppHeaderToolbarProps = {
    // No properties.
};


export const AppHeaderToolbar: FunctionComponent<AppHeaderToolbarProps> = () => {
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const config: ApiDesignerConfigType | undefined = useApiDesignerConfig();
    const version: VersionType = config?.version as VersionType;

    const frontendInfo: FrontendInfo = {
        ...version
    };
    const fetchBackendInfo = async (): Promise<BackendInfo> => {
        return Promise.resolve({
            name: "TBD",
            description: "TBD",
            version: "TBD",
            builtOn: "TBD",
            digest: "TBD"
        });
    };

    return (
        <>
            <AppAboutModal
                frontendInfo={frontendInfo}
                backendInfo={fetchBackendInfo}
                backendLabel="Designer API info"
                brandImageSrc="/apicurio_apidesigner_icon_reverse.svg"
                brandImageAlt={version.name}
                isOpen={isAboutModalOpen}
                onClose={() => setIsAboutModalOpen(false)} />
            <Toolbar id="app-header-toolbar" isFullHeight={true}>
                <ToolbarContent>
                    <ToolbarGroup align={{ default: "alignRight" }}>
                        <ToolbarItem>
                            <Button variant="plain" onClick={() => setIsAboutModalOpen(!isAboutModalOpen)}>
                                <QuestionCircleIcon style={{ fontSize: "16px" }} />
                            </Button>
                        </ToolbarItem>
                        <ToolbarItem>
                            <IfAuth enabled={true}>
                                <AvatarDropdown />
                            </IfAuth>
                        </ToolbarItem>
                    </ToolbarGroup>
                </ToolbarContent>
            </Toolbar>
        </>
    );

};
