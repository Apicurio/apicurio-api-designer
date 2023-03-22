import React, { useContext } from "react";

export type EditorConfig = {
    openApiEditorUrl: string;
    asyncApiEditorUrl: string;
};

export const EditorConfigContext: React.Context<EditorConfig> = React.createContext({
    openApiEditorUrl: "",
    asyncApiEditorUrl: ""
});

export const useEditorConfig: () => EditorConfig = (): EditorConfig => {
    return useContext(EditorConfigContext);
};
