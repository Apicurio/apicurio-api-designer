import React, { FunctionComponent, useEffect, useState } from "react";
import {
    Button,
    FileUpload,
    Form,
    FormGroup,
    Modal,
    ModalVariant,
    Select,
    SelectOption,
    SelectOptionObject,
    SelectVariant,
    TextArea,
    TextInput
} from "@patternfly/react-core";
import { ImportFrom } from "./ImportDropdown";
import {
    ArtifactTypes, ContentTypes,
    CreateDesign,
    CreateDesignContent,
    DesignContext
} from "@apicurio/apicurio-api-designer-models";
import {
    isJson,
    isProto,
    isWsdl,
    isXml,
    isXsd,
    isYaml,
    parseJson,
    parseYaml
} from "@apicurio/apicurio-api-designer-utils";
import { ServicePreviewWarning } from "../common/ServicePreviewWarning";
import { If } from "@apicurio/apicurio-api-designer-components";
import { UrlUpload } from "./UrlUpload";


export type ImportDesignModalProps = {
    importType: ImportFrom;
    isOpen: boolean | undefined;
    onImport: (event: CreateDesign, content: CreateDesignContent) => void;
    onCancel: () => void;
}


const PLACEHOLDER_TYPE_OPTION: SelectOptionObject = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    value: undefined,
    label: "Select a type...",
    toString: () => {
        return "Select a type...";
    },
    compareTo(selectOption: any): boolean {
        return selectOption === this;
    }
};
const TYPE_OPTIONS: SelectOptionObject[] = [
    {
        value: ArtifactTypes.OPENAPI,
        label: "OpenAPI"
    },
    {
        value: ArtifactTypes.ASYNCAPI,
        label: "AsyncAPI"
    },
    {
        value: ArtifactTypes.AVRO,
        label: "Apache Avro"
    },
    {
        value: ArtifactTypes.JSON,
        label: "JSON Schema"
    },
    {
        value: ArtifactTypes.PROTOBUF,
        label: "Google Protocol Buffers"
    },
].map(item => {
    return {
        value: item.value,
        label: item.label,
        toString: () => {
            return item.label;
        },
        compareTo(selectOption: any): boolean {
            return this.value === selectOption.value;
        }
    };
});


type DetectionInfo = {
    type?: string;
    contentType?: string;
    version?: string;
    name?: string;
    summary?: string;
}


