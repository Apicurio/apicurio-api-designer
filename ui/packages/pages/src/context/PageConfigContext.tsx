import React, { FunctionComponent, useContext } from "react";
import { ServiceConfig, ServiceConfigContext } from "@apicurio/apicurio-api-designer-services";

export type PageConfig = {
    serviceConfig: ServiceConfig;
};

const PageConfigContext: React.Context<PageConfig> = React.createContext({
    serviceConfig: {
        getBasename: () => {
            return "";
        }
    }
});

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
                <React.Fragment children={children} />
            </ServiceConfigContext.Provider>
        </PageConfigContext.Provider>
    );
};
