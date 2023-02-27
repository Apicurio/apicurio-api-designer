import React from "react";
import { EmptyState, EmptyStateIcon, Spinner, Title } from "@patternfly/react-core";
import { BrowserRouter as Router } from "react-router-dom";
import { AppLayout } from "./app-layout";
import { AppRoutes } from "./routes";

import "./app.css";

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/utilities/Accessibility/accessibility.css";
import "@patternfly/patternfly/utilities/Sizing/sizing.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Display/display.css";
import "@patternfly/patternfly/utilities/Flex/flex.css";


const App: React.FunctionComponent = () => {
    const loadingState: React.ReactNode = (
        <EmptyState>
            <EmptyStateIcon variant="container" component={Spinner} />
            <Title size="lg" headingLevel="h4">
                Loading
            </Title>
        </EmptyState>
    );

    return (
        <Router>
            <React.Suspense fallback={loadingState}>
                <AppLayout>
                    <AppRoutes/>
                </AppLayout>
            </React.Suspense>
        </Router>
    );
};

export default App;
