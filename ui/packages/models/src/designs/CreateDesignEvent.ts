import { DesignEventType } from "./DesignEvent";

export interface CreateDesignEvent {

    type: DesignEventType;
    data: any;

}
