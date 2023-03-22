import React from "react";
import { DesignContent } from "@apicurio/apicurio-api-designer-models";

export type EditorProps = {
    content: DesignContent;
    onChange: (value: any) => void;
};

export type Editor = React.FunctionComponent<EditorProps>;
