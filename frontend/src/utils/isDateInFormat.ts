import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const isDateInFormat = (date: string, format: string) => {
  return dayjs(date, format, true).isValid();
};

export default isDateInFormat;
