import { HandCoins } from "lucide-react";

export default function ProjectExpensesViewer({
  expenses,
}: {
  expenses: Record<string, number>;
}) {
  const total = Object.values(expenses).reduce((sum, value) => sum + value, 0);

  return (
    <div className="flex flex-col items-center justify-between gap-5 bg-component-bg rounded-xl border border-border p-4">
      <div className="flex items-center justify-left gap-3 w-full">
        <HandCoins className="size-12 text-neon-green bg-neon-green-trans rounded-xl p-2" />
        <h1 className="text-2xl">Expenses</h1>
        <span className="pl-5 text-green-500">Total: ${total}</span>
      </div>
      <div className="max-h-30 w-full overflow-y-auto bg-main-bg">
        {expenses &&
          Object.entries(expenses).map(([key, value]) => (
            <div
              key={key}
              className="grid grid-cols-[2fr_1fr] border-b border-border"
            >
              <span className="font-semibold">{key}:</span> <span className="justify-self-end pr-4">${value}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
