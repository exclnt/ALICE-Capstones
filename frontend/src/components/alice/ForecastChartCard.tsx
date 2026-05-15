import { Icon } from '@iconify/react';
import ForecastChart from './ForecastChart';
interface ForecastChartCardProp {
  data: Array<object>;
}

export default function ForecastChartCard({ data }: ForecastChartCardProp) {
  return (
    <section className="forecast-card w-full h-60 bg-bg-main p-5 rounded-2xl flex flex-col gap-3 ring-1 ring-blue-600/20 shadow-md">
      <div className="text-text-main flex justify-between shrink-0">
        <div>
          <div className="flex items-center gap-1">
            <Icon className="text-xl text-blue-600" icon={'material-symbols:show-chart-rounded'} />
            <h1 className="font-bold">Prediksi Anggaran</h1>
          </div>
          <h3 className="text-xs text-text-muted">Prediksi 10 hari ke depan</h3>
        </div>
        <h2 className="text-xs font-medium text-red-400">DEFISIT</h2>
      </div>
      <div className="h-60 w-full ">
        <ForecastChart data={data} />
      </div>
    </section>
  );
}
