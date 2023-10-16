import React, { ReactElement } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import { EditorPage, HomePage } from "@app/pages";

const EditorPageWithParams: React.FunctionComponent = () => {
    const params = useParams();
    console.info("[EditorPage] Params: ", params);
    return (<EditorPage params={params}></EditorPage>);
};

export const AppRoutes = (): ReactElement => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/designs/:designId/editor" element={<EditorPageWithParams />}/>
        </Routes>
    );
};
