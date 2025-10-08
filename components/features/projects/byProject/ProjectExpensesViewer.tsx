"use client";

import { HandCoins, Trash } from "lucide-react";
import { useState } from "react";
// import ProjectExpensesForm from "./ProjectExpensesForm";

export default function ProjectExpensesViewer({
  expenses,
  id,
}: {
  expenses: Record<string, number>;
  id: string;
}) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [isPending, setIsPending] = useState(false);
  let total;

  if (expenses) {
    total = Object.values(expenses).reduce((sum, value) => sum + value, 0);
  } else {
    total = 0;
  }

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();

    // Validate
    if (!expenseName || !expenseAmount) return;

    setIsPending(true);

    try {
      // Create FormData
      const formData = new FormData();

      // MERGE new expense with existing expenses
      const updatedExpenses = {
        ...expenses,
        [expenseName]: parseFloat(expenseAmount),
      };

      // Add as JSON string
      formData.append("expenses", JSON.stringify(updatedExpenses));

      // Dynamic import of server action
      const { updateExpenses } = await import("@/actions/projects/webProjects");

      // Call the server action
      await updateExpenses(id, formData);

      // Success - reset form
      setExpenseName("");
      setExpenseAmount("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add expense:", error);
    } finally {
      setIsPending(false);
    }
  }

  async function handleDeleteExpense(expenseKey: string) {
    if (!confirm(`Delete ${expenseKey}?`)) return;

    setIsPending(true);

    try {
      // Dynamic import of server action
      const { deleteExpense } = await import("@/actions/projects/webProjects");

      // Call the server action
      await deleteExpense(id, expenseKey);
    } catch (error) {
      console.error("Failed to delete expense:", error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 bg-component-bg rounded-xl border border-border p-4 min-w-full min-h-[250px]">
      <div className="flex items-center justify-start gap-3 w-full">
        <HandCoins className="size-12 text-neon-green bg-neon-green-trans rounded-xl p-2" />
        <h1 className="text-2xl">Expenses</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
          }}
          className="project-page-button ml-auto"
        >
          {showForm ? "Cancel" : "Add Expense"}
        </button>
      </div>
      {showForm ? (
        // Show the FORM when showForm is true
        <form
          onSubmit={handleAddExpense}
          className="mt-4 p-4 bg-component-bg rounded-xl border border-border"
        >
          <div className="flex justify-center items-center gap-3">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Expense"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className="flex-1 p-2 rounded border"
                required
              />

              <input
                type="number"
                step="1"
                placeholder="Amount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="w-32 p-2 rounded border"
                required
              />
            </div>
            <div className="self-end">
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-neon-green text-black rounded cursor-pointer hover:bg-neon-green-trans hover:text-text-light"
              >
                {isPending ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        // Show the EXPENSES LIST when showForm is false
        <>
          <div className="max-h-30 w-full overflow-y-auto scrollbar-hide bg-main-bg border border-border">
            <div className="sticky top-0 grid grid-cols-[2fr_1.5fr_0.5fr] items-center border-b border-border px-4 text-accent bg-main-bg">
              <span className="text-lg font-semibold">Expense</span>
              <span className="text-lg font-semibold">Amount</span>
              <span className="text-sm font-semibold justify-self-center">
                Delete
              </span>
            </div>
            {expenses &&
              Object.entries(expenses).map(([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-[2fr_1.5fr_0.5fr] items-center border-b  border-border px-4 py-0.5"
                >
                  <span className="font-semibold">{key}</span>{" "}
                  <span className="">${value}</span>
                  <button
                    onClick={() => handleDeleteExpense(key)}
                    className="text-red-500 hover:text-red-900 cursor-pointer justify-self-center"
                    type="button"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>
              ))}
          </div>
          <span className="text-green-500 self-start text-lg">
            Total: ${total}
          </span>
        </>
      )}
    </div>
  );
}
