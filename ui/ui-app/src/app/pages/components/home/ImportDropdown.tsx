import { FunctionComponent, useState } from "react";
import { ObjectDropdown } from "@app/components";
import { ImportFrom } from "@app/pages";

type ImportDropdownItem = {
    label: string,
    shortLabel: string,
    handler: () => void;
};

/**
 * Properties
 */
export type ImportDropdownProps = {
    onImport: (from: ImportFrom) => void;
};

/**
 * A control to display the Import dropdown on the main page (used to select how to import content
 * into the API Designer).
 */
export const ImportDropdown: FunctionComponent<ImportDropdownProps> = ({ onImport }: ImportDropdownProps) => {
    const [value, setValue] = useState<ImportDropdownItem>();

    const items: ImportDropdownItem[] = [
        {
            label: "Import from URL",
            shortLabel: "URL",
            handler: () => {
                onImport(ImportFrom.URL);
            }
        },
        {
            label: "Import from file",
            shortLabel: "File",
            handler: () => {
                onImport(ImportFrom.FILE);
            }
        }
    ];

    const onSelect = (value: any | undefined) => {
        setValue(value);
        value.handler();
    };

    return (
        <ObjectDropdown
            value={value}
            items={items}
            itemToString={(item) => item.label as string}
            noSelectionLabel="Import design"
            onSelect={onSelect}
        />
    );
};
