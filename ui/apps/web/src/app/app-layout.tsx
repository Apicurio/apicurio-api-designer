import React from "react";
import { Nav, NavItem, NavList, Page, PageHeader, PageSidebar } from "@patternfly/react-core";
import { ApiDesignerConfigType, useApiDesignerConfig } from "@app/contexts/config";

export type AppLayoutProps = {
    children?: React.ReactNode;
};

export const AppLayout: React.FunctionComponent<AppLayoutProps> = ({ children }) => {

    const apiDesignerConfigType: ApiDesignerConfigType = useApiDesignerConfig();

    const logoProps = {
        href: "/"
    };

    const logo: React.ReactNode = (
        <div className="app-logo">
            <img className="pf-c-brand logo-make" src="images/logo.png" alt="apicurio-logo"/>
            <span className="logo-model">{ apiDesignerConfigType.components.masthead.label }</span>
        </div>
    );

    const headerActions: React.ReactNode = <React.Fragment/>;

    const header: React.ReactNode | undefined = apiDesignerConfigType.components.masthead.show ? (
        <PageHeader
            logo={logo}
            logoProps={logoProps}
            headerTools={headerActions}
        />
    ) : undefined;

    const rightNav: React.ReactNode = (
        <Nav>
            <NavList>
                <NavItem preventDefault to="#apidesigner" itemId="api-designer" isActive={true}>
                    API Designer
                </NavItem>
            </NavList>
        </Nav>
    );
    const sidebar: React.ReactNode | undefined = apiDesignerConfigType.components.nav.show ? <PageSidebar nav={rightNav} isNavOpen={true}/> : undefined;

    return (
        <Page header={header} sidebar={sidebar}>
            {children}
        </Page>
    );
};

