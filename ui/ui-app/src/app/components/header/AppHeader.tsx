import { FunctionComponent } from "react";
import { Brand, Masthead, MastheadBrand, MastheadContent, MastheadMain } from "@patternfly/react-core";
import { Link } from "react-router-dom";
import { NavigationService, useNavigation } from "@services/NavigationService.ts";
import { AppHeaderToolbar } from "@app/components";
import { ApiDesignerConfigType, useApiDesignerConfig } from "@app/contexts/config.ts";


export type AppHeaderProps = {
    // No properties.
};


export const AppHeader: FunctionComponent<AppHeaderProps> = () => {
    const appNav: NavigationService = useNavigation();
    const config: ApiDesignerConfigType | undefined = useApiDesignerConfig();

    if (config?.components.masthead.show === false) {
        return (<></>);
    }

    return (
        <Masthead id="icon-router-link">
            <MastheadMain>
                <MastheadBrand component={props => <Link {...props} to={ appNav.createLink("/") } />}>
                    <Brand src="/apicurio_apidesigner_logo_reverse.svg" alt="Apicurio API Designer" heights={{ default: "36px" }} />
                </MastheadBrand>
            </MastheadMain>
            <MastheadContent>
                <AppHeaderToolbar />
            </MastheadContent>
        </Masthead>
    );
};
