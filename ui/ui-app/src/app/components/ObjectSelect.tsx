import React, { FunctionComponent, useState } from "react";
import { MenuToggle, MenuToggleElement, Select, SelectOption } from "@patternfly/react-core";


/**
 * Properties
 */
export type ObjectSelectProps = {
    value: any;
    items: any[];
    onSelect: (value: any) => void;
    itemToString: (value: any) => string;
    noSelectionLabel?: string;
    toggleId?: string;
};

/**
 * A generic control that makes it easier to create a <Select> from an array of objects.
 */
export const ObjectSelect: FunctionComponent<ObjectSelectProps> = (
    { value, items, onSelect, itemToString, noSelectionLabel, toggleId }: ObjectSelectProps) => {

    const [isToggled, setToggled] = useState<boolean>(false);

    const onSelectInternal = (_event: any, value?: string | number): void => {
        setToggled(false);
        onSelect(items[value as number]);
    };

    const toggle = (): void => {
        setToggled(!isToggled);
    };

    const menuToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
            ref={toggleRef}
            onClick={toggle}
            isExpanded={isToggled}
        >
            { value ? itemToString(value) : noSelectionLabel }
        </MenuToggle>
    );

    return (
        <Select
            toggle={menuToggle}
            id={toggleId}
            onSelect={onSelectInternal}
            isOpen={isToggled}>
            {
                items?.map((item, index) => (
                    <SelectOption isSelected={item === value} key={index} value={index}>
                        { itemToString(item) }
                    </SelectOption>
                ))
            }
        </Select>
    );
};
