import * as React from 'react';
import { PageSection, Title } from '@patternfly/react-core';
import { ArtifactTypeIcon } from "@apicurio/apicurio-api-designer-components";
import { ArtifactTypes } from "@apicurio/apicurio-api-designer-models";

const Dashboard: React.FunctionComponent = () => (
        <PageSection>
            <Title headingLevel="h1" size="lg">Dashboard Page Title!</Title>
            <ArtifactTypeIcon type={ArtifactTypes.AVRO} isShowLabel={true} isShowIcon={true} />
        </PageSection>
)

export { Dashboard };
