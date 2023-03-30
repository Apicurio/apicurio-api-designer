import React, { useEffect, useState } from "react";
import { EmptyState, EmptyStateIcon, Spinner, Title } from "@patternfly/react-core";
import { BrowserRouter as Router } from "react-router-dom";
import { AppLayout } from "./app-layout";
import { AppRoutes } from "./routes";
import { PageConfig, PageContextProvider } from "@apicurio/apicurio-api-designer-pages";
import { getKeycloak, useKeycloakAuth } from "@app/auth";
import { AlertProps, AuthConfig } from "@apicurio/apicurio-api-designer-services";
import { ApiDesignerConfigContext, ApiDesignerConfigType } from "@app/contexts/config";

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
const apiDesignerConfig: ApiDesignerConfigType = ApiDesignerConfig || window["ApiDesignerConfig"];


const App: React.FunctionComponent = () => {
    const [initialized, setInitialized] = useState(false);
    // TODO support non-keycloak auth - probably should create "useOidcAuth", "useNoAuth", and "useKeycloakAuth" maybe?
    //      or else maybe just "useApplicationAuth" that will hide the details
    const auth: AuthConfig = useKeycloakAuth();

    const loadingState: React.ReactNode = (
        <EmptyState>
            <EmptyStateIcon variant="container" component={Spinner} />
            <Title size="lg" headingLevel="h4">
                Loading
            </Title>
        </EmptyState>
    );

    // Initialize Auth
    // TODO add support for non-keycloak auth
    useEffect(() => {
        if (apiDesignerConfig.auth.type === "keycloakjs") {
            const init = async () => {
                await getKeycloak();
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
        editorConfig: {
            openApiEditorUrl: apiDesignerConfig.components.editors.url,
            asyncApiEditorUrl: apiDesignerConfig.components.editors.url
        },
        serviceConfig: {
            designs: {
                type: apiDesignerConfig.apis.designer === "browser" ? "browser" : "api",
                api: apiDesignerConfig.apis.designer
            },
            alerts: {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                addAlert: (_: AlertProps) => { return; }
            },
            navigation: {
                basename: apiDesignerConfig.ui.navPrefixPath
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
                <Router basename={apiDesignerConfig.ui.contextPath}>
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
