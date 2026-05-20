import { Icon } from '@iconify/react';
import { useStatus } from '../context/StatusContext';

const StatusIndicator = () => {
  const { status, message, statusCode, hideStatus } = useStatus();

  if (status === 'idle') return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center pointer-events-none">
      {status === 'loading' && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-200">
            <Icon icon="line-md:loading-twotone-loop" className="text-4xl text-blue-500" />
            <p className="font-medium text-gray-600">Mohon tunggu...</p>
          </div>
        </div>
      )}

      {(status === 'success' || status === 'error') && (
        <div className="absolute top-10 md:right-10 mx-10 md:mx-0 pointer-events-auto animate-in slide-in-from-right-full duration-300">
          <div
            className={`flex items-center gap-3 p-4 pr-6 rounded-3xl shadow-xl text-white min-w-75 ${
              status === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <div className="bg-white/20 p-2 rounded-2xl">
              <Icon
                icon={status === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'}
                className="text-2xl"
              />
            </div>
            <div className="flex flex-col flex-1">
              <p className="font-medium">{message}</p>
              {status === 'error' && statusCode && (
                <span className="text-xs opacity-80 font-mono">Error Code: {statusCode}</span>
              )}
            </div>
            <button onClick={hideStatus} className="hover:opacity-70 transition-opacity">
              <Icon icon="mdi:close" className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
