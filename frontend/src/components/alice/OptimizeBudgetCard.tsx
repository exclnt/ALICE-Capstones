import { Icon } from '@iconify/react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CustomTooltip from '../CustomTooltip.tsx';

const COLORS = ['#166a5b', '#208f7b', '#2fb59c', '#59c6b0', '#8bdecb', '#c2f0e6'];

interface Allocation {
  category: string;
  current_pct: number;
  optimal_pct: number;
  optimal_amount: number;
}

interface OptimizeBudgetCardProps {
  allocations?: Allocation[];
}

export default function OptimizeBudgetCard({ allocations = [] }: OptimizeBudgetCardProps) {
  const chartData = allocations
    .filter((item) => item.optimal_amount > 0)
    .map((item, index) => ({
      category: item.category,
      optimalAmount: item.optimal_amount,
      optimalPercentage: item.optimal_pct / 100,
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
        {chartData.length > 0 ? (
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
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted">
            Tidak ada data alokasi
          </div>
        )}
      </div>
    </section>
  );
}
