import React, { ReactElement } from "react";
import { Route, Switch, useParams } from "react-router-dom";


const HomePage: React.FunctionComponent = () => {
    const params: any = useParams();
    console.info("[HomePage] Params: ", params);
    return (<h1>Home Page</h1>);
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
