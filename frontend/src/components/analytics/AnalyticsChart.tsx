import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import CustomTooltip from '../CustomTooltip';
import type { TransactionItemType } from '../../validator/TransactionSchema';
import { getWeekOfMonth } from 'date-fns';
import _ from 'lodash';

export default function AnalyticsChart({ data = [] }: { data: TransactionItemType[] }) {
  const groupedData = _.groupBy(data, (item) => {
    const weekNumber = getWeekOfMonth(new Date(item.transaction_date));
    return `MINGGU KE-${weekNumber}`;
  });

  const chartData = Object.entries(groupedData)
    .sort(([weekA], [weekB]) => weekA.localeCompare(weekB))
    .map(([week, transactions]) => ({
      date: week,
      amount: transactions.reduce((sum, item) => sum + Number(item.amount), 0),
    }));

  return (
    <div className="w-full h-70 lg:h-full min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickFormatter={(value) => value.replace('MINGGU KE-', 'MG ')}
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
