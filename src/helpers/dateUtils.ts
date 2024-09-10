import { DateTime } from "ts-luxon";

export const getLocalDateTime = (val: string | Date) =>
  typeof val === "string"
    ? DateTime.fromISO(val).toLocaleString(DateTime.DATETIME_SHORT)
    : DateTime.fromJSDate(val).toLocaleString(DateTime.DATETIME_SHORT);
