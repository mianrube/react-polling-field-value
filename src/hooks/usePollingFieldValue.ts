import { useState, useEffect, useRef, useCallback } from 'react';

import axios from 'axios';

export enum PollingStatus {
  Polling,
  Success,
  Error,
  MaxRetriesReached,
}

export interface PollingOptions<T> {
  apiUrl: string;
  fieldName: string;
  successTargetValue: T;
  errorTargetValue: T;
  pollingInterval: number;
  maxRetries: number;
}

const fetchField = async <T>(apiUrl: string, fieldName: string): Promise<T> => {
  const response = await axios.get(apiUrl);
  return response.data[fieldName];
};

export const usePollingFieldValue = <T>({
  apiUrl,
  fieldName,
  successTargetValue,
  errorTargetValue,
  pollingInterval,
  maxRetries,
}: PollingOptions<T>): PollingStatus => {
  const [status, setStatus] = useState<PollingStatus>(PollingStatus.Polling);
  const [retryCount, setRetryCount] = useState<number>(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearPollingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(retryCount + 1);
    } else {
      setStatus(PollingStatus.MaxRetriesReached);
      clearPollingInterval();
    }
  }, [retryCount, maxRetries, clearPollingInterval]);

  useEffect(() => {
    const matchTargetValue = async () => {
      try {
        const newValue: T = await fetchField<T>(apiUrl, fieldName);

        if (newValue === successTargetValue) {
          setStatus(PollingStatus.Success);
          clearPollingInterval();
        } else if (newValue === errorTargetValue) {
          setStatus(PollingStatus.Error);
          clearPollingInterval();
        } else {
          handleRetry();
        }
      } catch (error) {
        handleRetry();
      }
    };

    if (status === PollingStatus.Polling && maxRetries > 0) {
      intervalRef.current = setInterval(matchTargetValue, pollingInterval);
    }

    return () => {
      clearPollingInterval();
    };
  }, [
    apiUrl,
    fieldName,
    successTargetValue,
    errorTargetValue,
    pollingInterval,
    maxRetries,
    retryCount,
    status,
    clearPollingInterval,
    handleRetry,
  ]);

  return status;
};
