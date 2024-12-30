export function validateCurrency(value) {
    return value === Number(value).toFixed(2) || value === Number(value).toFixed(0) ? true : false;
}

export function validateTargetMonth (startDate, endDate) {
    return Date.parse(startDate) <= Date.parse(endDate) ? true : false;
}

export function validateTargetBalance (startBalance, endBalance) {
    return endBalance > startBalance ? true : false;
}

function daysInYear(year) {
    return ((year % 4 === 0 && year % 100 > 0) || year %400 == 0) ? 366 : 365;
}

export function estimateSavings(beginningBalance, beginningDate, monthlySavings, estimateType, target){
    const MONTHLY_INTEREST_RATE = (((1+.04)**(1/12))-1)*12;
    return MONTHLY_INTEREST_RATE;
}
