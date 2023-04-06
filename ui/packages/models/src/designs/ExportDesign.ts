import { Design } from "./Design";
import { RegistryArtifactCoordinates } from "../rhosr-instance";

export enum ExportType {
    FILE,
    REGISTRY
}

export interface ExportDesign {
    type: ExportType;
    to: any;
    design: Design;
    registry?: RegistryArtifactCoordinates;
}
