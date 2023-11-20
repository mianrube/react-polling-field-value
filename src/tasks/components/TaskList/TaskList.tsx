import { useState, useEffect } from 'react';
import axios from 'axios';

import { Task } from '../../types/interfaces';
import { TaskItem, TaskItemWithPolling } from '..';

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchData = async () => {
    try {
      const { data } = await axios.get<Task[]>(
        'https://localhost:7157/api/v1.0/Tasks'
      );

      // Ordenar por descripción para pruebas
      data.sort((a, b) => {
        if (a.description < b.description) {
          return -1;
        }
        if (a.description > b.description) {
          return 1;
        }
        return 0;
      });

      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async () => {
    const newTask = {
      title: 'Procesando',
      description: new Date().getTime().toString(),
      isccompleted: false,
    };

    try {
      await axios.post('https://localhost:7157/api/v1.0/Tasks', newTask);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      TaskList
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) =>
            task.title === 'Procesando' ? (
              <TaskItemWithPolling key={task.id} task={task} />
            ) : (
              <TaskItem key={task.id} task={task} />
            )
          )}
        </tbody>
      </table>
      <hr />
      <button onClick={addTask}>Add Task</button>
    </div>
  );
};
