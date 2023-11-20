import { useEffect, useState } from 'react';
import axios from 'axios';

import { Task } from '../../types/interfaces';
import {
  PollingOptions,
  PollingStatus,
  usePollingFieldValue,
} from '../../../hooks';

interface TaskItemWithPollingProps {
  task: Task;
}

export const TaskItemWithPolling = ({ task }: TaskItemWithPollingProps) => {
  const [status, setStatus] = useState<string>(task.title);

  const pollingOptions: PollingOptions<string> = {
    apiUrl: `https://localhost:7157/api/v1.0/Tasks/${task.id}`,
    fieldName: 'title',
    successTargetValue: 'Procesado',
    errorTargetValue: 'Error',
    pollingInterval: 5000,
    maxRetries: 5,
  };

  const pollingStatus = usePollingFieldValue(pollingOptions);

  useEffect(() => {
    if (pollingStatus === PollingStatus.Success) {
      setStatus('Procesado');
    } else if (pollingStatus === PollingStatus.Error) {
      setStatus('Error');
    }
  }, [pollingStatus]);

  const handleSetSuccess = async () => {
    try {
      const taskSuccess: Task = {
        ...task,
        title: 'Procesado',
      };

      await axios.put<Task>(
        `https://localhost:7157/api/v1.0/Tasks/${task.id}`,
        taskSuccess
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetError = async () => {
    try {
      const taskError: Task = {
        ...task,
        title: 'Error',
      };

      await axios.put<Task>(
        `https://localhost:7157/api/v1.0/Tasks/${task.id}`,
        taskError
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <tr>
      <td>{task.id}</td>
      <td>{task.description}</td>
      <td>{status}</td>
      <td>
        <button onClick={handleSetSuccess}>Procesado</button>
        <button onClick={handleSetError}>Error</button>
      </td>
    </tr>
  );
};
