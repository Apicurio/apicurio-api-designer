import { DesignContext } from "./DesignContext";

export interface CreateDesign {

    type: string;
    name: string;
    description: string | undefined;
    context: DesignContext;

}
