import { Icon } from '@iconify/react';
import OptimizeBudgetItem from './OptimizeBudgetItem';

export default function OptimizeBudgetCard() {
  const data = [
    {
      category: 'Bills',
      optimalPercentage: 0.166,
      optimalAmount: 249000,
      actualAmount: 300000,
    },
    {
      category: 'Entertainment',
      optimalPercentage: 0.0,
      optimalAmount: 0,
      actualAmount: 225000,
    },
    {
      category: 'Food',
      optimalPercentage: 0.171,
      optimalAmount: 256500,
      actualAmount: 450000,
    },
    {
      category: 'Hobby',
      optimalPercentage: 0.0,
      optimalAmount: 0,
      actualAmount: 75000,
    },
    {
      category: 'Investment',
      optimalPercentage: 0.461,
      optimalAmount: 691500,
      actualAmount: 0,
    },
    {
      category: 'Shopping',
      optimalPercentage: 0.0,
      optimalAmount: 0,
      actualAmount: 300000,
    },
    {
      category: 'Transport',
      optimalPercentage: 0.202,
      optimalAmount: 303000,
      actualAmount: 150000,
    },
  ];
  return (
    <section className="optimize-budget text-text-main forecast-card w-full h-fit bg-bg-main p-5 rounded-2xl flex flex-col gap-3 ring-1 ring-purple-600/20 shadow-md">
      <div>
        <div className="flex items-center gap-1">
          <Icon icon={'material-symbols:process-chart'} className="text-xl text-purple-600" />
          <h1 className="font-bold">Optimalisasi Budget</h1>
        </div>
        <h3 className="text-xs text-text-muted">Rekomendasi untuk menekan pengeluaran implusif</h3>
      </div>
      <div className="h-full flex flex-col gap-2">
        {data.map((data) => (
          <OptimizeBudgetItem
            key={data.category}
            label={data.category}
            recommendationPercent={data.optimalPercentage}
            currentAmount={data.actualAmount}
            totalBudget={1500000}
          />
        ))}
      </div>
    </section>
  );
}
