import { DesignContext } from "./DesignContext";

export interface Design {

    id: string;
    type: string;
    name: string;
    description: string|undefined;
    createdBy: string;
    createdOn: Date;
    modifiedBy: string;
    modifiedOn: Date;
    origin: DesignContext;

}
