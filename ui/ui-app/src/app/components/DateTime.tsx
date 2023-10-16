import { FunctionComponent } from "react";

type dateTypes = string|number|Array<string|number|object>|object;

/**
 * Properties
 */
export type DateTimeProps = {
    date: dateTypes|undefined;
};

export const DateTime: FunctionComponent<DateTimeProps> = ({ date }: DateTimeProps) => {
    // return <Moment date={date} format="DD MMM YYYY, hh:mm UTC" utc={true} />;
    return <span>{date?.toString()}</span>;
};
