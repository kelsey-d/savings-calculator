"use client"

import { useState } from 'react';
import { validateCurrency, validateTargetMonth, validateTargetBalance, estimateSavings } from '../../lib/util.js';
import { DollarSign } from 'lucide-react';

export default function Page() { //server components have to be async?
    const [estimateType, setEstimateType] = useState("date");
    const [beginningDate, setBeginningDate] = useState("");
    const [beginningBalance, setBeginningBalance] = useState("");
    const [monthlySavings, setMonthlySavings] = useState("");
    const [targetBalance, setTargetBalance] = useState("");
    const [targetMonth, setTargetMonth] = useState("");
    const [result, setResult] = useState("");

    const [isValidBeginningBalance, setIsValidBeginningBalance] = useState(true);
    const [isValidMonthlySavings, setIsValidMonthlySavings] = useState(true);
    const [isValidTargetBalance, setIsValidTargetBalance] = useState(true);
    const [isValidTargetMonth, setIsValidTargetMonth] = useState(true);

    /*onChange Handlers */
    function handleBeginningDate(e) {
        setBeginningDate(e.target.value);
        if (targetMonth) {
            setIsValidTargetMonth(validateTargetMonth(e.target.value, targetMonth));
        };
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

    function handleSubmit() {
        if (estimateType === "date") {
            setResult(estimateSavings(beginningBalance, beginningDate, monthlySavings, estimateType, targetMonth));
        } else {
            setResult(estimateSavings(beginningBalance, beginningDate, monthlySavings, estimateType, targetBalance));
        }
        setBeginningDate("")
        setBeginningBalance("");
        setMonthlySavings("");
        setEstimateType("date");
        setTargetMonth("");
    }

    function disableSubmit() {
        if (!beginningBalance || !beginningBalance || !monthlySavings) {
            return true;
        } else if ((estimateType === "month" && !targetMonth) || (estimateType === "balance" && !targetBalance)){
            return true;
        } else {
            return false;
        }
    }
    
    function Input({ type }) {
        function handleTargetBalance(e) {
            setTargetBalance(e.target.value);
            setIsValidTargetBalance(validateCurrency(e.target.value) && validateTargetBalance(beginningBalance, e.target.value));
        }
    
        function handleTargetMonth(e) {
            setTargetMonth(e.target.value);
            setIsValidTargetMonth(validateTargetMonth(beginningDate, e.target.value));
        }
        switch (type) {
        /*Terrible experience typing input */
            case "date":
                return (
                    <>
                        <label htmlFor="target-month" className="text-[#EDEFD0]">Target Month: </label>
                        <input id="target-month" type="month" value={targetMonth} onChange={(e) => handleTargetMonth(e)} className="bg-[#181C3C] text-white rounded-md p-2"/>
                        <small className={`text-red-700 ${isValidTargetMonth ? "hidden" : "" }`}>Target month must be greater than or equal to beginning month.</small>
                    </>
                )
            case "balance":
                return (
                    <>
                        <label htmlFor="target-balance" className="text-[#EDEFD0]">Target Balance: </label>
                        <input id="target-balance" type="number" placeholder="$0.00" value={targetBalance} onChange={(e) => handleTargetBalance(e)} className="bg-[#181C3C] text-white rounded-md p-2"/>
                        <small className={`text-red-700 ${isValidTargetBalance ? "hidden" : "" }`}>Invalid dollar amount</small>
                    </>
                )
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#403D8E] to-[#181C3C] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EDEFD0] to-[#947BCB] shadow-md">Savings Calculator</h1>
        <p className="text-[#EDEFD0] mt-4 text-center">Select whether you want to project when you'll hit a certain balance or how much you'll hit at a certain date.</p>
        {!result && (<form action={handleSubmit} className="flex flex-col w-3/4 max-w-md bg-[#181C3C] p-6 rounded-lg shadow-lg">
            <label htmlFor="beginning-date" className="text-[#EDEFD0]">Beginning Date: </label>
            <input id="beginning-date" type="date" value={beginningDate} onChange={(e) => handleBeginningDate(e)} className="bg-[#181C3C] text-white rounded-md p-2"/>

            <label htmlFor="beginning-balance" className="text-[#EDEFD0]">Beginning Balance: </label>
            <div className="flex items-center gap-x-2"><span className="inline">$</span><input id="beginning-balance" type="number" placeholder="0.00" value={beginningBalance} onChange={(e) => handleBeginningBalance(e)} className="bg-[#181C3C] text-white rounded-md p-2 w-fit inline"/></div>
            <small className={`text-red-700 ${isValidBeginningBalance ? "hidden" : "" }`}>Invalid dollar amount</small>

            <label htmlFor="monthly-savings" className="text-[#EDEFD0]">Monthly Savings: </label>
            <input id="monthly-savings" type="number" placeholder="$0.00" value={monthlySavings} onChange={(e) => handleMonthlySavings(e)} className="bg-[#181C3C] text-white rounded-md p-2"/>
            <small className={`text-red-700 ${isValidMonthlySavings ? "hidden" : "" }`}>Invalid dollar amount</small>
            <label htmlFor="mode-toggle" className="text-[#EDEFD0]">Select a Mode: </label>
            <div id="mode-toggle" className="flex gap-4 mt-2">
                <button type="button" onClick={() => setEstimateType("date")} className={`px-4 py-2 rounded-md ${estimateType === "date" ? "bg-gradient-to-r from-[#EDEFD0] to-[#947BCB] text-[#181C3C]" : "bg-[#181C3C] text-[#EDEFD0] border border-[#947BCB]"}`}>DATE</button>
                <button type="button" onClick={() => setEstimateType("balance")} className={`px-4 py-2 rounded-md ${estimateType === "balance" ? "bg-gradient-to-r from-[#EDEFD0] to-[#947BCB] text-[#181C3C]" : "bg-[#181C3C] text-[#EDEFD0] border border-[#947BCB]"}`}>BALANCE</button>
            </div>
            <Input type={estimateType} />
            
            <button className="mt-5 px-4 py-2 bg-gradient-to-r from-[#EDEFD0] to-[#947BCB] text-[#181C3C] rounded-md shadow-md" type="submit" disabled={disableSubmit()}>CALCULATE</button>
        </form>)}

        {result && (
            <>
            <p className="text-[#EDEFD0] mt-4">{result}</p>
            <button onClick={() => setResult("")} className="mt-4 px-4 py-2 bg-gradient-to-r from-[#EDEFD0] to-[#947BCB] text-[#181C3C] rounded-md shadow-md">RECALCULATE</button>
            </>
        )}
        
        </div>
    )
}