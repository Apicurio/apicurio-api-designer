import React from "react";
import { Page } from "@patternfly/react-core";
import { ApiDesignerConfigType, useApiDesignerConfig } from "@app/contexts/config";
import { PageHeader } from "@patternfly/react-core/deprecated";

export type AppLayoutProps = {
    children?: React.ReactNode;
};

export const AppLayout: React.FunctionComponent<AppLayoutProps> = ({ children }) => {

    const apiDesignerConfigType: ApiDesignerConfigType | undefined = useApiDesignerConfig();

    const logoProps = {
        href: "/"
    };

    const logo: React.ReactNode = (
        <div className="app-logo">
            <img className="pf-c-brand logo-make" src="/logo.png" alt="apicurio-logo"/>
            <span className="logo-model">{ apiDesignerConfigType?.components.masthead.label }</span>
        </div>
    );

    const headerActions: React.ReactNode = <React.Fragment/>;

    const header: React.ReactNode | undefined = apiDesignerConfigType?.components.masthead.show ? (
        <PageHeader
            logo={logo}
            logoProps={logoProps}
            headerTools={headerActions}
        />
    ) : undefined;

    return (
        <Page header={header}>
            {children}
        </Page>
    );
};

