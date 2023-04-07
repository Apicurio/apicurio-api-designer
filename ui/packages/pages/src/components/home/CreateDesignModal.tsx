import React, { FunctionComponent, useEffect, useState } from "react";
import {
    Button,
    Form,
    FormGroup,
    Gallery,
    GalleryItem,
    Modal,
    ModalVariant,
    Select,
    SelectOption,
    SelectOptionObject,
    SelectVariant, Spinner,
    TextArea,
    TextInput
} from "@patternfly/react-core";
import { ArtifactTypes, CreateDesign, Template } from "@apicurio/apicurio-api-designer-models";
import { TemplatesService, useTemplatesService } from "@apicurio/apicurio-api-designer-services";
import { If } from "@apicurio/apicurio-api-designer-components";
import { BrowserDataWarning } from "../common/BrowserDataWarning";
import { TemplateItem } from "./TemplateItem";

export type CreateDesignModalProps = {
    isOpen: boolean|undefined;
    isCreating: boolean|undefined;
    onCreate: (event: CreateDesign, template: Template) => void;
    onCancel: () => void;
}


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
        }
    };
});


export const CreateDesignModal: FunctionComponent<CreateDesignModalProps> = ({ isOpen, isCreating, onCreate, onCancel }: CreateDesignModalProps) => {
    const [isValid, setValid] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [type, setType] = useState(ArtifactTypes.OPENAPI);
    const [typeSelection, setTypeSelection] = useState<SelectOptionObject>();
    const [isTypeToggled, setTypeToggled] = useState(false);

    const [version, setVersion] = useState("");
    const [isVersionToggled, setVersionToggled] = useState(false);

    const [templates, setTemplates] = useState<Template[]>();
    const [template, setTemplate] = useState<Template>();

    const templatesSvc: TemplatesService = useTemplatesService();


    // Called when the user changes the "type" (dropdown)
    const onTypeSelect = (selection: SelectOptionObject): void => {
        setType((selection as any).value);
        setTypeSelection(selection);
        setTypeToggled(false);
    };

    // Called when the user changes the "version" (dropdown)
    const onVersionSelect = (selection: string): void => {
        setVersion(selection);
        setVersionToggled(false);
    };

    // Called when the user clicks the Create button in the modal
    const doCreate = (): void => {
        const cd: CreateDesign = {
            type,
            name,
            description,
            origin: "create"
        };
        onCreate(cd, template as Template);
    };

    // Validate the form inputs.
    useEffect(() => {
        let valid: boolean = true;
        if (!name) {
            valid = false;
        }
        if (!type) {
            valid = false;
        }
        if (!template) {
            valid = false;
        }
        setValid(valid);
    }, [name, description, type, template]);

    // Whenever the modal is opened, set default values for the form.
    useEffect(() => {
        setName("");
        setDescription("");
        setType(ArtifactTypes.OPENAPI);
        if (templates) {
            setTemplate(templates[0]);
        } else {
            setTemplate(undefined);
        }
    }, [isOpen]);

    // Whenever the type changes, load the templates for that type. If the type is
    // OpenAPI, set the version to "3.0.2".
    useEffect(() => {
        if (type === ArtifactTypes.OPENAPI) {
            setVersion("3.0.2");
        }
        templatesSvc.getTemplatesFor(type, version).then(setTemplates);
    }, [type]);

    // Whenever the version changes, fetch the templates for the current type and version.
    useEffect(() => {
        templatesSvc.getTemplatesFor(type, version).then(setTemplates);
    }, [version]);

    // Whenever the templates changes, auto-select the first one
    useEffect(() => {
        if (templates && templates.length > 0) {
            setTemplate(templates[0]);
        }
    }, [templates]);

    return (
        <Modal
            variant={ModalVariant.medium}
            title="Create a design"
            isOpen={isOpen}
            onClose={onCancel}
            actions={[
                <Button key="create" variant="primary" isDisabled={!isValid || isCreating} onClick={doCreate}>
                    <If condition={isCreating}>
                        <Spinner size="sm" style={{ marginRight: "5px" }} />
                        Creating
                    </If>
                    <If condition={!isCreating}>
                        Create
                    </If>
                </Button>,
                <Button key="cancel" variant="link" onClick={onCancel}>
                    Cancel
                </Button>
            ]}
        >
            <BrowserDataWarning />

            <Form>
                <FormGroup label="Name" isRequired={true} fieldId="create-design-name">
                    <TextInput
                        isRequired
                        type="text"
                        id="create-design-name"
                        name="create-design-name"
                        aria-describedby="create-design-name-helper"
                        value={name}
                        onChange={(value) => {setName(value);}}
                    />
                </FormGroup>
                <FormGroup label="Description" fieldId="create-design-description">
                    <TextArea
                        type="text"
                        id="create-design-description"
                        name="create-design-description"
                        aria-describedby="create-design-description-helper"
                        value={description}
                        onChange={(value) => {setDescription(value);}}
                    />
                </FormGroup>
                <FormGroup label="Type" isRequired={true} fieldId="create-design-type">
                    <Select
                        variant={SelectVariant.single}
                        aria-label="Select type"
                        toggleId="create-design-type"
                        onToggle={() => {setTypeToggled(!isTypeToggled);}}
                        onSelect={(event, selection) => onTypeSelect(selection)}
                        isOpen={isTypeToggled}
                        selections={typeSelection}
                        menuAppendTo="parent"
                    >
                        {
                            TYPE_OPTIONS.map(to => <SelectOption key={(to as any).value} value={to} />)
                        }
                    </Select>
                </FormGroup>
                <If condition={type === ArtifactTypes.OPENAPI}>
                    <FormGroup label="Version" isRequired={true} fieldId="create-design-version">
                        <Select
                            variant={SelectVariant.single}
                            aria-label="Select version"
                            toggleId="create-design-version"
                            onToggle={() => {setVersionToggled(!isVersionToggled);}}
                            onSelect={(event, selection) => onVersionSelect(selection as string)}
                            isOpen={isVersionToggled}
                            selections={version}
                            menuAppendTo="parent"
                        >
                            <SelectOption value={"3.0.2"} />
                            <SelectOption value={"2.0"} />
                        </Select>
                    </FormGroup>
                </If>
                <If condition={(templates && templates.length > 1) as boolean}>
                    <FormGroup label="Template" fieldId="create-design-template">
                        <Gallery hasGutter minWidths={{ default: "125px" }} maxWidths={{ default: "125px" }}>
                            {
                                templates?.map(t => (
                                    <GalleryItem key={t.id}>
                                        <TemplateItem template={t} isSelected={t === template} onSelect={() => {
                                            setTemplate(t);
                                        }} />
                                    </GalleryItem>
                                ))
                            }
                        </Gallery>
                    </FormGroup>
                </If>
            </Form>
        </Modal>
    );
};
