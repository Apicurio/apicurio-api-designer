import { NavigateFunction, useNavigate } from "react-router-dom";
import { useServiceConfig } from "@services/useServiceConfig";
import { ServiceConfig } from "@services/ServiceConfigContext";

export const navigateTo: (path: string, svcConfig: ServiceConfig, navigateFunc: NavigateFunction) => void = (path: string, svcConfig: ServiceConfig, navigateFunc: NavigateFunction) => {
    const to: string = `${svcConfig.navigation.basename}${path}`;
    console.debug("[NavigationService] Navigating to: ", to);
    setTimeout(() => {
        navigateFunc(to);
    }, 50);
};

export type NavigationService = {
    navigateTo: (path: string) => void;
    createLink: (path: string) => string;
};

export const useNavigation: () => NavigationService = (): NavigationService => {
    const navigate: NavigateFunction = useNavigate();
    const svcConfig: ServiceConfig = useServiceConfig();

    return {
        navigateTo: (path: string) => {
            return navigateTo(path, svcConfig, navigate);
        },
        createLink: (path: string) => {
            return `${svcConfig.navigation.basename}${path}`;
        },
    };
};
