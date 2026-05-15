import AliceHeader from '../components/alice/AliceHeader';
import ForecastChartCard from '../components/alice/ForecastChartCard';
import OptimizeBudgetCard from '../components/alice/OptimizeBudgetCard';

export default function Alice() {
  const forecastDummyData = [
    { date: '2026-05-05', actual: 1600, forecast: null },
    { date: '2026-05-06', actual: 2400, forecast: null },
    { date: '2026-05-07', actual: 2800, forecast: null },
    { date: '2026-05-08', actual: 3200, forecast: null },
    { date: '2026-05-09', actual: 3000, forecast: null },
    { date: '2026-05-10', actual: 1600, forecast: null },
    { date: '2026-05-11', actual: 2400, forecast: null },
    { date: '2026-05-12', actual: 2800, forecast: null },
    { date: '2026-05-13', actual: 3200, forecast: null },
    { date: '2026-05-14', actual: 3000, forecast: null },

    { date: '2026-05-15', actual: -3500, forecast: -3500 },

    { date: '2026-05-16', actual: null, forecast: -3800 },
    { date: '2026-05-17', actual: null, forecast: -4200 },
    { date: '2026-05-18', actual: null, forecast: -4100 },
    { date: '2026-05-19', actual: null, forecast: -4600 },
    { date: '2026-05-20', actual: null, forecast: -5000 },
    { date: '2026-05-21', actual: null, forecast: -5300 },
    { date: '2026-05-22', actual: null, forecast: -4900 },
    { date: '2026-05-23', actual: null, forecast: -5500 },
    { date: '2026-05-24', actual: null, forecast: -6000 },
    { date: '2026-05-25', actual: null, forecast: -6400 },
  ];
  return (
    <div>
      <AliceHeader />
      <div className="flex mt-20 md:mt-5 flex-col gap-5">
        <ForecastChartCard data={forecastDummyData} />
        <OptimizeBudgetCard />
      </div>
    </div>
  );
}
