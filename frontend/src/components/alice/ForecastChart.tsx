import { Legend, Line, LineChart, Tooltip, XAxis, ResponsiveContainer } from 'recharts';
import CustomTooltip from './CustomTooltip';

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

        <Tooltip cursor={{ stroke: 'orange' }} content={<CustomTooltip />} />
        <Legend style={{ outline: 'none' }} />

        <Line
          style={{ outline: 'none' }}
          name="Prediksi"
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
