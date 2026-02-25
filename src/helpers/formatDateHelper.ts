type DateFormatMode = "monthYear" | "date" | "dateTime";

export function formatDate(date: Date | string, mode: DateFormatMode = "dateTime"): string {
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
                hour12: true
            };
            break;
    }

    return new Intl.DateTimeFormat("es-MX", options).format(d);
}