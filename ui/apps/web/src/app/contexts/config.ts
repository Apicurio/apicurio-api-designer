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

export type NavType = {
    show: boolean;
    registry: string;
};

export type ComponentsType = {
    masthead: MastheadType;
    editors: EditorsType;
    nav: NavType;
};

export type ApisType = {
    designer: string;
    registry: string;
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

export const ApiDesignerConfigContext = createContext<ApiDesignerConfigType | undefined>(
    ApiDesignerConfig
);
export const useApiDesignerConfig = (): ApiDesignerConfigType | undefined =>
    useContext(ApiDesignerConfigContext);