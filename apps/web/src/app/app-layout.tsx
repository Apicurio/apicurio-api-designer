import React from "react";
import { Nav, NavItem, NavList, Page, PageHeader, PageSidebar } from "@patternfly/react-core";

export type AppLayoutProps = {
    children?: React.ReactNode;
};

export const AppLayout: React.FunctionComponent<AppLayoutProps> = ({ children }) => {

    const logoProps = {
        href: "/"
    };

    const logo: React.ReactNode = (
        <div className="app-logo">
            <img className="pf-c-brand logo-make" src="/logo.png" alt="apicurio-logo"/>
            <span className="logo-model">Applications</span>
        </div>
    );

    const headerActions: React.ReactNode = <React.Fragment/>;

    const header = (
        <PageHeader
            logo={logo}
            logoProps={logoProps}
            headerTools={headerActions}
        />
    );

    const rightNav: React.ReactNode = (
        <Nav>
            <NavList>
                <NavItem preventDefault to="#apidesigner" itemId="api-designer" isActive={true}>
                    API Designer
                </NavItem>
            </NavList>
        </Nav>
    );
    const sidebar: React.ReactNode | undefined = <PageSidebar nav={rightNav} isNavOpen={true}/>;

    return (
        <Page header={header} sidebar={sidebar}>
            {children}
        </Page>
    );
};

