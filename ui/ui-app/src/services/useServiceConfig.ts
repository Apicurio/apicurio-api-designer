import { useContext } from "react";
import { ServiceConfig, ServiceConfigContext } from "@services/ServiceConfigContext";

export const useServiceConfig: () => ServiceConfig = (): ServiceConfig => {
    return useContext(ServiceConfigContext);
};
