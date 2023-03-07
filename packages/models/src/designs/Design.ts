import { DesignContext } from "./DesignContext";

export interface Design {

    id: string;
    type: string;
    name: string;
    summary: string|undefined;
    createdOn: Date;
    modifiedOn: Date;
    origin: DesignContext;

}
