export interface ArtifactMetaData {

    groupId: string|null;
    id: string;
    name: string|null;
    description: string|null;
    labels: string[]|null;
    type: string;
    version: string;
    createdBy: string;
    createdOn: Date;
    modifiedBy: string;
    modifiedOn: Date;
    globalId: number;
    contentId: number|null;
    state: string;

}
