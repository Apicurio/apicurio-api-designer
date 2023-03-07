import React, { FunctionComponent, useEffect, useState } from "react";
import { Select, SelectOption, SelectVariant } from "@patternfly/react-core";
import { SelectOptionObject } from "@patternfly/react-core/src/components/Select/SelectOption";

interface ObjectSelectOptionObject extends SelectOptionObject {
    item: any;
}

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
    menuAppendTo?: HTMLElement | (() => HTMLElement) | "parent" | "inline";
    variant?: "single" | "checkbox" | "typeahead" | "typeaheadmulti";
};

/**
 * A generic control that makes it easier to create a <Select> from an array of objects.
 */
export const ObjectSelect: FunctionComponent<ObjectSelectProps> = (
    { value, items, onSelect, itemToString, noSelectionLabel, toggleId, menuAppendTo, variant }: ObjectSelectProps) => {

    const [isToggled, setToggled] = useState<boolean>(false);
    const [selectObjects, setSelectObjects] = useState<ObjectSelectOptionObject[]>();
    const [selections, setSelections] = useState<ObjectSelectOptionObject[]>();

    const onSelectInternal = (event: React.MouseEvent | React.ChangeEvent, value: string | SelectOptionObject): void => {
        setToggled(false);
        onSelect((value as ObjectSelectOptionObject).item);
    };

    const setSelectedFromValue = (): void => {
        const filtered: ObjectSelectOptionObject[] | undefined = selectObjects?.filter(soo => soo.item === value);
        setSelections(filtered);
    };

    useEffect(() => {
        const theItems: any[] = items || [];
        const selectObjects: ObjectSelectOptionObject[] = theItems.map((item) => {
            return {
                item: item,
                toString: () => {
                    return itemToString(item);
                }
            };
        });
        if (noSelectionLabel !== undefined) {
            const noSelection: ObjectSelectOptionObject = {
                item: undefined,
                toString(): string {
                    return noSelectionLabel;
                }
            };
            setSelectObjects([
                noSelection, ...selectObjects
            ]);
        } else {
            setSelectObjects(selectObjects);
        }
    }, [items]);

    useEffect(() => {
        if (selectObjects) {
            setSelectedFromValue();
        }
    }, [value, selectObjects]);

    return (
        <Select menuAppendTo={menuAppendTo}
            variant={variant || SelectVariant.single}
            onToggle={setToggled}
            toggleId={toggleId}
            onSelect={onSelectInternal}
            isOpen={isToggled}
            selections={selections}>
            {
                selectObjects?.map((soo, index) => (
                    <SelectOption isPlaceholder={soo.item === undefined} key={index} value={soo} />
                ))
            }
        </Select>
    );
};