export const ImportDesignModal: FunctionComponent<ImportDesignModalProps> = ({ importType, isOpen, onImport, onCancel }: ImportDesignModalProps) => {
    const [isValid, setValid] = useState(false);

    const [designContent, setDesignContent] = useState<string>();
    const [fileName, setFileName] = useState<string>();
    const [url, setUrl] = useState<string>();

    const [name, setName] = useState("");
    const [summary, setSummary] = useState("");

    const [type, setType] = useState<string>();
    const [typeSelection, setTypeSelection] = useState<SelectOptionObject>();
    const [isTypeToggled, setTypeToggled] = useState(false);

    const [version, setVersion] = useState("");
    const [isVersionToggled, setVersionToggled] = useState(false);

    const [contentType, setContentType] = useState<string>();

    const onFileChange = (value: string | File, fname: string): void => {
        setDesignContent(value as string);
        setFileName(fname);
    };

    const onUrlChange = (value: string|undefined, url: string|undefined): void => {
        setDesignContent(value);
        setUrl(url);
    };

    // Called when the user changes the "type" (dropdown)
    const onTypeSelect = (selection: SelectOptionObject): void => {
        setTheType((selection as any).value);
        setTypeToggled(false);
    };

    // Called when the user changes the "version" (dropdown)
    const onVersionSelect = (selection: string): void => {
        setVersion(selection);
        setVersionToggled(false);
    };

    // Called when the user clicks the Import button in the modal
    const doImport = (): void => {
        const context: DesignContext = importType === ImportFrom.FILE ? {
            type: "file",
            file: {
                fileName: fileName as string
            }
        } : {
            type: "url",
            url: {
                url: url as string
            }
        };
        const cd: CreateDesign = {
            type: type as string,
            name,
            summary,
            context
        };
        const cdc: CreateDesignContent = {
            contentType: contentType as string,
            data: designContent
        };

        console.debug("[ImportDesignModal] Importing design: ", cd);
        console.debug("[ImportDesignModal] Importing content-type: ", contentType);
        onImport(cd, cdc);
    };

    const hasDesignContent = (): boolean => {
        return designContent !== undefined && designContent.trim().length > 0;
    };

    const title = (): string => {
        if (importType === ImportFrom.FILE) {
            return "Import design from file";
        } else {
            return "Import design from URL";
        }
    };

    const detectJsonOrYamlInfo = (contentObj: any, contentType: string): DetectionInfo => {
        if (contentObj.openapi) {
            return {
                type: ArtifactTypes.OPENAPI,
                contentType: contentType,
                version: "3.0.2",
                name: contentObj.info?.title,
                summary: contentObj.info?.description
            };
        }
        if (contentObj.swagger) {
            return {
                type: ArtifactTypes.OPENAPI,
                contentType: contentType,
                version: "2.0",
                name: contentObj.info?.title,
                summary: contentObj.info?.description
            };
        }
        if (contentObj.asyncapi) {
            return {
                type: ArtifactTypes.ASYNCAPI,
                contentType: contentType,
                name: contentObj.info?.title,
                summary: contentObj.info?.description
            };
        }
        if (contentObj.$schema) {
            return {
                type: ArtifactTypes.JSON,
                contentType: contentType,
                name: contentObj.title,
                summary: contentObj.description
            };
        }

        return {
            type: ArtifactTypes.AVRO,
            contentType: contentType,
            name: contentObj.name
        };
    };

    const detectXmlInfo = (content: string): DetectionInfo => {
        let type: string = ArtifactTypes.XML;
        if (isWsdl(content)) {
            type = ArtifactTypes.WSDL;
        } else if (isXsd(content)) {
            type = ArtifactTypes.XSD;
        }
        return {
            type,
            contentType: ContentTypes.TEXT_XML
        };
    };

    const detectProtoInfo = (): DetectionInfo => {
        return {
            contentType: ContentTypes.APPLICATION_PROTOBUF,
            type: ArtifactTypes.PROTOBUF
        };
    };

    // Tries to figure out the type and meta-data of the content by parsing it and looking
    // for key indicators.
    const detectInfo = (content: string): DetectionInfo => {
        if (isJson(content)) {
            return detectJsonOrYamlInfo(parseJson(content), ContentTypes.APPLICATION_JSON);
        } else if (isYaml(content)) {
            return detectJsonOrYamlInfo(parseYaml(content), ContentTypes.APPLICATION_YAML);
        } else if (isXml(content)) {
            return detectXmlInfo(content);
        } else if (isProto(content)) {
            return detectProtoInfo();
        }
        console.warn("[ImportDesignModal] Failed to detect the type of the content.");
        // Default: nothing detected
        return {
        };

        // TODO handle parsing of GraphQL
    };

    const setTheType = (newType: string|undefined): void => {
        if (newType === undefined) {
            setType(undefined);
            setTypeSelection(undefined);
        } else {
            setType(newType);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore (there really is a value on the option)
            const newTypeSelection: SelectOptionObject = TYPE_OPTIONS.filter(option => option.value === newType)[0];
            setTypeSelection(newTypeSelection);
        }
    };

    // Validate the form inputs.
    useEffect(() => {
        let valid: boolean = true;
        if (!designContent) {
            valid = false;
        }
        if (!name) {
            valid = false;
        }
        if (!type) {
            valid = false;
        }
        setValid(valid);
    }, [name, summary, type, designContent]);

    // Whenever the modal is opened, set default values for the form.
    useEffect(() => {
        setDesignContent(undefined);
        setName("");
        setSummary("");
        setFileName(undefined);
        setTheType(undefined);
    }, [isOpen]);

    // Whenever the content changes (e.g. loaded from file) try to detect the
    // type of the content.
    useEffect(() => {
        if (designContent && designContent.trim().length > 0) {
            const info: DetectionInfo = detectInfo(designContent as string);
            console.debug("[ImportDesignModal] Content detection: ", info);
            console.debug("[ImportDesignModal] Version detected: ", info.version || "");

            setTheType(info.type);
            setVersion(info.version || "");
            setName(info.name || "");
            setSummary(info.summary || "");
            setContentType(info.contentType);
        } else {
            console.debug("[ImportDesignModal] Content empty, resetting form fields.");
            setName("");
            setSummary("");
            setTheType(undefined);
            setContentType(undefined);
        }
    }, [designContent]);

    // Whenever the type changes to OpenAPI, set the version to "3.0.2".
    useEffect(() => {
        if (type === ArtifactTypes.OPENAPI && version === undefined) {
            setVersion("3.0.2");
        }
    }, [type]);

    return (
        <Modal
            variant={ModalVariant.medium}
            title={title()}
            isOpen={isOpen}
            onClose={onCancel}
            actions={[
                <Button key="create" variant="primary" isDisabled={!isValid} onClick={doImport}>
                    Import
                </Button>,
                <Button key="cancel" variant="link" onClick={onCancel}>
                    Cancel
                </Button>
            ]}
        >
            <ServicePreviewWarning />

            <Form>
                <If condition={importType === ImportFrom.FILE}>
                    <FormGroup label="File" isRequired={true} fieldId="import-design-file">
                        <FileUpload
                            isRequired={true}
                            id="design-text-file"
                            type="text"
                            value={designContent}
                            filename={fileName}
                            filenamePlaceholder="Drag and drop a file or upload one"
                            onChange={onFileChange}
                        />
                    </FormGroup>
                </If>
                <If condition={importType === ImportFrom.URL}>
                    <FormGroup label="URL" isRequired={true} fieldId="import-design-url">
                        <UrlUpload
                            id="design-text-url"
                            urlPlaceholder="Enter a valid and accessible URL"
                            onChange={onUrlChange}
                        />
                    </FormGroup>
                </If>
                <If condition={hasDesignContent}>
                    <FormGroup label="Type" isRequired={true} fieldId="import-design-type">
                        <Select
                            variant={SelectVariant.single}
                            aria-label="Select type"
                            onToggle={() => setTypeToggled(!isTypeToggled)}
                            onSelect={(event, selection) => onTypeSelect(selection)}
                            isOpen={isTypeToggled}
                            selections={typeSelection}
                            menuAppendTo="parent"
                        >
                            {
                                [
                                    <SelectOption key={-1} value={PLACEHOLDER_TYPE_OPTION} isPlaceholder={true}/>,
                                    ...TYPE_OPTIONS.map((to, index) => <SelectOption key={index} value={to}/>)
                                ]
                            }
                        </Select>
                    </FormGroup>
                    <If condition={type === ArtifactTypes.OPENAPI}>
                        <FormGroup label="Version" isRequired={true} fieldId="import-design-version">
                            <Select
                                variant={SelectVariant.single}
                                aria-label="Select version"
                                onToggle={() => setVersionToggled(!isVersionToggled)}
                                onSelect={(event, selection) => onVersionSelect(selection as string)}
                                isOpen={isVersionToggled}
                                selections={version}
                                menuAppendTo="parent"
                            >
                                <SelectOption key={1} value="3.0.2"/>
                                <SelectOption key={2} value="2.0"/>
                            </Select>
                        </FormGroup>
                    </If>
                    <FormGroup label="Name" isRequired={true} fieldId="import-design-name">
                        <TextInput
                            isRequired
                            type="text"
                            id="import-design-name"
                            name="import-design-name"
                            aria-describedby="import-design-name-helper"
                            value={name}
                            onChange={(value) => setName(value)}
                        />
                    </FormGroup>
                    <FormGroup label="Description" fieldId="import-design-description">
                        <TextArea
                            type="text"
                            id="import-design-description"
                            name="import-design-description"
                            aria-describedby="import-design-description-helper"
                            value={summary}
                            onChange={(value) => setSummary(value)}
                        />
                    </FormGroup>
                </If>
            </Form>
        </Modal>
    );
};
