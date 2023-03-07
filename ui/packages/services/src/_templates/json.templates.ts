import { ContentTypes, Template } from "@apicurio/apicurio-api-designer-models";
import JSON_BLANK from "./json/json-blank.json";

export const JSON_TEMPLATES: Template[] = [
    {
        id: "json_blank",
        name: "Blank JSON Schema",
        content: {
            contentType: ContentTypes.APPLICATION_JSON,
            data: JSON_BLANK
        }
    }
];
