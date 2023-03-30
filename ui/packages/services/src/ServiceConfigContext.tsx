import React, { useContext } from "react";

export class AlertVariant {
    static success: string = "success";
    static danger: string = "danger";
    static warning: string = "warning";
    static info: string = "info";
    static default: string = "default";
}

export declare type AlertProps = {
    title: string;
    description: string | React.ReactNode;
    variant: string;
    dataTestId: string;
};

export type RegistryServiceConfigType = {
    api: string;
};

export type DesignsServiceConfigType = {
    type: string;
    api: string;
};

export type NavigationServiceConfigType = {
    basename: string;
};

export type AlertsServiceConfigType = {
    addAlert: (props: AlertProps) => void;
};

export type AuthConfig = {
    getUsername: () => Promise<string> | undefined;
    getToken: () => Promise<string> | undefined;
};

export type ServiceConfig = {
    designs: DesignsServiceConfigType;
    alerts: AlertsServiceConfigType;
    navigation: NavigationServiceConfigType;
    registry: RegistryServiceConfigType;
    auth: AuthConfig;
};

const defaultGetToken: (() => (Promise<string> | undefined)) = () => {
    return undefined;
};
const defaultGetUsername: (() => (Promise<string> | undefined)) = () => {
    return undefined;
};

// TODO implement "addAlert()"!

export const ServiceConfigContext: React.Context<ServiceConfig> = React.createContext({
    alerts: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        addAlert: (_: AlertProps) => {return;}
    },
    designs: {
        type: "",
        api: ""
    },
    navigation: {
        basename: ""
    },
    registry: {
        api: ""
    },
    auth: {
        getToken: defaultGetToken,
        getUsername: defaultGetUsername
    }
});

export const useServiceConfig: () => ServiceConfig = (): ServiceConfig => {
    return useContext(ServiceConfigContext);
};
