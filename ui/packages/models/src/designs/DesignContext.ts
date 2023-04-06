import { RegistryArtifactCoordinates } from "../rhosr-instance";

export type DesignContextType = "create" | "file" | "url" | "registry";

export interface DesignContextFile {
    fileName: string;
}

export interface DesignContextUrl {
    url: string;
}

export interface DesignContext {

    type: DesignContextType;
    file?: DesignContextFile;
    url?: DesignContextUrl;
    registry?: RegistryArtifactCoordinates;

}
