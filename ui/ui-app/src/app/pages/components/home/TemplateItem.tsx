import { FunctionComponent } from "react";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { Template } from "@models/templates";
import "./TemplateItem.css";

export type TemplateItemProps = {
    template: Template;
    isSelected: boolean;
    onSelect: (template: Template) => void;
}

export const TemplateItem: FunctionComponent<TemplateItemProps> = ({ template, isSelected, onSelect }: TemplateItemProps) => {
    const onClick = (): void => {
        if (!isSelected) {
            onSelect(template);
        }
    };

    return (
        <div className={`template ${isSelected ? "selected" : ""}`} onClick={onClick}>
            <div className="icon">
                <PlusCircleIcon />
            </div>
            <div className="name">{template.name}</div>
        </div>
    );
};
