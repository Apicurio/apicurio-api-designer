import { DesignContext } from "./DesignContext";

export interface CreateDesign {

    type: string;
    name: string;
    summary: string | undefined;
    context: DesignContext;

}
