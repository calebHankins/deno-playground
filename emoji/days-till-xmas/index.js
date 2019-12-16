// Default our start date to now, but also accept the first command line arg
const startDate =
    process.argv[2] ? new Date(process.argv[2])
        : new Date()

// Figure out how many days we have to wait for our presents
const daysTillXmas = getDaysTillXmas(startDate)

// Assess how we feel about that
const mood =
    isNaN(daysTillXmas) ? '🤔'
        : daysTillXmas > 30 ? '🤢'
            : daysTillXmas > 7 ? '😄'
                : daysTillXmas > 1 ? '😁'
                    : '🎅'

// Then tell folks
console.log(`It's ${daysTillXmas} 📆  till 🎄, my dudes ${mood}`);

/**
 * Returns the next date of Xmas relative to the supplied StartDate
 * @param StartDate Date A starting date from which to calculate the next Xmas coming up
 *
 */
function getDaysTillXmas(StartDate) {
    // First guess for the date of a new xmas.
    // Months are 0 offset (obv...)
    // https://stackoverflow.com/questions/32759116/javascript-date-new-month-offset
    const nextXmasFirstGuess = new Date(StartDate.getFullYear(), 11, 25)

    // How many days do we have left?
    let daysLeft = getDaysBetween(StartDate, nextXmasFirstGuess)

    // If we're past xmas for the year, roll over to next year
    if (daysLeft < 0) {
        const nextXmasSecondGuess = new Date(StartDate.getFullYear() + 1, 11, 25)
        daysLeft = getDaysBetween(StartDate, nextXmasSecondGuess)
    }
    return daysLeft
}

// https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates
function getDaysBetween(StartDate, EndDate) {
    // The number of milliseconds in all UTC days (no DST)
    const oneDay = 1000 * 60 * 60 * 24;

    // A day in UTC always lasts 24 hours (unlike in other time formats)
    const start = Date.UTC(EndDate.getFullYear(), EndDate.getMonth(), EndDate.getDate());
    const end = Date.UTC(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate());

    // so it's safe to divide by 24 hours
    return (start - end) / oneDay;
}
