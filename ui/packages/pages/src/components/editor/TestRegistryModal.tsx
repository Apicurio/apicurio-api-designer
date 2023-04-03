import { Button, Form, FormGroup, Modal, ModalVariant, TextInput } from "@patternfly/react-core";
import { Registry } from "@rhoas/registry-management-sdk";
import React, { useEffect, useState } from "react";
import { Design, DesignContext, DesignEvent } from "@apicurio/apicurio-api-designer-models";
import { DesignsService, useDesignsService, useRhosrService } from "@apicurio/apicurio-api-designer-services";
import { IfNotEmpty, IsLoading, ObjectSelect } from "@apicurio/apicurio-api-designer-components";
import { RhosrEmptyState } from "../common/RhosrEmptyState";
import { IfRhosr } from "../common/IfRhosr";


export interface TestRegistryModalProps {
    design: Design;
    isOpen?: boolean;
    onCancel: () => void;
    onSubmit: (registry: Registry, groupId: string | undefined, artifactId: string) => void;
}

type ValidatedValue = "error" | "default" | "warning" | "success" | undefined;

const initialFormState = {
    hasErrors: false,
    groupValue: {
        value: "",
        validated: "default" as ValidatedValue,
        errorMessage: ""
    },
    artifactIdValue: {
        value: "",
        validated: "default" as ValidatedValue,
        errorMessage: ""
    }
};

export const TestRegistryModal: React.FunctionComponent<TestRegistryModalProps> = ({ design, isOpen, onCancel, onSubmit }) => {
    const [isValid, setValid] = useState(false);
    const [isLoadingRegistries, setLoadingRegistries] = useState(true);
    const [registries, setRegistries] = useState<Registry[]>([]);
    const [registry, setRegistry] = useState<Registry>();
    const [formState, setFormState] = useState(initialFormState);

    const designs: DesignsService = useDesignsService();
    const rhosr = useRhosrService();

    const setGroupAndId = (group: string, id: string) => {
        setFormState({
            ...formState,
            groupValue: {
                ...formState.groupValue,
                validated: "default",
                value: group
            },
            artifactIdValue: {
                ...formState.artifactIdValue,
                validated: "default",
                value: id
            }
        });
    };

    const setGroupValue = (val: string) => {
        setFormState({
            ...formState,
            groupValue: {
                ...formState.groupValue,
                validated: "default",
                value: val
            }
        });
    };

    const setArtifactIdValue = (val: string) => {
        const hasErrors = !val;

        setFormState({
            ...formState,
            hasErrors,
            artifactIdValue: {
                ...formState.artifactIdValue,
                validated: hasErrors ? "error" : "default",
                errorMessage: "ID is a required field.",
                value: val
            }
        });
    };

    const detectRhosrContext = (events: DesignEvent[]): DesignContext|undefined => {
        if (events) {
            const filteredEvents: DesignEvent[] = events.filter(event => event.type === "register");
            if (filteredEvents && filteredEvents.length > 0) {
                const regEvent: DesignEvent = filteredEvents[0];
                return {
                    type: "registry",
                    registry: regEvent.data
                };
            }
        }
        if (design?.origin?.type === "registry") {
            return design.origin;
        }

        return undefined;
    };

    const defaultRegistry = (registries: Registry[], context: DesignContext|undefined): Registry | undefined => {
        if (context) {
            const filteredRegistries: Registry[] = registries.filter(registry => registry.id === design.origin.registry?.instanceId);
            if (filteredRegistries?.length > 0) {
                return filteredRegistries[0];
            }
        }

        if (registries?.length > 0) {
            return registries[0];
        } else {
            return undefined;
        }
    };

    const setFormValues = (context: DesignContext | undefined): void => {
        setGroupAndId(context?.registry?.groupId || "", context?.registry?.artifactId || "");
    };

    useEffect(() => {
        if (isOpen) {
            setFormState(initialFormState);
            setLoadingRegistries(true);

            // Load all events for this design.
            designs.getEvents(design.id).then(events => {
                // Get the list of registries.
                rhosr.getRegistries().then(registries => {
                    setRegistries(registries.sort((a, b) => {
                        const name1: string = a.name as string;
                        const name2: string = b.name as string;
                        return name1.localeCompare(name2);
                    }));
                    const context: DesignContext | undefined = detectRhosrContext(events);
                    setFormValues(context);
                    setRegistry(defaultRegistry(registries, context));
                    setLoadingRegistries(false);
                }).catch(error => {
                    // TODO handle this error case
                    console.error("[ExportToRhosrModal] Error getting registry list: ", error);
                    setRegistries([]);
                    setFormValues(undefined);
                    setLoadingRegistries(false);
                });
            }).catch(error => {
                // TODO handle this error case
                console.error("[ExportToRhosrModal] Error getting events for design: ", error);
                setRegistries([]);
                setFormValues(undefined);
                setLoadingRegistries(false);
            });
        }
    }, [isOpen]);

    useEffect(() => {
        setValid(formState.artifactIdValue.value !== undefined && formState.artifactIdValue.value.length > 0);
    }, [formState]);

    return (
        <Modal
            variant={ModalVariant.medium}
            title="Test using Service Registry"
            isOpen={isOpen}
            onClose={onCancel}
            actions={[
                <Button key="confirm" isDisabled={!isValid || registries?.length === 0} variant="primary" onClick={() => onSubmit(
                    registry as Registry,
                    formState.groupValue.value,
                    formState.artifactIdValue.value
                )}>
                    Test
                </Button>,
                <Button key="cancel" variant="link" onClick={onCancel}>
                    Cancel
                </Button>
            ]}
        >
            <IsLoading condition={isLoadingRegistries}>
                <IfNotEmpty collection={registries} emptyState={<RhosrEmptyState message="To test your design using Service Registry, you must create a Service Registry instance first." />}>
                    <Form>
                        <FormGroup
                            isRequired={true}
                            label="Registry instance"
                            fieldId="test-in-registry-registry-instance"
                        >
                            <ObjectSelect toggleId="test-in-registry-instance" value={registry} items={registries} onSelect={setRegistry} itemToString={item => item.name} />
                        </FormGroup>
                        <IfRhosr registry={registry} scope="write">
                            <FormGroup
                                label="Group"
                                validated={formState.groupValue.validated}
                                helperTextInvalid={formState.groupValue.errorMessage}
                                fieldId="test-in-registry-group"
                            >
                                <TextInput
                                    id="test-in-registry-group"
                                    value={formState.groupValue.value}
                                    placeholder="Enter group (optional) or leave blank for default group"
                                    onChange={setGroupValue} />
                            </FormGroup>
                            <FormGroup
                                label="ID"
                                validated={formState.artifactIdValue.validated}
                                helperTextInvalid={formState.artifactIdValue.errorMessage}
                                isRequired={true}
                                fieldId="test-in-registry-artifactId"
                            >
                                <TextInput
                                    id="test-in-registry-artifactId"
                                    placeholder="Enter ID of artifact"
                                    value={formState.artifactIdValue.value}
                                    onChange={setArtifactIdValue} />
                            </FormGroup>
                        </IfRhosr>
                    </Form>
                </IfNotEmpty>
            </IsLoading>
        </Modal>
    );
};
