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
    events: DesignEvent[] | undefined;
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

export const DesignHistory: FunctionComponent<DesignHistoryProps> = ({ events }: DesignHistoryProps) => {
    return (
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
    );
};
