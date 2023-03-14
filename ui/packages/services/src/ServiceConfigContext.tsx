import React, { useContext } from "react";

export type RegistryServiceConfigType = {
    api: string;
};

export type AuthConfig = {
    getUsername: () => Promise<string> | undefined;
    getToken: () => Promise<string> | undefined;
};

export type ServiceConfig = {
    registry: RegistryServiceConfigType;
    auth: AuthConfig;
};

const defaultGetToken: (() => (Promise<string> | undefined)) = () => {
    return undefined;
};
const defaultGetUsername: (() => (Promise<string> | undefined)) = () => {
    return undefined;
};

export const ServiceConfigContext: React.Context<ServiceConfig> = React.createContext({
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
