import { Design } from "./Design";
import { DesignContext } from "./DesignContext";

export enum ExportType {
    FILE,
    REGISTRY
}

export interface ExportDesign {
    type: ExportType;
    to: any;
    design: Design;
    context: DesignContext;
}
