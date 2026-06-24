import { DateFormatMode } from "@/types/dateFormatMode";

export function formatDate(
  date: Date | string,
  mode: DateFormatMode = "dateTime",
): string {
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    throw new Error("Fecha inválida");
  }

  let options: Intl.DateTimeFormatOptions;

  switch (mode) {
    case "monthYear":
      options = { month: "long", year: "numeric" };
      break;
    case "date":
      options = { day: "2-digit", month: "long", year: "numeric" };
      break;
    case "dateTime":
      options = {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        hour12: true,
      };
      break;
    case "time":
      options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      break;
  }

  const formatted = new Intl.DateTimeFormat("es-MX", options).format(d);

  if (mode === "monthYear") {
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  return formatted;
}
