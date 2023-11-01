import { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import { EditorPage, HomePage } from "@app/pages";

export const AppRoutes = (): ReactElement => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/designs/:designId/editor" element={<EditorPage />}/>
        </Routes>
    );
};
