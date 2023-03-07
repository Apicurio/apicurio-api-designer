import { SearchedArtifact } from "./SearchedArtifact";

export interface ArtifactSearchResults {
    artifacts: SearchedArtifact[];
    count: number;
    page: number;
    pageSize: number;
}
