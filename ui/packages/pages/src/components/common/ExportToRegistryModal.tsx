import React, { FunctionComponent, useEffect, useState } from "react";
import {
    Button,
    Form,
    FormGroup,
    Modal,
    ModalVariant,
    SelectVariant,
    Spinner,
    TextInput
} from "@patternfly/react-core";
import { Registry } from "@rhoas/registry-management-sdk";
import {
    CreateOrUpdateArtifactData,
    Design,
    DesignEvent,
    RegistryArtifactCoordinates
} from "@apicurio/apicurio-api-designer-models";
import {
    DesignsService,
    RhosrInstanceService, RhosrInstanceServiceFactory,
    RhosrService,
    useDesignsService, useRhosrInstanceServiceFactory, useRhosrService
} from "@apicurio/apicurio-api-designer-services";
import { If, IfNotEmpty, IsLoading, ObjectSelect } from "@apicurio/apicurio-api-designer-components";
import { RhosrEmptyState } from "./RhosrEmptyState";
import { IfRhosr } from "./IfRhosr";
import { RegistrationError } from "./RegistrationError";
import { ExportDesign, ExportType } from "@apicurio/apicurio-api-designer-models/src/designs/ExportDesign";
import { CreateDesignEvent } from "@apicurio/apicurio-api-designer-models/src/designs/CreateDesignEvent";


export type ExportToRegistryModalProps = {
    design: Design;
    isOpen: boolean | undefined;
    onExported: (event: ExportDesign) => void;
    onCancel: () => void;
}


