import { format } from "date-fns";

/**
 * Formats a date string or Date object into a readable format.
 * @param date - The date to format (string or Date object).
 * @param dateFormat - The desired format (default: "yyyy-MM-dd").
 * @returns A formatted date string or "Invalid Date" if input is not valid.
 */

const getOrdinal = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};
export const formatDate = (value: string | Date | null): string => {
  if (!value) return "Invalid Date";

  const date = typeof value === "string" ? new Date(value) : value;

  // Format: "15-th Aug 2024"
  const day = format(date, "d");
  const monthYear = format(date, "MMM yyyy");
  const ordinalDay = `${day}${getOrdinal(Number(day))}`;

  return `${ordinalDay} ${monthYear}`;
};
