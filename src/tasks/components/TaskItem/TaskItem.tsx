import { Task } from '../../types/interfaces';

interface TaskItemProps {
  task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  return (
    <tr>
      <td>{task.id}</td>
      <td>{task.description}</td>
      <td>{task.title}</td>
      <td></td>
    </tr>
  );
};
