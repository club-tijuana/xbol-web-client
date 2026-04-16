export function formatCurrency(value: number, currency: string | undefined = "MXN"): string {
    const formatValue = new Intl.NumberFormat(
        "es-MX",
        {
            style: "currency",
            currency: currency
        })
        .format(value);

    return `${formatValue} ${currency}`;
}