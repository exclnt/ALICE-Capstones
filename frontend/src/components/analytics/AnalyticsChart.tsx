import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../CustomTooltip';
import getDayName from '../utils/GetDayName';

interface ChartData {
  date: string;
  amount: number;
}

const MOCK_CHART_DATA: ChartData[] = [
  { date: '22-06-2026', amount: 45000 },
  { date: '23-06-2026', amount: 82000 },
  { date: '24-06-2026', amount: 31000 },
  { date: '25-06-2026', amount: 120000 },
  { date: '26-06-2026', amount: 67000 },
  { date: '27-06-2026', amount: 95000 },
  { date: '28-06-2026', amount: 52000 },
];

export default function AnalyticsChart() {
  return (
    <div className="w-full h-70 lg:h-full min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={MOCK_CHART_DATA}>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => getDayName(value, 'short')}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            hide={true}
            dy={10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" fill="var(--color-primary)" radius={[6, 6, 0, 0]} barSize={100} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
