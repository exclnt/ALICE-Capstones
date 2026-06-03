import { CurrencyFormatter } from '../utils/CurrencyFormatter';

export default function AnalyticsHeader({ 
  totalExpense, 
  monthName 
}: { 
  totalExpense: number, 
  monthName: string 
}) {
  return (
    <header className="flex flex-row w-full justify-between font-mplus text-text-main">
      <div className="flex flex-col">
        <h3 className="text-gray-400">Total Pengeluaran Bulan {monthName}</h3>
        <h1 className="font-bold text-black text-2xl">
          {CurrencyFormatter(totalExpense.toString())}
        </h1>
      </div>
    </header>
  );
}