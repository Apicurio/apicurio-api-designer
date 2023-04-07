import React, { FunctionComponent, useState } from "react";
import { Dropdown, DropdownItem, DropdownToggle } from "@patternfly/react-core";
import { PageConfig, usePageConfig } from "../../context/PageConfigContext";

export enum ImportFrom {
    FILE,
    URL,
    RHOSR
}

/**
 * Properties
 */
export type ImportDropdownProps = {
    variant: "long"|"short";
    onImport: (from: ImportFrom) => void;
};

/**
 * A control to display the Import dropdown on the main page (used to select how to import content
 * into the API Designer).
 */
export const ImportDropdown: FunctionComponent<ImportDropdownProps> = ({ variant, onImport }: ImportDropdownProps) => {
    const [isToggled, setToggled] = useState(false);
    const pageConfig: PageConfig = usePageConfig();

    const onToggle = (value: boolean): void => {
        setToggled(value);
    };

    const onMenuSelect: (event?: React.SyntheticEvent<HTMLDivElement>) => void = (event) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const action: string = event?.target.attributes["data-id"].value;
        setToggled(false);
        switch (action) {
            case "action-file":
                onImport(ImportFrom.FILE);
                return;
            case "action-url":
                onImport(ImportFrom.URL);
                return;
            case "action-rhosr":
                onImport(ImportFrom.RHOSR);
                return;
        }
    };

    const importItems = [
        <DropdownItem key="action-rhosr" data-id="action-rhosr">Import from Service Registry</DropdownItem>,
        <DropdownItem key="action-url" data-id="action-url">Import from URL</DropdownItem>,
        <DropdownItem key="action-file" data-id="action-file">Import from file</DropdownItem>,
    ];
    if (pageConfig.serviceConfig.registry?.api === "none") {
        importItems.splice(0, 1);
    }

    return (
        <Dropdown
            onSelect={onMenuSelect}
            toggle={
                <DropdownToggle id="import-toggle" toggleVariant="secondary" onToggle={onToggle} style={{ paddingRight: "5px" }}>
                    {variant === "short" ? "Import" : "Import design"}
                </DropdownToggle>
            }
            isOpen={isToggled}
            isPlain
            dropdownItems={importItems}
            position="right"
        />
    );
};
