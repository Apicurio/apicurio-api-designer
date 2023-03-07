import { ContentTypes, Template } from "@apicurio/apicurio-api-designer-models";
import PROTOBUF_BLANK from "./protobuf/protobuf-blank.json";

export const PROTOBUF_TEMPLATES: Template[] = [
    {
        id: "protobuf_blank",
        name: "Blank Protobuf Schema",
        content: {
            contentType: ContentTypes.APPLICATION_PROTOBUF,
            data: PROTOBUF_BLANK.template
        }
    }
];