export const ExportToRegistryModal: FunctionComponent<ExportToRegistryModalProps> = (
    { design, isOpen, onExported, onCancel }: ExportToRegistryModalProps) => {

    const [isValid, setValid] = useState(false);
    const [isExporting, setExporting] = useState(false);
    const [isLoadingRegistries, setLoadingRegistries] = useState(true);
    const [registries, setRegistries] = useState([] as Registry[]);
    const [registry, setRegistry] = useState<Registry>();
    const [group, setGroup] = useState<string>();
    const [artifactId, setArtifactId] = useState<string>();
    const [version, setVersion] = useState<string>();
    const [rhosrInstance, setRhosrInstance] = useState<RhosrInstanceService>();
    const [hasRhosrAccess, setHasRhosrAccess] = useState<boolean>(false);
    const [registrationError, setRegistrationError] = useState<any>();

    const designs: DesignsService = useDesignsService();
    const rhosr: RhosrService = useRhosrService();
    const rhosrInstanceFactory: RhosrInstanceServiceFactory = useRhosrInstanceServiceFactory();

    // Called when the user clicks "export"
    const doExport = () => {
        setExporting(true);
        designs.getDesignContent(design.id).then(content => {
            const data: CreateOrUpdateArtifactData = {
                type: design.type,
                groupId: group,
                id: artifactId,
                version: version,
                content: content.data,
                contentType: content.contentType
            };
            rhosrInstance?.createOrUpdateArtifact(data).then(amd => {
                const registryCoordinates: RegistryArtifactCoordinates = {
                    instanceId: registry?.id as string,
                    groupId: amd.groupId as string,
                    artifactId: amd.id,
                    version: amd.version
                };
                const data: ExportDesign = {
                    type: ExportType.REGISTRY,
                    to: registry as Registry,
                    design,
                    registry: registryCoordinates
                };

                const cevent: CreateDesignEvent = {
                    type: "REGISTER",
                    data: {
                        register: {
                            registry: registryCoordinates
                        }
                    }
                };

                // Create an event (add to the design's history).
                designs.createEvent(design.id, cevent).then(() => {
                    setExporting(false);
                    onExported(data);
                }).catch(error => {
                    console.warn("[ExportToRegistryModal] Failed to create a history event (not fatal).");
                    setExporting(false);
                    onExported(data);
                });
            }).catch(error => {
                console.error("[ExportToRegistryModal] Error registering artifact in RHOSR: ", error);
                setRegistrationError(error);
                setExporting(false);
            });
        }).catch(error => {
            // TODO error handling - low priority as this error is extremely unlikely to happen...but what to do if it does??
            console.error("[ExportToRegistryModal] Error fetching design content!", error);
        });
    };

    const onRegistrySelect = (registry: Registry): void => {
        setHasRhosrAccess(false); // the IfRhosr component will change this to "true" if the user has access
        setRegistry(registry);
    };

    const detectRhosrCoordinates = (events: DesignEvent[]): RegistryArtifactCoordinates|undefined => {
        if (events) {
            const filteredEvents: DesignEvent[] = events.filter(event => event.type === "REGISTER");
            if (filteredEvents && filteredEvents.length > 0) {
                const regEvent: DesignEvent = filteredEvents[0];
                return regEvent.data.register.registry;
            }
        }

        return undefined;
    };

    const defaultRegistry = (registries: Registry[], coordinates: RegistryArtifactCoordinates|undefined): Registry | undefined => {
        if (coordinates) {
            const filteredRegistries: Registry[] = registries.filter(registry => registry.id === coordinates.instanceId);
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

    const setFormDefaults = (): void => {
        setGroup(undefined);
        setArtifactId(undefined);
        setVersion(undefined);
    };

    const setFormValues = (coordinates: RegistryArtifactCoordinates | undefined): void => {
        setGroup(coordinates?.groupId);
        setArtifactId(coordinates?.artifactId);
        setVersion(coordinates?.version);
    };

    useEffect(() => {
        if (isOpen) {
            setLoadingRegistries(true);
            setExporting(false);
            setValid(false);
            setRegistries([]);
            setFormDefaults();

            // Load all events for this design.
            designs.getEvents(design.id).then(events => {
                // Get the list of registries.
                rhosr.getRegistries().then(registries => {
                    setRegistries(registries.sort((a, b) => {
                        const name1: string = a.name as string;
                        const name2: string = b.name as string;
                        return name1.localeCompare(name2);
                    }));
                    const coordinates: RegistryArtifactCoordinates | undefined = detectRhosrCoordinates(events);
                    setFormValues(coordinates);
                    setRegistry(defaultRegistry(registries, coordinates));
                    setLoadingRegistries(false);
                }).catch(error => {
                    // TODO handle this error case
                    console.error("[ExportToRegistryModal] Error getting registry list: ", error);
                    setRegistries([]);
                    setFormValues(undefined);
                    setLoadingRegistries(false);
                });
            }).catch(error => {
                console.error("[ExportToRegistryModal] Error getting events for design: ", error);
                setRegistries([]);
                setFormValues(undefined);
                setLoadingRegistries(false);
            });
        }
    }, [isOpen]);

    useEffect(() => {
        setFormDefaults();
    }, [design]);

    // Set the validity whenever one of the relevant state variables changes.
    useEffect(() => {
        let valid: boolean = true;
        if (!registry) {
            valid = false;
        }
        if (!hasRhosrAccess) {
            valid = false;
        }
        if (registrationError !== undefined) {
            valid = false;
        }
        setValid(valid);
    }, [registry, group, artifactId, version, hasRhosrAccess, registrationError]);

    // Whenever the registry changes, create a rhosr instance service for it.
    useEffect(() => {
        if (registry) {
            const rhosrInstance: RhosrInstanceService = rhosrInstanceFactory.createFor(registry as Registry);
            setRhosrInstance(rhosrInstance);
        }
    }, [registry]);

    const actions: any[] =  [
        <Button key="export" variant="primary" isDisabled={!isValid || isExporting || registries?.length === 0} onClick={doExport}>
            <If condition={isExporting}>
                <Spinner size="md" className="export-spinner" style={{ marginRight: "5px" }} />
            </If>
            Export
        </Button>,
        <Button key="cancel" variant="link" onClick={onCancel}>
            Cancel
        </Button>
    ];

    return (
        <Modal
            variant={ModalVariant.medium}
            title="Export to Service Registry"
            isOpen={isOpen}
            onClose={onCancel}
            actions={actions}
        >
            <IsLoading condition={isLoadingRegistries}>
                <IfNotEmpty collection={registries} emptyState={<RhosrEmptyState message="To save a design as an artifact in Service Registry, you must create a Service Registry instance first." />}>
                    <Form>
                        <FormGroup label="Registry Instance" isRequired={true} fieldId="export-registry-instance">
                            <ObjectSelect items={registries}
                                value={registry}
                                onSelect={onRegistrySelect}
                                variant={SelectVariant.single}
                                toggleId="export-registry"
                                menuAppendTo="parent"
                                itemToString={item => item.name} />
                        </FormGroup>
                        <IfRhosr registry={registry} scope="write" onHasAccess={setHasRhosrAccess}>
                            <If condition={registrationError !== undefined}>
                                <RegistrationError design={design} error={registrationError}
                                    onCancel={onCancel}
                                    onTryAgain={() => setRegistrationError(undefined)} />
                            </If>
                            <If condition={registrationError === undefined}>
                                <FormGroup label="Group" isRequired={false} fieldId="export-group">
                                    <TextInput
                                        isRequired
                                        type="text"
                                        id="export-group"
                                        name="export-group"
                                        placeholder="Enter group (optional) or leave blank for default group"
                                        aria-describedby="export-group-helper"
                                        value={group}
                                        onChange={(value) => setGroup(value)}
                                    />
                                </FormGroup>
                                <FormGroup label="ID" isRequired={false} fieldId="export-artifact-id">
                                    <TextInput
                                        isRequired
                                        type="text"
                                        id="export-artifact-id"
                                        name="export-artifact-id"
                                        placeholder="Enter ID (optional) or leave blank for generated ID"
                                        aria-describedby="export-artifact-id-helper"
                                        value={artifactId}
                                        onChange={(value) => setArtifactId(value)}
                                    />
                                </FormGroup>
                                <FormGroup label="Version" isRequired={false} fieldId="export-version">
                                    <TextInput
                                        isRequired
                                        type="text"
                                        id="export-version"
                                        name="export-version"
                                        placeholder="Enter version (optional) or leave blank for generated version number"
                                        aria-describedby="export-version-helper"
                                        value={version}
                                        onChange={(value) => setVersion(value)}
                                    />
                                </FormGroup>
                            </If>
                        </IfRhosr>
                    </Form>
                </IfNotEmpty>
            </IsLoading>
        </Modal>
    );
};
