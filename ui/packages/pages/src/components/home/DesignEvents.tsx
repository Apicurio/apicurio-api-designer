import React, { FunctionComponent, useEffect, useState } from "react";
import { Divider } from "@patternfly/react-core";
import { Design, DesignEvent } from "@apicurio/apicurio-api-designer-models";
import { DesignsService, useDesignsService } from "@apicurio/apicurio-api-designer-services";
import { DesignOriginLabel } from "./DesignOriginLabel";
import { DateTime, If, IfNotEmpty, IsLoading } from "@apicurio/apicurio-api-designer-components";
import { hasOrigin } from "@apicurio/apicurio-api-designer-utils";
import { DesignEventType } from "./DesignEventType";
import styled from "styled-components";


export type DesignEventsProps = {
    design: Design | undefined;
    events: DesignEvent[] | undefined;
};

const Origin = styled.div`
    display: grid;
    grid-template-columns: min-content auto;
    margin-top: 20px;
    font-size: 15px;
`;
const OriginLabel = styled.div`
    padding-right: 15px;
    font-weight: bold;
    margin-bottom: 8px;
    white-space: nowrap;
`;
const OriginValue = styled.div`
    margin-bottom: 8px;
`;
const OriginColSpan = styled.div`
    grid-column: 1 / span 2;
`;

const StyledDivider = styled(Divider)`
    margin-top: 20px;
    margin-bottom: 20px;
`;

const OriginExports = styled.div`
    display: grid;
    grid-template-columns: auto min-content;
    font-size: 15px;
`;
const OriginExportsLabel = styled.div`
    padding-right: 15px;
    font-weight: bold;
    margin-bottom: 8px;
    white-space: nowrap;
`;
const OriginExportsItem = styled.div`
    margin-bottom: 8px;
    overflow: hidden;
`;
const OriginExportsTime = styled.div`
    margin-bottom: 8px;
    color: #999;
    white-space: nowrap;
`;


export const DesignEvents: FunctionComponent<DesignEventsProps> = ({ design, events }: DesignEventsProps) => {
    const [exports, setExports] = useState<DesignEvent[]>();
    const [originEvent, setOriginEvent] = useState<DesignEvent>();

    const originGroupId = (): string => {
        return originEvent?.data?.register?.registry?.groupId || "default";
    };
    const originArtifactId = (): string => {
        return originEvent?.data?.register?.registry?.artifactId || "unknown";
    };
    const originVersion = (): string => {
        return originEvent?.data?.register?.registry?.version || "latest";
    };
    const originFilename = (): string => {
        return originEvent?.data?.import?.file || "";
    };
    const originUrl = (): string => {
        return originEvent?.data?.import?.url || "";
    };

    useEffect(() => {
        if (events) {
            // Extract just the "register" events (events related to exporting).
            setExports(events?.filter(event => event.type === "REGISTER"));
            // The origin event is the oldest (first) event.
            setOriginEvent(events.slice(-1)[0]);
        }
    }, [events]);

    return (
        <React.Fragment>
            <Origin>
                <OriginLabel>Origin</OriginLabel>
                <OriginValue>
                    <DesignOriginLabel design={design} />
                </OriginValue>

                <OriginLabel>Time created</OriginLabel>
                <OriginValue><DateTime date={design?.createdOn} /></OriginValue>

                <If condition={hasOrigin(design, "registry")}>
                    <OriginLabel>Group</OriginLabel>
                    <OriginValue>{originGroupId()}</OriginValue>

                    <OriginLabel>ID</OriginLabel>
                    <OriginValue>{originArtifactId()}</OriginValue>

                    <OriginLabel>Version</OriginLabel>
                    <OriginValue>{originVersion()}</OriginValue>

                    <OriginColSpan>
                        {/*<RegistryNavLink context={design?.origin}>View artifact in Service Registry</RegistryNavLink>*/}
                    </OriginColSpan>
                </If>

                <If condition={hasOrigin(design, "file")}>
                    <OriginLabel>File name</OriginLabel>
                    <OriginValue>{originFilename()}</OriginValue>
                </If>

                <If condition={hasOrigin(design, "url")}>
                    <OriginLabel>URL</OriginLabel>
                    <OriginValue>
                        <a href={originUrl()}>{originUrl()}</a>
                    </OriginValue>
                </If>
            </Origin>
            <StyledDivider />
            <OriginExports>
                <OriginExportsLabel>Exported to</OriginExportsLabel>
                <div></div>

                <IfNotEmpty collection={exports} emptyState={(
                    <span>This design has not been exported.</span>
                )}>
                    {
                        exports?.map((event, idx) => (
                            <React.Fragment key={idx}>
                                <OriginExportsItem key={`${idx}-type`}><DesignEventType event={event} variant="short" /></OriginExportsItem>
                                <OriginExportsTime key={`${idx}-time`}><DateTime date={event.on} /></OriginExportsTime>
                            </React.Fragment>
                        ))
                    }
                </IfNotEmpty>
            </OriginExports>
        </React.Fragment>
    );
};
