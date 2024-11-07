// CustomDateRenderer.tsx
import React from "react";
import { format } from "date-fns";

interface CustomDateRendererProps {
  value: string | Date;
}

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

const CustomDateRenderer: React.FC<CustomDateRendererProps> = ({ value }) => {
  if (!value) return null;

  const date = typeof value === "string" ? new Date(value) : value;

  // Format: "15-th Aug 2024"
  const day = format(date, "d");
  const monthYear = format(date, "MMM yyyy");
  const ordinalDay = `${day}${getOrdinal(Number(day))}`;

  return <span>{`${ordinalDay} ${monthYear}`}</span>;
};

export default CustomDateRenderer;
