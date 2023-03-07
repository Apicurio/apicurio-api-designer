import { Basename, useBasename } from "@rhoas/app-services-ui-shared";
import { History } from "history";
import { useHistory } from "react-router-dom";

export const navigateTo: (path: string, basename: Basename, history: History) => void = (path: string, basename: Basename, history: History) => {
    const to: string = `${basename.getBasename()}${path}`;
    setTimeout(() => {
        history.push(to);
    }, 50);
};

export type NavigationService = {
    navigateTo: (path: string) => void;
};

export const useNavigation: () => NavigationService = (): NavigationService => {
    const history: History = useHistory();
    const basename: Basename = useBasename();

    return {
        navigateTo: (path: string) => {
            return navigateTo(path, basename, history);
        }
    };
};
