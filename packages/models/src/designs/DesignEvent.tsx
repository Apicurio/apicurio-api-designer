
export type DesignEventType = "create" | "import" | "update" | "download" | "register";

export interface DesignEvent {

    eventId?: string;
    id: string;
    type: DesignEventType;
    on: Date;
    data: any;

}
