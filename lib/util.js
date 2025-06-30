export function validateCurrency(value) {
  return value === Number(value).toFixed(2) ||
    value === Number(value).toFixed(0)
    ? true
    : false
}

export function validateTargetMonth(startDate, endDate) {
  return Date.parse(startDate) <= Date.parse(formatTargetMonth(endDate))
}

export function validateTargetBalance(startBalance, endBalance) {
  return endBalance > startBalance
}

function daysInYear(year) {
  return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365
}

export function daysInMonth(month, year) {
  const thirtyDaysMonths = [3, 5, 8, 10] // April, June, September, November
  const thirtyOneDaysMonths = [0, 2, 4, 6, 7, 9, 11] // January, March, May, July, August, October, December

  if (month === 1) {
    // February
    return daysInYear(year) === 366 ? 29 : 28
  }

  if (thirtyDaysMonths.includes(month)) {
    return 30
  }

  if (thirtyOneDaysMonths.includes(month)) {
    return 31
  }

  throw new Error('Invalid month. Month should be between 0 and 11')
}

const formatTargetMonth = (targetMonth) => {
  const targetMonthArray = targetMonth.split('/')
  return new Date(
    targetMonthArray[1],
    targetMonthArray[0] - 1,
    daysInMonth(targetMonthArray[0] - 1, targetMonthArray[1])
  )
}

function roundToCents(x) {
  return Number.parseFloat(x).toFixed(2)
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}

export function estimateSavings(
  beginningBalance,
  beginningDate,
  monthlySavings = 0,
  estimateType,
  targetMonth,
  targetBalance
) {
  const MONTHLY_INTEREST_RATE = ((1 + 0.04) ** (1 / 12) - 1) * 12
  const DAILY_ACCURAL = (MONTHLY_INTEREST_RATE * beginningBalance) / 365
  let endingBalance = beginningBalance
  let currentDate = new Date(beginningDate)

  if (estimateType === 'date') {
    const targetDate = formatTargetMonth(targetMonth)

    endingBalance += monthlySavings
    DAILY_ACCURAL *
      (daysInMonth(currentDate.getMonth(), currentDate.getFullYear()) -
        currentDate.getDate()) //first calculate for the current month

    currentDate.setMonth(currentDate.getMonth() + 1)
    while (currentDate < targetDate) {
      endingBalance +=
        monthlySavings +
        DAILY_ACCURAL *
          daysInMonth(currentDate.getMonth(), currentDate.getFullYear())
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    return `By the end of ${formatDate(
      targetDate
    )} you'll have saved $${roundToCents(endingBalance)}!`
  }

  if (estimateType === 'balance') {
    while (endingBalance < targetBalance) {
      endingBalance +=
        DAILY_ACCURAL *
        daysInMonth(currentDate.getMonth(), currentDate.getFullYear())
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    return `You'll reach your target balance of $${roundToCents(
      targetBalance
    )} by the end of ${formatDate(currentDate)}`
  }
}
