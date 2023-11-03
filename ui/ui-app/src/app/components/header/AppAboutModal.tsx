import { FunctionComponent } from "react";
import { AboutModal, TextContent, TextList, TextListItem } from "@patternfly/react-core";
import { ApiDesignerConfigType, useApiDesignerConfig, VersionType } from "@app/contexts/config.ts";


export type AppAboutModalProps = {
    isOpen: boolean;
    onClose: () => void;
};


export const AppAboutModal: FunctionComponent<AppAboutModalProps> = (props: AppAboutModalProps) => {
    const config: ApiDesignerConfigType | undefined = useApiDesignerConfig();
    const version: VersionType = config?.version as VersionType;

    return (
        <AboutModal
            isOpen={props.isOpen}
            onClose={props.onClose}
            trademark="&copy; 2024 Red Hat"
            brandImageSrc="/apicurio_apidesigner_icon_reverse.svg"
            brandImageAlt={version.name}
            productName={version.name}
        >
            <TextContent>
                <TextList component="dl">
                    <TextListItem component="dt">Project</TextListItem>
                    <TextListItem component="dd"><a href={version.url} target="_blank">{ version.name }</a></TextListItem>

                    <TextListItem component="dt">Version</TextListItem>
                    <TextListItem component="dd">{ version.version }</TextListItem>

                    <TextListItem component="dt">Built on</TextListItem>
                    <TextListItem component="dd">{ "" + version.builtOn }</TextListItem>

                    <TextListItem component="dt">Digest</TextListItem>
                    <TextListItem component="dd">{ version.digest }</TextListItem>
                </TextList>
            </TextContent>
        </AboutModal>
    );
};
