export function validateCurrency(value) {
    return value === Number(value).toFixed(2) || value === Number(value).toFixed(0) ? true : false;
}

export function validateTargetMonth (startDate, endDate) {
    return Date.parse(startDate) <= Date.parse(endDate) ? true : false;
}

export function validateTargetBalance (startBalance, endBalance) {
    return endBalance > startBalance ? true : false;
}