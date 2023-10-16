import React, { FunctionComponent } from "react";
import { DesignEventType } from "./DesignEventType";
import { DesignEvent } from "@models/designs";
import { DateTime, IfNotEmpty } from "@app/components";
import "./DesignHistory.css";

/**
 * Properties
 */
export type DesignHistoryProps = {
    events: DesignEvent[] | undefined;
};

export const DesignHistory: FunctionComponent<DesignHistoryProps> = ({ events }: DesignHistoryProps) => {
    return (
        <IfNotEmpty collection={events}>
            <div className="history">
                {
                    events?.map((event, idx) => (
                        <React.Fragment key={idx}>
                            <div className="event-type" key={`${idx}-type`}><DesignEventType event={event} /></div>
                            <div className="event-time" key={`${idx}-time`}><DateTime date={event.on} /></div>
                        </React.Fragment>
                    ))
                }
            </div>
        </IfNotEmpty>
    );
};
