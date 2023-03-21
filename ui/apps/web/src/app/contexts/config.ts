import { createContext, useContext } from "react";

export type EditorsType = {
    url: string;
};

export type UiType = {
    basename: string;
};

export type NavType = {
    show: boolean;
    registry: string;
};

export type ComponentsType = {
    editors: EditorsType;
    nav: NavType;
};

export type ApisType = {
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
    undefined
);
export const useApiDesignerConfig = (): ApiDesignerConfigType | undefined =>
    useContext(ApiDesignerConfigContext);
