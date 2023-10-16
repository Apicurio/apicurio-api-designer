import { createContext, useContext } from "react";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any;
};

export type ApiDesignerConfigType = {
    apis: ApisType;
    ui: UiType;
    components: ComponentsType;
    auth: AuthType;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const apiDesignerConfig: ApiDesignerConfigType = (ApiDesignerConfig || window["ApiDesignerConfig"]) as ApiDesignerConfigType;

export const ApiDesignerConfigContext = createContext<ApiDesignerConfigType | undefined>(
    apiDesignerConfig
);
export const useApiDesignerConfig = (): ApiDesignerConfigType | undefined =>
    useContext(ApiDesignerConfigContext);