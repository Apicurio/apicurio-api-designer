import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, Modal, ModalVariant, Spinner } from "@patternfly/react-core";
import { Registry } from "@rhoas/registry-management-sdk";
import { RhosrService, useRhosrService } from "@apicurio/apicurio-api-designer-services";
import {
    CreateDesign,
    CreateDesignContent,
    SearchedArtifact,
    SearchedVersion
} from "@apicurio/apicurio-api-designer-models";
import { If, IsLoading } from "@apicurio/apicurio-api-designer-components";
import { BrowserDataWarning } from "../common/BrowserDataWarning";
import { RhosrEmptyState } from "../common/RhosrEmptyState";
import { ArtifactSelector } from "./ArtifactSelector";


export type ImportFromRegistryModalProps = {
    isOpen: boolean | undefined;
    isImporting: boolean | undefined;
    onImport: (event: CreateDesign, content: CreateDesignContent) => void;
    onCancel: () => void;
}


export const ImportFromRegistryModal: FunctionComponent<ImportFromRegistryModalProps> = ({ isOpen, isImporting, onImport, onCancel }: ImportFromRegistryModalProps) => {
    const [isValid, setValid] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [registries, setRegistries] = useState([] as Registry[]);
    const [design, setDesign] = useState<CreateDesign>();
    const [designContent, setDesignContent] = useState<CreateDesignContent>();

    const rhosr: RhosrService = useRhosrService();

    // Called when the user selects an artifact from the artifact selector.
    const onArtifactSelected = (registry?: Registry, artifact?: SearchedArtifact, version?: SearchedVersion, content?: CreateDesignContent): void => {
        if (artifact === undefined) {
            setDesign(undefined);
            setDesignContent(undefined);
        } else {
            const cd: CreateDesign = {
                type: artifact.type,
                name: artifact.name || artifact.id,
                description: artifact.description || "",
                context: {
                    type: "registry",
                    registry: {
                        instanceId: registry?.id as string,
                        groupId: artifact.groupId as string,
                        artifactId: artifact.id,
                        version: version?.version as string
                    }
                }
            };
            setDesign(cd);
            setDesignContent(content);
        }
    };

    // Called when the user clicks the Import button in the modal
    const doImport = (): void => {
        onImport(design as CreateDesign, designContent as CreateDesignContent);
    };

    useEffect(() => {
        if (isOpen) {
            // Get the list of registries.
            rhosr.getRegistries().then(registries => {
                setRegistries(registries.sort((a, b) => {
                    const name1: string = a.name as string;
                    const name2: string = b.name as string;
                    return name1.localeCompare(name2);
                }));
                setLoading(false);
            }).catch(error => {
                // TODO handle this error case
                console.error("[ImportFromRegistryModal] Error getting registry list: ", error);
                setRegistries([]);
                setLoading(false);
            });
        }
    }, [isOpen]);

    useEffect(() => {
        let valid: boolean = true;
        if (design === undefined) {
            valid = false;
        }
        setValid(valid);
    }, [design, designContent]);

    const actions: any[] = registries.length === 0 ? [] : [
        <Button key="import" variant="primary" isDisabled={!isValid || isImporting} onClick={doImport}>
            <If condition={isImporting}>
                <Spinner size="sm" style={{ marginRight: "5px" }} />
                Importing
            </If>
            <If condition={!isImporting}>
                Import
            </If>
        </Button>,
        <Button key="cancel" variant="link" onClick={onCancel}>
            Cancel
        </Button>
    ];

    return (
        <Modal
            variant={ModalVariant.large}
            title="Import design from Service Registry"
            isOpen={isOpen}
            onClose={onCancel}
            actions={actions}
        >
            <IsLoading condition={isLoading}>
                <If condition={registries.length === 0}>
                    <RhosrEmptyState message="To import a design from Service Registry, you must create a Service Registry instance first." />
                </If>
                <If condition={registries.length > 0}>
                    <BrowserDataWarning />
                    <ArtifactSelector registries={registries} onSelected={onArtifactSelected} />
                </If>
            </IsLoading>
        </Modal>
    );
};
