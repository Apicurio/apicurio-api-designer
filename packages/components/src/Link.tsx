import * as React from "react";
import styled from "styled-components";

const BoldSpan = styled.span`
    font-weight: bold;
    color: black;
`;


interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children: React.ReactNode;
    href: string;
}

export const Link = (props: LinkProps) => {
    const { children, href, ...rest } = props;

    if (rest.target === "_blank") {
        rest.rel = "noopener noreferrer";
    }

    return (
        <a className="my-link" href={href} {...rest}>
            <BoldSpan>Link:</BoldSpan>
            <span> </span>
            <span>{children}</span>
        </a>
    );
};
