import React, { FunctionComponent, useEffect, useState } from "react";
import { Tab, Tabs, TabTitleText } from "@patternfly/react-core";
import { Design, DesignEvent } from "@apicurio/apicurio-api-designer-models";
import { DesignDescription } from "../common/DesignDescription";
import { ArtifactTypeIcon, DateTime, IsLoading } from "@apicurio/apicurio-api-designer-components";
import { DesignOriginLabel } from "./DesignOriginLabel";
import styled from "styled-components";
import { DesignEvents } from "./DesignEvents";
import { DesignHistory } from "./DesignHistory";
import { DesignsService, useDesignsService } from "@apicurio/apicurio-api-designer-services";

/**
 * Properties
 */
export type DesignDetailsPanelProps = {
    design: Design | undefined;
};

const Grid = styled.div`
    display: grid;
    grid-template-columns: min-content auto;
    margin-top: 20px;
`;
const GridLabel = styled.div`
    font-size: 15px;
    padding-right: 15px;
    font-weight: bold;
    margin-bottom: 8px;
    white-space: nowrap;
`;
const GridValue = styled.div`
    font-size: 15px;
    margin-bottom: 8px;
`;

/**
 * Details panel with metadata and history about a single selected design.
 */
export const DesignDetailsPanel: FunctionComponent<DesignDetailsPanelProps> = ({ design }: DesignDetailsPanelProps) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [events, setEvents] = useState<DesignEvent[]>();
    const [activeTabKey, setActiveTabKey] = useState<string>("details");

    const designsService: DesignsService = useDesignsService();

    useEffect(() => {
        if (design) {
            designsService.getEvents(design.id).then(events => {
                setEvents(events);
                setLoading(false);
            }).catch(error => {
                // TODO error handling!
            });
        }
    }, [design]);

    return (
        <IsLoading condition={isLoading}>
            <Tabs
                activeKey={activeTabKey}
                onSelect={(event, eventKey) => {setActiveTabKey(eventKey as string);}}
                aria-label="Design panel detail tabs"
            >
                <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>}>
                    <Grid>
                        <GridLabel>Description</GridLabel>
                        <DesignDescription className="design-details-value" description={design?.description} />

                        <GridLabel>Type</GridLabel>
                        <GridValue>
                            <ArtifactTypeIcon type={design?.type as string} isShowLabel={true} isShowIcon={true} />
                        </GridValue>

                        <GridLabel>Time created</GridLabel>
                        <GridValue><DateTime date={design?.createdOn} /></GridValue>

                        <GridLabel>Time updated</GridLabel>
                        <GridValue><DateTime date={design?.modifiedOn} /></GridValue>

                        <GridLabel>Origin</GridLabel>
                        <GridValue>
                            <DesignOriginLabel design={design} />
                        </GridValue>
                    </Grid>
                </Tab>
                <Tab eventKey="events" title={<TabTitleText>Events</TabTitleText>}>
                    <DesignEvents design={design} events={events} />
                </Tab>
                <Tab eventKey="history" title={<TabTitleText>History</TabTitleText>}>
                    <DesignHistory events={events} />
                </Tab>
            </Tabs>
        </IsLoading>
    );
};
