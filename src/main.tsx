import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App.tsx';
import './index.css';
import { TaskList } from './tasks/components';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TaskList />
  </React.StrictMode>
);
