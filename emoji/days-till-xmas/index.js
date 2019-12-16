const startDate = new Date()
// const startDate = new Date('2019-01-25')
const endDate = new Date('2019-12-25')
const daysTillXmas = DaysBetween(startDate, endDate)

const mood = daysTillXmas > 30 ? '🤢' : daysTillXmas > 7 ? '😄' : '😁'

console.log(`It's ${daysTillXmas} 📆 till 🎄, my dudes ${mood}`);


// https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates
function DaysBetween(StartDate, EndDate) {
    // The number of milliseconds in all UTC days (no DST)
    const oneDay = 1000 * 60 * 60 * 24;

    // A day in UTC always lasts 24 hours (unlike in other time formats)
    const start = Date.UTC(EndDate.getFullYear(), EndDate.getMonth(), EndDate.getDate());
    const end = Date.UTC(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate());

    // so it's safe to divide by 24 hours
    return (start - end) / oneDay;
  }
