import React from "react";

interface Expense {
    description: string;
    quantity: number;
    price: number;
}

interface QuoteTemplateProps {
    type: string;
    customerInfo: string[];
    expenses: Expense[];
    quoteNumber: number;
    date?: Date;
    tax?: number;
}

export default function QuoteTemplate({
    type,
    customerInfo,
    expenses,
    quoteNumber,
    date = new Date(),
    tax = 0
}: QuoteTemplateProps) {
    const dateFormat = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    const expDate = `${date.getMonth() + 2}/${date.getDate()}/${date.getFullYear()}`;
    const grandTotal = expenses.reduce(
        (sum, expense) => sum + expense.quantity * expense.price,
        0
    );

    return (
        <div className=" w-[912px] h-[1056px] flex flex-col bg-white border border-black p-3 text-black">
            <div className="pb-6">
                <div className="flex items-center justify-between text-4xl">
                    <div>Macstudio Nexus</div>
                    <div>Quote</div>
                </div>
                <div className="!text-2xl text-blue-400">{type}</div>
            </div>
            <div className="w-full flex items-start justify-between pb-4">
                <div>
                    <div className="text-2xl border-b-2 border-black w-[20rem] pb-1">Customer Information</div>
                    <div className="!text-sm flex flex-col pt-2">
                        <span>{customerInfo[0]}</span>
                        <span>{customerInfo[1]}</span>
                        <span>{customerInfo[2]}</span>
                        <span>{customerInfo[3]}</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="border-b-2 border-black w-[10rem] pb-2 text-center">{dateFormat}</div>
                    <div className="border-b-2 border-black w-[10rem] pb-2 text-center">&#35; {quoteNumber}</div>
                    <div className="border-b-2 border-black w-[10rem] pb-2 text-center">{expDate}</div>
                </div>
            </div>
            <div className="grid grid-cols-[30rem_1fr_1fr_1fr] grid-rows-auto border border-black place-items-center mb-6">
                <div className="quote-header">Description</div>
                <div className="quote-header">Quantity</div>
                <div className="quote-header">Price</div>
                <div className="quote-header">Total</div>
                {expenses.map((expense, index) => (
                   <div key={index} className="contents">
                        <div className="quote-cell pl-4">{expense.description}</div>
                        <div className="quote-cell text-center">{expense.quantity}</div>
                        <div className="quote-cell text-center">${expense.price}</div>
                        <div className="quote-cell text-center">${expense.quantity * expense.price}</div>
                    </div>
                ))}
            </div>
            <div className="w-full flex items-center justify-between">
                <div>
                    <div className="text-blue-400 text-5xl">THANK YOU</div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div>Subtotal</div>
                        <div className="text-center border-b-2 border-black pb-2 w-[8rem]">
                            ${grandTotal}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div>Tax</div>
                        <div className="text-center border-b-2 border-black pb-2 w-[8rem]">
                            ${tax}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div>Total</div>
                        <div className="text-center border-b-2 border-black pb-2 w-[8rem]">
                            ${tax + grandTotal}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-auto w-full text-center grid grid-cols-3 text-sm">
                <div className="border border-black pb-4 w-[18rem]">
                    This document represents an estimated quote and not a final contracted price. The total cost may adjust based on scope changes or additional features requested during the project.
                </div>
                <div className="w-[20rem] my-auto">
                For questions concerning this quote please contact: Craig Sampson craig@macstudionexus.com, (347) 609-5734
                </div>
                <div className="justify-self-end mt-auto">
                    Page 1 of 1
                </div>
            </div>
        </div>
    );
}
