import { createContext, useContext } from "react";

export type EditorsType = {
    url: string;
}

export type NavType = {
    show: boolean;
    registry: string;
}

export type ComponentsType = {
    editors: EditorsType;
    nav: NavType;
}

export type ApisType = {
    registry: string;
}

export type AuthType = {
    enabled: boolean;
}

export type ApiDesignerConfig = {
    apis: ApisType;
    components: ComponentsType;
    auth: AuthType;
}

export const ApiDesignerConfigContext = createContext<ApiDesignerConfig | undefined>(
    undefined
);
export const useApiDesignerConfig = (): ApiDesignerConfig | undefined =>
    useContext(ApiDesignerConfigContext);
