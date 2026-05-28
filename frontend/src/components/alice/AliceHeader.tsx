import { Icon } from '@iconify/react';
import { useHealth } from '../../hooks/useAliceHook';
import { useSegmentation } from '../../hooks/useAnalyzeHook';

export default function AliceHeader() {
  const { data: healthData, isPending } = useHealth();

  const { data: segmentationData, isLoading } = useSegmentation();

  const statusColor = healthData?.status === 'healthy' ? 'text-green-600' : 'text-red-600';
  return (
    <header className="fixed md:static bg-bg-main top-0 md:rounded-xl left-0 right-0 p-3 flex flex-row items-center justify-between ring-1 ring-primary">
      <div>
        <h1 className="text-xl font-bold text-text-main">A.L.I.C.E</h1>
        <div className="flex justify-between">
          <Icon className={statusColor} icon={'stash:circle-duotone'} />
          {isPending ? (
            <span className="text-sm text-gray-500">Checking health...</span>
          ) : (
            <h3 className="text-xs text-text-muted">AI: {healthData?.status.toUpperCase()}</h3>
          )}
        </div>
      </div>
      <h2 className="text-xs font-medium text-blue-400 bg-blue-400/25 rounded-xl p-1 px-2 ring-1 ring-blue-400/60">
        {isLoading
          ? 'Loading...'
          : segmentationData?.data?.segment_label.toUpperCase() || 'No Label'}
      </h2>
    </header>
  );
}
