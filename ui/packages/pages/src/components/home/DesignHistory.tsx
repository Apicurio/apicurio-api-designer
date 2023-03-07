import React, { FunctionComponent, useEffect, useState } from "react";
import { Design, DesignEvent } from "@apicurio/apicurio-api-designer-models";
import { DesignsService, useDesignsService } from "@apicurio/apicurio-api-designer-services";
import { DateTime, IfNotEmpty, IsLoading } from "@apicurio/apicurio-api-designer-components";
import { DesignEventType } from "./DesignEventType";
import styled from "styled-components";

/**
 * Properties
 */
export type DesignHistoryProps = {
    design: Design;
};

const History = styled.div`
    margin-top: 20px;
    display: grid;
    grid-template-columns: auto min-content;
    font-size: 14px;
`;
const EventType = styled.div`
    margin-bottom: 5px;
    overflow: hidden;
`;
const EventTime = styled.div`
    color: #999;
    white-space: nowrap;
`;

export const DesignHistory: FunctionComponent<DesignHistoryProps> = ({ design }: DesignHistoryProps) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [events, setEvents] = useState<DesignEvent[]>();

    const designsService: DesignsService = useDesignsService();

    useEffect(() => {
        if (design) {
            designsService.getEvents(design.id).then(events => {
                setEvents(events);
                setLoading(false);
            }).catch(() => {
                // TODO error handling!
            });
        }
    }, [design]);
    return (
        <IsLoading condition={isLoading}>
            <IfNotEmpty collection={events}>
                <History>
                    {
                        events?.map((event, idx) => (
                            <React.Fragment key={idx}>
                                <EventType key={`${idx}-type`}><DesignEventType event={event} /></EventType>
                                <EventTime key={`${idx}-time`}><DateTime date={event.on} /></EventTime>
                            </React.Fragment>
                        ))
                    }
                </History>
            </IfNotEmpty>
        </IsLoading>
    );
};
