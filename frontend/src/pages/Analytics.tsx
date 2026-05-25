import AnalyticsHeader from '../components/analytics/AnalyticsHeader';
import AnalyticsCard from '../components/analytics/AnalyticsCard';
import AnalyticsChart from '../components/analytics/AnalyticsChart';

export default function Analytics() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 h-full md:gap-4 bg-green-200">
      <div className="flex flex-col px-5 pt-5 bg-green-200 w-full rounded-lg">
        <AnalyticsHeader />
        <div className="flex-1 min-h-0 w-full relative overflow-hidden pt-5">
          <AnalyticsChart />
        </div>
      </div>

      <div className="w-full h-105 flex flex-col lg:pt-16 lg:h-full  overflow-hidden -mt-1.5">
        <div className="flex-1 w-full lg:h-full  bg-bg-main rounded-tl-2xl rounded-tr-2xl border-t-2 border-primary/50 pt overflow-hidden flex flex-col">
          <AnalyticsCard />
        </div>
      </div>
    </section>
  );
}
