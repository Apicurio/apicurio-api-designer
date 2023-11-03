import { createContext, useContext } from "react";
import { getApiDesignerConfig } from "@utils/config.utils.ts";

export type EditorsType = {
    url: string;
};

export type UiType = {
    contextPath: string;
    navPrefixPath: string;
};

export type MastheadType = {
    show: boolean;
    label: string;
};

export type ComponentsType = {
    masthead: MastheadType;
    editors: EditorsType;
};

export type ApisType = {
    designer: string;
};

export type AuthType = {
    type: string;
    options?: any;
};

export interface VersionType {
    name: string;
    version: string;
    digest: string;
    builtOn: string;
    url: string;
}

export type ApiDesignerConfigType = {
    apis: ApisType;
    ui: UiType;
    components: ComponentsType;
    auth: AuthType;
    version?: VersionType;
};

const apiDesignerConfig: ApiDesignerConfigType = getApiDesignerConfig();

export const ApiDesignerConfigContext = createContext<ApiDesignerConfigType | undefined>(
    apiDesignerConfig
);
export const useApiDesignerConfig = (): ApiDesignerConfigType | undefined =>
    useContext(ApiDesignerConfigContext);