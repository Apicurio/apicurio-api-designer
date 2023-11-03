import React, { FunctionComponent, useEffect, useState } from "react";
import { Avatar, Dropdown, DropdownItem, DropdownList, MenuToggle, MenuToggleElement } from "@patternfly/react-core";
import { useOidcAuth } from "@app/auth";
import { AuthConfig } from "@services/ServiceConfigContext.tsx";


export type AvatarDropdownProps = {
    // No props
};


export const AvatarDropdown: FunctionComponent<AvatarDropdownProps> = () => {
    const [username, setUsername] = useState("User");
    const [isOpen, setIsOpen] = useState(false);
    const auth: AuthConfig = useOidcAuth();

    const onSelect = (): void => {
        setIsOpen(!isOpen);
    };

    const onToggle = (): void => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        auth.getUsername()?.then(setUsername);
    }, []);

    return (
        <Dropdown
            isOpen={isOpen}
            onSelect={onSelect}
            onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                    ref={toggleRef}
                    onClick={onToggle}
                    isFullHeight={true}
                    isExpanded={isOpen}
                    icon={ <Avatar src="/avatar.png" alt="User" /> }
                >
                    {
                        username
                    }
                </MenuToggle>
            )}
            shouldFocusToggleOnSelect
        >
            <DropdownList>
                <DropdownItem
                    key="link"
                    // Prevent the default onClick functionality for example purposes
                    onClick={(ev: any) => {
                        auth.logout();
                        ev.preventDefault();
                    }}
                >
                    Logout
                </DropdownItem>
            </DropdownList>
        </Dropdown>
    );

};
