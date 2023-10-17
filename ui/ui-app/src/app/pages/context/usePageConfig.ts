import { useContext } from "react";
import { PageConfig, PageConfigContext } from "@app/pages";

export const usePageConfig: () => PageConfig = (): PageConfig => {
    return useContext(PageConfigContext);
};
