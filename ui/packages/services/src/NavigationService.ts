import { History } from "history";
import { useHistory } from "react-router-dom";
import { ServiceConfig, useServiceConfig } from "./ServiceConfigContext";

export const navigateTo: (path: string, svcConfig: ServiceConfig, history: History) => void = (path: string, svcConfig: ServiceConfig, history: History) => {
    const to: string = `${svcConfig.getBasename()}${path}`;
    setTimeout(() => {
        history.push(to);
    }, 50);
};

export type NavigationService = {
    navigateTo: (path: string) => void;
};

export const useNavigation: () => NavigationService = (): NavigationService => {
    const history: History = useHistory();
    const svcConfig: ServiceConfig = useServiceConfig();

    return {
        navigateTo: (path: string) => {
            return navigateTo(path, svcConfig, history);
        }
    };
};
