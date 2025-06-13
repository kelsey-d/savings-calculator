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
  const [beginningDate, setBeginningDate] = useState('')
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

    if (targetMonth) {
      setIsValidTargetMonth(validateTargetMonth(value, targetMonth))
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
    setIsValidTargetMonth(validateTargetMonth(beginningDate, value))
  }

  function handleSubmit() {
    if (estimateType === 'date') {
      setResult(
        estimateSavings(
          beginningBalance,
          beginningDate,
          monthlySavings,
          estimateType,
          targetMonth
        )
      )
    } else {
      setResult(
        estimateSavings(
          beginningBalance,
          beginningDate,
          monthlySavings,
          estimateType,
          targetBalance
        )
      )
    }
    setBeginningDate('')
    setBeginningBalance('')
    setMonthlySavings('')
    setEstimateType('date')
    setTargetMonth('')
  }

  function disableSubmit() {
    if (!beginningBalance || !beginningBalance || !monthlySavings) {
      return true
    } else if (
      (estimateType === 'month' && !targetMonth) ||
      (estimateType === 'balance' && !targetBalance)
    ) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className="min-h-screen font-roboto w-full bg-gradient-to-b from-[#403D8E] to-[#181C3C] flex flex-col items-center justify-center">
      <h1 className="text-5xl font-black font-pixelify-sans text-shadow-cyan-500/50 text-transparent text-center bg-clip-text bg-gradient-to-b from-[#EDEFD0] to-[#947BCB] uppercase">
        Savings <br />
        Calculator
      </h1>
      <p className="text-[#EDEFD0] my-4 text-center text-shadow-lg/30">
        <span className="font-bold">How to use</span>: Select whether you want
        to project when you'll hit a certain balance or how much you'll hit at a
        certain date.
      </p>
      {!result && (
        <form
          action={handleSubmit}
          className="flex flex-col justify-center items-center w-full"
        >
          <div className="flex flex-col md:w-2/5 p-6 rounded-lg shadow-lg bg-[#947BCB]/20 border border-[#947BCB]">
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
            <small
              className={`text-red-700 ${
                isValidBeginningBalance ? 'hidden' : ''
              }`}
            >
              Invalid dollar amount
            </small>

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
            <small
              className={`text-red-700 ${
                isValidMonthlySavings ? 'hidden' : ''
              }`}
            >
              Invalid dollar amount
            </small>
            <label htmlFor="mode-toggle" className="text-[#EDEFD0] uppercase">
              Select a Mode:
            </label>
            <div id="mode-toggle" className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => setEstimateType('date')}
                className={`px-4 py-2 rounded-md ${
                  estimateType === 'date'
                    ? 'bg-gradient-to-b from-[#EEFFD0] to-[#947BCB] text-[#181C3C]'
                    : 'bg-[#181C3C] text-[#947BCB] border border-[#947BCB]'
                }`}
              >
                DATE
              </button>
              <button
                type="button"
                onClick={() => setEstimateType('balance')}
                className={`px-4 py-2 rounded-md ${
                  estimateType === 'balance'
                    ? 'bg-gradient-to-b from-[#EDEFD0] to-[#947BCB] text-[#181C3C]'
                    : 'bg-[#181C3C] text-[#947BCB] border border-[#947BCB]'
                }`}
              >
                BALANCE
              </button>
            </div>
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
                <small
                  className={`text-red-700 ${
                    isValidTargetMonth ? 'hidden' : ''
                  }`}
                >
                  Target month must be greater than or equal to beginning month.
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
                <small
                  className={`text-red-700 ${
                    isValidTargetBalance ? 'hidden' : ''
                  }`}
                >
                  Invalid dollar amount
                </small>
              </>
            )}
          </div>
          <button
            className={`mt-5 px-4 py-2 rounded-md shadow-md ${
              disableSubmit()
                ? 'text-[#947BCB] border border-[#947BCB]'
                : 'bg-gradient-to-b from-[#EDEFD0] to-[#947BCB] text-[#181C3C]'
            }`}
            type="submit"
            disabled={disableSubmit()}
          >
            CALCULATE
          </button>
        </form>
      )}

      {result && (
        <>
          <p className="text-[#EDEFD0] mt-4">{result}</p>
          <button
            onClick={() => setResult('')}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-[#EDEFD0] to-[#947BCB] text-[#181C3C] rounded-md shadow-md"
          >
            RECALCULATE
          </button>
        </>
      )}
    </div>
  )
}
