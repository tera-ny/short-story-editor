import dayjs from "dayjs";
import "dayjs/locale/ja";

type Format = "YYYY/MM/DD";

export const format = (date: Date, formatText: Format) => {
  return dayjs(date).locale("ja").format(formatText);
};
