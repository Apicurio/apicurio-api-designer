import React, { FunctionComponent } from "react";
import Moment from "react-moment";

type dateTypes = string|number|Array<string|number|object>|object;

/**
 * Properties
 */
export type DateTimeProps = {
    date: dateTypes|undefined;
};

export const DateTime: FunctionComponent<DateTimeProps> = ({ date }: DateTimeProps) => {
    return <Moment date={date} format="DD MMM YYYY, hh:mm UTC" utc={true} />;
};
