import React from "react";

export type DesignsServiceConfigType = {
    type: string;
    api: string;
};

export type NavigationServiceConfigType = {
    basename: string;
};

export type AuthConfig = {
    getUsername: () => Promise<string> | undefined;
    getToken: () => Promise<string> | undefined;
};

export type ServiceConfig = {
    designs: DesignsServiceConfigType;
    navigation: NavigationServiceConfigType;
    auth: AuthConfig;
};

const defaultGetToken: (() => (Promise<string> | undefined)) = () => {
    return undefined;
};
const defaultGetUsername: (() => (Promise<string> | undefined)) = () => {
    return undefined;
};

export const ServiceConfigContext: React.Context<ServiceConfig> = React.createContext({
    designs: {
        type: "",
        api: ""
    },
    navigation: {
        basename: ""
    },
    auth: {
        getToken: defaultGetToken,
        getUsername: defaultGetUsername
    }
});
