import "./App.css";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useOidcAuth } from "@app/auth";
import { ApiDesignerConfigContext, ApiDesignerConfigType } from "@app/contexts/config";

import { AuthConfig } from "@services/ServiceConfigContext.tsx";
import { EditorPage, HomePage, PageConfig, PageContextProvider } from "@app/pages";
import { AppHeader, ApplicationAuth } from "@app/components";
import { Page } from "@patternfly/react-core";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const apiDesignerConfig: ApiDesignerConfigType = ApiDesignerConfig || window["ApiDesignerConfig"];


export const App: React.FunctionComponent = () => {
    const auth: AuthConfig = useOidcAuth();

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
            <ApplicationAuth>
                <PageContextProvider value={pageConfig}>
                    <Router basename={apiDesignerConfig.ui.contextPath}>
                        <Page className="pf-m-redhat-font" isManagedSidebar={false} header={<AppHeader />}>
                            <Routes>
                                <Route path="/" element={<HomePage />}/>
                                <Route path="/designs/:designId/editor" element={<EditorPage />}/>
                            </Routes>
                        </Page>
                    </Router>
                </PageContextProvider>
            </ApplicationAuth>
        </ApiDesignerConfigContext.Provider>
    );
};
