import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, Form, FormGroup, Modal, ModalVariant, TextArea, TextInput } from "@patternfly/react-core";
import { Design } from "@apicurio/apicurio-api-designer-models";

export type RenameData = {
    name: string;
    summary: string;
};

export type RenameModalProps = {
    design: Design | undefined;
    isOpen: boolean | undefined;
    onRename: (event: RenameData) => void;
    onCancel: () => void;
}


export const RenameModal: FunctionComponent<RenameModalProps> = (
    { design, isOpen, onRename, onCancel }: RenameModalProps) => {

    const [isValid, setValid] = useState(false);
    const [name, setName] = useState<string>();
    const [summary, setSummary] = useState<string>();

    // Called when the user clicks "edit"
    const doRename = () => {
        onRename({
            name: name as string,
            summary: summary as string
        });
    };

    useEffect(() => {
        if (isOpen) {
            setName(design?.name);
            setSummary(design?.summary);
        }
    }, [isOpen]);

    // Set the validity whenever one of the relevant state variables changes.
    useEffect(() => {
        let valid: boolean = true;
        if (!name) {
            valid = false;
        }
        setValid(valid);
    }, [name, summary]);

    return (
        <Modal
            variant={ModalVariant.medium}
            title="Edit design metadata"
            isOpen={isOpen}
            onClose={onCancel}
            actions={[
                <Button key="edit" variant="primary" isDisabled={!isValid} onClick={doRename}>Save</Button>,
                <Button key="cancel" variant="link" onClick={onCancel}>Cancel</Button>
            ]}
        >
            <Form>
                <FormGroup label="Name" isRequired={true} fieldId="edit-name">
                    <TextInput
                        isRequired
                        type="text"
                        id="edit-name"
                        name="edit-name"
                        placeholder="Enter new name for design"
                        aria-describedby="edit-name-helper"
                        value={name}
                        onChange={(value) => setName(value)}
                    />
                </FormGroup>
                <FormGroup label="Description" fieldId="edit-description">
                    <TextArea
                        type="text"
                        id="edit-description"
                        name="edit-description"
                        aria-describedby="edit-description-helper"
                        value={summary}
                        onChange={(value) => {setSummary(value);}}
                    />
                </FormGroup>
            </Form>
        </Modal>
    );
};
