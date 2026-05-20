import { useState } from 'react';
import type { StatusType } from './StatusContext';

import { StatusContext } from './StatusContext';

export const StatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<StatusType>('idle');
  const [message, setMessage] = useState('');
  const [statusCode, setStatusCode] = useState<number | undefined>(undefined);

  const showLoading = () => {
    setStatus('loading');
    setMessage('');
    setStatusCode(undefined);
  };

  const showSuccess = (msg: string) => {
    setStatus('success');
    setMessage(msg);
    setStatusCode(undefined);
    setTimeout(() => setStatus('idle'), 3000);
  };

  const showError = (msg: string, code?: number) => {
    setStatus('error');
    setMessage(msg);
    setStatusCode(code);
    setTimeout(() => setStatus('idle'), 5000);
  };

  const hideStatus = () => setStatus('idle');

  return (
    <StatusContext
      value={{ status, message, statusCode, showLoading, showSuccess, showError, hideStatus }}
    >
      {children}
    </StatusContext>
  );
};
