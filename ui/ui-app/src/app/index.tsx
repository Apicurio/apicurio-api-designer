import React, { useEffect, useState } from "react";
import { EmptyState, EmptyStateBody, EmptyStateHeader, Spinner } from "@patternfly/react-core";
import { BrowserRouter as Router } from "react-router-dom";
import { AppLayout } from "./app-layout";
import { AppRoutes } from "./routes";
import { getOidc, useOidcAuth } from "@app/auth";
import { ApiDesignerConfigContext, ApiDesignerConfigType } from "@app/contexts/config";

import "./app.css";

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/utilities/Accessibility/accessibility.css";
import "@patternfly/patternfly/utilities/Sizing/sizing.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Display/display.css";
import "@patternfly/patternfly/utilities/Flex/flex.css";
import { AuthConfig } from "@services/ServiceConfigContext.tsx";
import { PageConfig, PageContextProvider } from "@app/pages";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const apiDesignerConfig: ApiDesignerConfigType = ApiDesignerConfig || window["ApiDesignerConfig"];


const App: React.FunctionComponent = () => {
    const [initialized, setInitialized] = useState(false);
    const auth: AuthConfig = useOidcAuth();

    const loadingState: React.ReactNode = (
        <EmptyState>
            <EmptyStateHeader titleText="Loading" headingLevel="h4" />
            <EmptyStateBody>
                <Spinner size="xl" aria-label="Loading spinner" />
            </EmptyStateBody>
        </EmptyState>
    );

    // Initialize Auth
    useEffect(() => {
        if (apiDesignerConfig.auth.type === "oidc") {
            const init = async () => {
                await getOidc();
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

    const editorsUrl: string = apiDesignerConfig.components.editors.url.startsWith("/") ?
        (window.location.origin + apiDesignerConfig.components.editors.url) :
        apiDesignerConfig.components.editors.url;

    const pageConfig: PageConfig = {
        editorConfig: {
            openApiEditorUrl: editorsUrl,
            asyncApiEditorUrl: editorsUrl
        },
        serviceConfig: {
            designs: {
                type: apiDesignerConfig.apis.designer === "browser" ? "browser" : "api",
                api: apiDesignerConfig.apis.designer
            },
            navigation: {
                basename: apiDesignerConfig.ui.navPrefixPath
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
