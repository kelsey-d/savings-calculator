
"use client"

import { useState } from 'react';
import { validateCurrency, validateTargetMonth, validateTargetBalance } from '../../../lib/util.js';

export default function Page() { //server components have to be asynC?
    const [estimateType, setEstimateType] = useState("balance");
    const [beginningDate, setBeginningDate] = useState("");
    const [beginningBalance, setBeginningBalance] = useState("");
    const [monthlySavings, setMonthlySavings] = useState("");
    const [targetBalance, setTargetBalance] = useState("");
    const [targetMonth, setTargetMonth] = useState("");

    const [isValidBeginningBalance, setIsValidBeginningBalance] = useState(true);
    const [isValidMonthlySavings, setIsValidMonthlySavings] = useState(true);
    const [isValidTargetBalance, setIsValidTargetBalance] = useState(true);
    const [isValidTargetMonth, setIsValidTargetMonth] = useState(true);

    /*onChange Handlers */
    function handleBeginningDate(e) {
        setBeginningDate(e.target.value);
        setIsValidTargetMonth(validateTargetMonth(e.target.value, targetMonth));
    }

    function handleBeginningBalance(e) {
        setBeginningBalance(e.target.value);
        setIsValidBeginningBalance(validateCurrency(e.target.value));
        setIsValidTargetBalance(e.target.value, targetBalance);
    }

    function handleMonthlySavings(e) {
        setMonthlySavings(e.target.value);
        setIsValidMonthlySavings(validateCurrency(e.target.value));
    }

    function handleTargetBalance(e) {
        setTargetBalance(e.target.value);
        setIsValidTargetBalance(validateCurrency(e.target.value) && validateTargetBalance(beginningBalance, e.target.value));
    }

    function handleTargetMonth(e) {
        setTargetMonth(e.target.value);
        setIsValidTargetMonth(validateTargetMonth(beginningDate, e.target.value));
    }
    
    function Input({ type }) {
        switch (type) {
            case "date":
                return (
                    <>
                        <label htmlFor="target-month" className="text-white">Target Month: </label>
                        <input id="target-month" type="month" value={targetMonth} onChange={(e) => handleTargetMonth(e)}/>
                        <small className={`text-red-700 ${isValidTargetMonth ? "hidden" : "" }`}>Target month must be greater than or equal to beginning month.</small>
                    </>
                )
            case "balance":
                return (
                    <>
                        <label htmlFor="target-balance" className="text-white">Target Balance: </label>
                        <input id="target-balance" type="number" placeholder="$0.00" value={targetBalance} onChange={(e) => handleTargetBalance(e)}/>
                        <small className={`text-red-700 ${isValidTargetBalance ? "hidden" : "" }`}>Invalid dollar amount</small>
                    </>
                )
        }
    }



    return (
        <div className="">
        <h1>Savings Calculator</h1>
        <p><i><b>How to use:</b></i> Select whether you want to project when you'll hit a certain balance or how much you'll hit at a certain date.</p>
        <form className="flex flex-col w-1/2 text-black">
            <label htmlFor="beginning-date" className="text-white">Beginning Date: </label>
            <input id="beginning-date" type="date" value={beginningDate} onChange={(e) => handleBeginningDate(e)}/>

            <label htmlFor="beginning-balance" className="text-white">Beginning Balance: </label>
            <input id="beginning-balance" type="number" placeholder="$0.00" value={beginningBalance} onChange={(e) => handleBeginningBalance(e)}/>
            <small className={`text-red-700 ${isValidBeginningBalance ? "hidden" : "" }`}>Invalid dollar amount</small>

            <label htmlFor="monthly-savings" className="text-white">Monthly Savings: </label>
            <input id="monthly-savings" type="number" placeholder="$0.00" value={monthlySavings} onChange={(e) => handleMonthlySavings(e)}/>
            <small className={`text-red-700 ${isValidMonthlySavings ? "hidden" : "" }`}>Invalid dollar amount</small>
            <div className="text-white">
                <button onClick={() =>setEstimateType("date")}>DATE</button>
                <button onClick={() =>setEstimateType("balance")}>BALANCE</button>
            </div>
            <Input type={estimateType} /> {/*Isn't working for some reason */}
            
            <button className="border border-white mt-5 w-1/2 text-white"type="submit" disabled>Predict</button>
        </form>
        </div>
    )
} 