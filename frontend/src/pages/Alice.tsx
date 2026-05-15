import AliceHeader from '../components/alice/AliceHeader';
import ForecastChartCard from '../components/alice/ForecastChartCard';
import OptimizeBudgetCard from '../components/alice/OptimizeBudgetCard';

export default function Alice() {
  const forecastData = [
    { date: '2026-05-16', forecast: '4941555' },
    { date: '2026-05-17', forecast: '4967145' },
    { date: '2026-05-18', forecast: '5028990' },
    { date: '2026-05-19', forecast: '5032710' },
    { date: '2026-05-20', forecast: '5109180' },
    { date: '2026-05-21', forecast: '5159370' },
    { date: '2026-05-22', forecast: '5197230' },
    { date: '2026-05-23', forecast: '5241405' },
    { date: '2026-05-24', forecast: '5258775' },
    { date: '2026-05-25', forecast: '5325240' },
  ];

  return (
    <div>
      <AliceHeader />
      <div className="flex mt-20 md:mt-5 flex-col gap-5">
        <ForecastChartCard data={forecastData} />
        <OptimizeBudgetCard />
      </div>
    </div>
  );
}
