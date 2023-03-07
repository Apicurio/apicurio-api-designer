import React, { FunctionComponent } from "react";
import { PlusCircleIcon } from "@patternfly/react-icons";
import { Template } from "@apicurio/apicurio-api-designer-models";
import styled from "styled-components";

export type TemplateItemProps = {
    template: Template;
    isSelected: boolean;
    onSelect: (template: Template) => void;
}

const TemplateDiv = styled.div.attrs(props => ({
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
    isSelected: props.isSelected || false
}))`
    width: 125px;
    height: 120px;
    border: 1px solid #ccc;
    padding: 2px;
    border-bottom: ${props => props.isSelected ? "2px solid blue" : "1px solid #ccc"};
    margin-top: ${props => props.isSelected ? "-5px" : "0px"};
    &:hover {
        cursor: pointer;
        background-color: #eee;
        border-color: #bbb;
    }
`;

const IconDiv = styled.div.attrs(props => ({
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
    isSelected: props.isSelected || false
}))`
    width: 100%;
    text-align: center;
    color: ${props => props.isSelected ? "rgb(0, 102, 204)" : "#666"};
    font-size: 17px;
    margin-top: 15px;
    margin-bottom: 10px;
`;

const NameDiv = styled.div.attrs(props => ({
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
    isSelected: props.isSelected || false
}))`
    width: 100%;
    text-align: center;
    font-size: 15px;
    color: ${props => props.isSelected ? "rgb(0, 102, 204)" : "inherit"};
`;

export const TemplateItem: FunctionComponent<TemplateItemProps> = ({ template, isSelected, onSelect }: TemplateItemProps) => {
    const onClick = (): void => {
        if (!isSelected) {
            onSelect(template);
        }
    };

    return (
        <TemplateDiv isSelected={isSelected} onClick={onClick}>
            <IconDiv isSelected={isSelected}>
                <PlusCircleIcon />
            </IconDiv>
            <NameDiv isSelected={isSelected}>{template.name}</NameDiv>
        </TemplateDiv>
    );
};
