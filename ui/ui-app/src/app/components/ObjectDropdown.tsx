import React, { FunctionComponent, useState } from "react";
import {
    Divider,
    Dropdown,
    DropdownItem,
    DropdownList, DropdownPopperProps,
    MenuToggle,
    MenuToggleElement
} from "@patternfly/react-core";

export const ObjectDropdownItemDivider = {};

/**
 * Properties
 */
export type ObjectDropdownProps = {
    value: any | undefined;
    items: any[];
    onSelect: (value: any | undefined) => void;
    itemToString: (value: any) => string;
    noSelectionLabel?: string;
    menuAppendTo?: HTMLElement | (() => HTMLElement) | "inline";
    variant?: "single" | "checkbox" | "typeahead" | "typeaheadmulti";
};

/**
 * A generic control that makes it easier to create a <Select> from an array of objects.
 */
export const ObjectDropdown: FunctionComponent<ObjectDropdownProps> = (
    { value, items, onSelect, itemToString, noSelectionLabel, menuAppendTo }: ObjectDropdownProps) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const onSelectInternal = (_event: any, value?: string | number | undefined): void => {
        setIsOpen(false);
        const idx: number | undefined = value as number | undefined;
        if (idx && idx >= 0) {
            onSelect(items[idx]);
        } else {
            onSelect(undefined);
        }
    };

    const onToggleClick = () => {
        setIsOpen(!isOpen);
    };

    const popperProps: DropdownPopperProps = {
        appendTo: menuAppendTo
    };

    return (
        <Dropdown
            isOpen={isOpen}
            onSelect={onSelectInternal}
            onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen}>
                    {
                        value ? itemToString(value) : noSelectionLabel
                    }
                </MenuToggle>
            )}
            ouiaId="ObjectDropdown"
            popperProps={popperProps}
            shouldFocusToggleOnSelect
        >
            <DropdownList>
                {
                    items.map((item, index) => {
                        return (
                            item == ObjectDropdownItemDivider ?
                                <Divider component="li" key={`divider-${index}`} />
                                :
                                <DropdownItem value={index} key={`action-${index}`}>
                                    { itemToString(item) }
                                </DropdownItem>
                        );
                    })
                }
            </DropdownList>
        </Dropdown>
    );
};
