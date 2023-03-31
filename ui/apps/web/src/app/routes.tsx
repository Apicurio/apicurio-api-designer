import React, { ReactElement } from "react";
import { Route, Switch, useParams } from "react-router-dom";
import { HomePage, EditorPage } from "@apicurio/apicurio-api-designer-pages";


const EditorPageWithParams: React.FunctionComponent = () => {
    const params = useParams();
    console.info("[EditorPage] Params: ", params);
    return (<EditorPage params={params}></EditorPage>);
};


export const AppRoutes = (): ReactElement => {
    return (
        <Switch>
            <Route path="/" exact={true} component={HomePage}/>
            <Route path="/designs/:designId/editor" exact={true} component={EditorPageWithParams}/>
        </Switch>
    );
};
