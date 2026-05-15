import { Icon } from '@iconify/react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';

const COLORS = ['#166a5b', '#208f7b', '#2fb59c', '#59c6b0', '#8bdecb', '#c2f0e6'];

export default function OptimizeBudgetCard() {
  const data = [
    { category: 'Bills', optimalPercentage: 0.166, optimalAmount: 249000 },
    { category: 'Entertainment', optimalPercentage: 0.0, optimalAmount: 0 },
    { category: 'Food', optimalPercentage: 0.171, optimalAmount: 256500 },
    { category: 'Hobby', optimalPercentage: 0.0, optimalAmount: 0 },
    { category: 'Investment', optimalPercentage: 0.461, optimalAmount: 691500 },
    { category: 'Shopping', optimalPercentage: 0.0, optimalAmount: 0 },
    { category: 'Transport', optimalPercentage: 0.202, optimalAmount: 303000 },
  ];

  const chartData = data
    .filter((item) => item.optimalAmount > 0)
    .map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length],
    }));

  return (
    <section className="optimize-budget text-text-main forecast-card w-full h-fit bg-bg-main p-5 rounded-2xl flex flex-col gap-3 ring-1 ring-primary/20 shadow-md">
      <div>
        <div className="flex items-center gap-1">
          <Icon icon={'material-symbols:pie-chart'} className="text-xl text-primary" />
          <h1 className="font-bold">Optimalisasi Budget</h1>
        </div>
        <h3 className="text-xs text-text-muted">Distribusi pengeluaran rekomendasi</h3>
      </div>

      <div className="h-75 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="optimalAmount"
              nameKey="category"
              label={(entry) => `${((entry.percent || 0) * 100).toFixed(1)}%`}
            />
            <Legend verticalAlign="bottom" height={36} />
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
