'use client'

import { useState } from 'react'
import {
  validateCurrency,
  validateTargetMonth,
  validateTargetBalance,
  estimateSavings,
} from '../../lib/util.js'
import { DollarSign, Calendar } from 'lucide-react'

export default function Page() {
  //server components have to be async?
  const [estimateType, setEstimateType] = useState('date')
  const [beginningDate, setBeginningDate] = useState()
  const [beginningBalance, setBeginningBalance] = useState('')
  const [monthlySavings, setMonthlySavings] = useState('')
  const [targetBalance, setTargetBalance] = useState('')
  const [targetMonth, setTargetMonth] = useState('')
  const [result, setResult] = useState('')

  const [isValidBeginningBalance, setIsValidBeginningBalance] = useState(true)
  const [isValidMonthlySavings, setIsValidMonthlySavings] = useState(true)
  const [isValidTargetBalance, setIsValidTargetBalance] = useState(true)
  const [isValidTargetMonth, setIsValidTargetMonth] = useState(true)

  /*onChange Handlers */
  function handleBeginningDate(e) {
    let value = e.target.value
    const partialRegexes = [
      /^[0-1]/,
      /^0[1-9]|1[0-2]/,
      /^(0[1-9]|1[0-2])\//,
      /^(0[1-9]|1[0-2])\/[0-3]$/, // Fixed: Added parentheses to properly group the month part
      /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])/,
      /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\//,
      /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/[1-9]/,
    ]

    // Check each section of the input against the corresponding regex
    if (!value.length) {
      setBeginningDate(value)
    } else if (value.length < 7) {
      if (
        (value.length == 2 || value.length == 5) &&
        beginningDate.length < value.length
      ) {
        value += '/' // Add a slash after month and day
      }

      if (partialRegexes[value.length - 1].test(value)) {
        setBeginningDate(value)
      }
    } else if (value.length >= 7 && value.length <= 10) {
      setBeginningDate(value)
    }
  }

  function handleBeginningBalance(e) {
    setBeginningBalance(e.target.value)
    setIsValidBeginningBalance(validateCurrency(e.target.value))
    setIsValidTargetBalance(e.target.value, targetBalance)
  }

  function handleMonthlySavings(e) {
    setMonthlySavings(e.target.value)
    setIsValidMonthlySavings(validateCurrency(e.target.value))
  }

  function handleTargetBalance(e) {
    setTargetBalance(e.target.value)
    setIsValidTargetBalance(
      validateCurrency(e.target.value) &&
        validateTargetBalance(beginningBalance, e.target.value)
    )
  }

  function handleTargetMonth(e) {
    let value = e.target.value
    const monthRegexes = [
      /^[0-1]/,
      /^0[1-9]|1[0-2]/,
      /^(0[1-9]|1[0-2])\//,
      /^(0[1-9]|1[0-2])\/\d/,
      /^(0[1-9]|1[0-2])\/\d{4}$/,
    ]

    if (!value.length) {
      setTargetMonth(value)
    } else if (value.length < 3) {
      if (value.length == 2 && targetMonth.length < value.length) {
        value += '/'
      }
      if (monthRegexes[value.length - 1].test(value)) {
        setTargetMonth(value)
      }
    } else if (value.length >= 3 && value.length <= 7) {
      setTargetMonth(value)
    }

    if (value.length === 7) {
      setIsValidTargetMonth(validateTargetMonth(beginningDate, value))
    } else {
      setIsValidTargetMonth(true)
    }
  }

  function handleSubmit() {
    setResult(
      estimateSavings(
        parseInt(beginningBalance),
        beginningDate,
        parseInt(monthlySavings) || 0,
        estimateType,
        targetMonth,
        targetBalance
      )
    )
    setBeginningDate('')
    setBeginningBalance('')
    setMonthlySavings('')
    setEstimateType('date')
    setTargetMonth('')
    setTargetBalance('')

    setIsValidBeginningBalance(true)
    setIsValidMonthlySavings(true)
    setIsValidTargetBalance(true)
    setIsValidTargetMonth(true)
  }

  function disableSubmit() {
    if (
      !beginningBalance ||
      !beginningDate ||
      (estimateType === 'date' && !targetMonth) ||
      (estimateType === 'balance' && !targetBalance) ||
      !isValidBeginningBalance ||
      (monthlySavings && !isValidMonthlySavings) ||
      !isValidTargetBalance ||
      !isValidTargetMonth
    ) {
      return true
    }

    return false
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-5xl font-black font-pixelify-sans text-shadow-cyan-500/50 text-transparent text-center bg-clip-text bg-gradient-to-b from-[#EDEFD0] to-[#947BCB] uppercase">
        Savings <br />
        Calculator
      </h1>
      <p className="text-[#EDEFD0] m-6 md:w-3/5 text-center text-shadow-lg/30 text-sm">
        <span className="font-bold">How to use</span>: Select whether you want
        to project when you'll hit a certain balance or how much you'll hit at a
        certain date.
      </p>
      {!result && (
        <form
          action={handleSubmit}
          className="flex flex-col justify-center items-center w-full"
        >
          <div className="flex flex-col gap-y-4 md:w-2/5 p-6 rounded-lg shadow-lg bg-[#947BCB]/20 border border-[#947BCB]">
            <div>
              <label
                htmlFor="beginning-date"
                className="text-[#EDEFD0] uppercase"
              >
                Beginning Date:{' '}
              </label>
              <div className="input">
                <Calendar className="size-4" />
                <input
                  id="beginning-date"
                  type="text"
                  placeholder="mm/dd/yyyy"
                  value={beginningDate}
                  onChange={(e) => handleBeginningDate(e)}
                  className="bg-inherit text-white focus:border-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="beginning-balance"
                className="text-[#EDEFD0] uppercase"
              >
                Beginning Balance:{' '}
              </label>
              <div className="input">
                <DollarSign className="size-4" />
                <input
                  id="beginning-balance"
                  type="number"
                  placeholder="0.00"
                  value={beginningBalance}
                  onChange={(e) => handleBeginningBalance(e)}
                  className="bg-inherit text-white no-arrows"
                />
              </div>
              <small className={isValidBeginningBalance ? 'hidden' : ''}>
                Invalid dollar amount
              </small>
            </div>

            <div>
              <label
                htmlFor="monthly-savings"
                className="text-[#EDEFD0] uppercase"
              >
                Monthly Savings:
              </label>
              <div className="input">
                <DollarSign className="size-4" />
                <input
                  id="monthly-savings"
                  type="number"
                  placeholder="0.00"
                  value={monthlySavings}
                  onChange={(e) => handleMonthlySavings(e)}
                  className="bg-inherit text-white no-arrows"
                />
              </div>
              <small className={isValidMonthlySavings ? 'hidden' : ''}>
                Invalid dollar amount
              </small>
            </div>

            <div>
              <label htmlFor="mode-toggle" className="text-[#EDEFD0] uppercase">
                Select a Mode:
              </label>
              <div id="mode-toggle" className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setEstimateType('date')}
                  data-deselected={estimateType != 'date'}
                >
                  DATE
                </button>
                <button
                  type="button"
                  onClick={() => setEstimateType('balance')}
                  data-deselected={estimateType != 'balance'}
                >
                  BALANCE
                </button>
              </div>
            </div>

            <div>
              {estimateType === 'date' && (
                <>
                  <label
                    htmlFor="target-month"
                    className="text-[#EDEFD0] uppercase"
                  >
                    Target Month:
                  </label>
                  <div className="input">
                    <Calendar className="size-4" />
                    <input
                      id="target-month"
                      type="text"
                      placeholder="mm/yyyy"
                      value={targetMonth}
                      onChange={(e) => handleTargetMonth(e)}
                      className="bg-inherit text-white"
                    />
                  </div>
                  <small className={isValidTargetMonth ? 'hidden' : ''}>
                    Target month must be greater than or equal to beginning
                    month.
                  </small>
                </>
              )}
              {estimateType === 'balance' && (
                <>
                  <label
                    htmlFor="target-balance"
                    className="text-[#EDEFD0] uppercase"
                  >
                    Target Balance:
                  </label>
                  <div className="input">
                    <DollarSign className="size-4" />
                    <input
                      id="target-balance"
                      type="number"
                      placeholder="0.00"
                      value={targetBalance}
                      onChange={(e) => handleTargetBalance(e)}
                      className="bg-inherit text-white no-arrows"
                    />
                  </div>
                  <small className={isValidTargetBalance ? 'hidden' : ''}>
                    Invalid dollar amount
                  </small>
                </>
              )}
            </div>
          </div>
          <button type="submit" className="mt-5" disabled={disableSubmit()}>
            CALCULATE
          </button>
        </form>
      )}

      {result && (
        <>
          <p className="text-[#EDEFD0] font-bold text-lg">{result}</p>
          <button className="mt-10" onClick={() => setResult('')}>
            RECALCULATE
          </button>
        </>
      )}
    </div>
  )
}
