export interface SearchedVersion {

    globalId: number;
    contentId: number|null;
    version: string;
    type: string;
    state: string;
    name: string;
    description: string;
    labels: string[];
    createdOn: Date;
    createdBy: string;

}
