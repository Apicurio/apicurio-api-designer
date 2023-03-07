export type SortDirection = "asc" | "desc";
export type SortBy = "name" | "modified-on";

export interface DesignsSort {
    by: SortBy;
    direction: SortDirection;
}
