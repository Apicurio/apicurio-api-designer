import React, { useEffect, useState } from "react";
import { EmptyState, EmptyStateIcon, Spinner, Title } from "@patternfly/react-core";
import { BrowserRouter as Router } from "react-router-dom";
import { AppLayout } from "./app-layout";
import { AppRoutes } from "./routes";
import { PageConfig, PageContextProvider } from "@apicurio/apicurio-api-designer-pages";
import { getKeycloakInstance, useKeycloakAuth } from "@app/auth";
import { AlertProps, AuthConfig } from "@apicurio/apicurio-api-designer-services";
import { ApiDesignerConfigContext } from "@app/contexts/config";

import "./app.css";

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/utilities/Accessibility/accessibility.css";
import "@patternfly/patternfly/utilities/Sizing/sizing.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Display/display.css";
import "@patternfly/patternfly/utilities/Flex/flex.css";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const apiDesignerConfig: ApiDesignerConfig = ApiDesignerConfig || window["ApiDesignerConfig"];


const App: React.FunctionComponent = () => {
    const [initialized, setInitialized] = useState(false);
    const auth: AuthConfig = useKeycloakAuth();

    const loadingState: React.ReactNode = (
        <EmptyState>
            <EmptyStateIcon variant="container" component={Spinner} />
            <Title size="lg" headingLevel="h4">
                Loading
            </Title>
        </EmptyState>
    );

    // Initialize Keycloak
    useEffect(() => {
        if (apiDesignerConfig.auth.enabled) {
            const init = async () => {
                await getKeycloakInstance();
                setInitialized(true);
            };
            init();
        } else {
            setInitialized(true);
        }
    }, []);

    if (!initialized) {
        return loadingState;
    }

    const pageConfig: PageConfig = {
        serviceConfig: {
            alerts: {
                addAlert: (props: AlertProps) => { return; }
            },
            navigation: {
                basename: "/ui"
            },
            registry: {
                api: apiDesignerConfig.apis.registry
            },
            auth
        }
    };

    return (
        <ApiDesignerConfigContext.Provider value={apiDesignerConfig}>
            <PageContextProvider value={pageConfig}>
                <Router basename={pageConfig.serviceConfig.navigation.basename}>
                    <React.Suspense fallback={loadingState}>
                        <AppLayout>
                            <AppRoutes/>
                        </AppLayout>
                    </React.Suspense>
                </Router>
            </PageContextProvider>
        </ApiDesignerConfigContext.Provider>
    );
};

export default App;
