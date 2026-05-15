import {
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  ResponsiveContainer,
} from 'recharts';

interface ForecastChartProp {
  data: Array<object>;
}

export default function ForecastChart({ data }: ForecastChartProp) {
  return (
    <ResponsiveContainer
      width="100%"
      height={150}
      minWidth={0}
      minHeight={0}
      style={{ outline: 'none' }}
    >
      <LineChart data={data} className="w-full h-full" style={{ outline: 'none' }}>
        <XAxis
          style={{ outline: 'none' }}
          dataKey="date"
          stroke="#0081C4"
          tick={{ fill: 'gray', fontSize: 12, fontWeight: 'bold' }}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString('id-ID', {
              month: 'short',
              day: 'numeric',
            });
          }}
        />

        <Tooltip
          cursor={{ stroke: 'orange' }}
          contentStyle={{
            color: 'var(--color-text-main)',
            backgroundColor: 'var(--color-bg-main)',
            borderColor: '#0081C4',
            borderRadius: 5,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          }}
        />
        <Legend style={{ outline: 'none' }} />

        <ReferenceLine
          style={{ outline: 'none' }}
          y={0}
          label={{
            value: 'Rp0 Defisit',
            position: 'insideLeft',
            fill: 'red',
            fontSize: 12,
            dy: 10,
          }}
          stroke="red"
        />

        <Line
          style={{ outline: 'none' }}
          name="Actual"
          type="linear"
          dataKey="actual"
          stroke="#0081C4"
          strokeWidth={3}
          dot={false}
          connectNulls={false}
        />

        <Line
          style={{ outline: 'none' }}
          name="Forecast"
          type="linear"
          dataKey="forecast"
          stroke="orange"
          strokeWidth={3}
          strokeDasharray="2 4"
          dot={false}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
