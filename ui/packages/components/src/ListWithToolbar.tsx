import React, { FunctionComponent } from "react";
import { If } from "./If";
import { IsLoading } from "./IsLoading";

/**
 * Properties
 */
export type ListWithToolbarProps = {
    toolbar: React.ReactNode;
    alwaysShowToolbar?: boolean;
    emptyState: React.ReactNode;
    filteredEmptyState: React.ReactNode;
    isLoading: boolean;
    isFiltered: boolean;
    isEmpty: boolean;
    loadingComponent?: React.ReactNode;
    children?: React.ReactNode;
};

/**
 * Wrapper around a set of arbitrary child elements and displays them only if the
 * indicated condition is true.
 */
export const ListWithToolbar: FunctionComponent<ListWithToolbarProps> = (
    { toolbar, alwaysShowToolbar, emptyState, filteredEmptyState, isLoading, loadingComponent, isEmpty, isFiltered, children }: ListWithToolbarProps) => {

    return (
        <React.Fragment>
            <If condition={alwaysShowToolbar || !isEmpty || isFiltered} children={toolbar} />
            <IsLoading condition={isLoading} loadingComponent={loadingComponent}>
                <If condition={!isEmpty} children={children} />
                <If condition={isEmpty && isFiltered} children={filteredEmptyState} />
                <If condition={isEmpty && !isFiltered} children={emptyState} />
            </IsLoading>
        </React.Fragment>
    );
};
