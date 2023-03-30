import React, { FunctionComponent, useContext } from "react";
import { AlertProps, ServiceConfig, ServiceConfigContext } from "@apicurio/apicurio-api-designer-services";
import { EditorConfig, EditorConfigContext } from "@apicurio/apicurio-api-designer-editors";

export type PageConfig = {
    serviceConfig: ServiceConfig;
    editorConfig: EditorConfig;
};

const defaultPageConfig: PageConfig = {
    editorConfig: {
        asyncApiEditorUrl: "",
        openApiEditorUrl: ""
    },
    serviceConfig: {
        alerts: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            addAlert: (_: AlertProps) => {
                return;
            }
        },
        designs: {
            type: "",
            api: ""
        },
        auth: {
            getToken: () => {
                return undefined;
            },
            getUsername: () => {
                return undefined;
            }
        },
        navigation: {
            basename: ""
        },
        registry: {
            api: ""
        }
    }
};

const PageConfigContext: React.Context<PageConfig> = React.createContext(defaultPageConfig);

export const usePageConfig: () => PageConfig = (): PageConfig => {
    return useContext(PageConfigContext);
};

/**
 * Properties
 */
export type PageContextProviderProps = {
    value: PageConfig;
    children?: React.ReactNode;
};

/**
 * A custom context provider for the page context.
 * @param value
 * @constructor
 */
export const PageContextProvider: FunctionComponent<PageContextProviderProps> = ({ value, children }: PageContextProviderProps) => {

    return (
        <PageConfigContext.Provider value={value}>
            <ServiceConfigContext.Provider value={value.serviceConfig}>
                <EditorConfigContext.Provider value={value.editorConfig}>
                    <React.Fragment children={children} />
                </EditorConfigContext.Provider>
            </ServiceConfigContext.Provider>
        </PageConfigContext.Provider>
    );
};
