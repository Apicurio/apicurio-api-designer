import React, { ReactElement } from "react";
import { Route, Switch, useParams } from "react-router-dom";
import { ArtifactTypeIcon } from "@apicurio/apicurio-api-designer-components";
import { ArtifactTypes } from "@apicurio/apicurio-api-designer-models";


const HomePage: React.FunctionComponent = () => {
    const params: any = useParams();
    console.info("[HomePage] Params: ", params);
    return (<div>
        <h1>Home Page</h1>
        <div>
            <ul>
                <li>
                    <ArtifactTypeIcon type={ArtifactTypes.JSON} isShowIcon={true} isShowLabel={true} />
                </li>
                <li>
                    <ArtifactTypeIcon type={ArtifactTypes.XML} isShowIcon={true} isShowLabel={true} />
                </li>
                <li>
                    <ArtifactTypeIcon type={ArtifactTypes.OPENAPI} isShowIcon={true} isShowLabel={true} />
                </li>
            </ul>
        </div>
    </div>);
};

const EditorPage: React.FunctionComponent = () => {
    const params: any = useParams();
    console.info("[EditorPage] Params: ", params);
    return (<h1>Editor Page</h1>);
};


export const AppRoutes = (): ReactElement => {
    return (
        <Switch>
            <Route path='/' exact={true} component={HomePage}/>
            <Route path='/designs/:designId/editor' exact={true} component={EditorPage}/>
        </Switch>
    );
};
