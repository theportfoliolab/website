const dateFormatter = new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
})

export function formatIsoDate(date: string) {
    const [year, month, day] = date.split("-").map(Number)
    if (!year || !month || !day) {
        return date
    }

    return dateFormatter.format(new Date(Date.UTC(year, month - 1, day)))
}
