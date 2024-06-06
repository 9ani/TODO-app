"use client"
import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState('all');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      setTasks(savedTasks);
      setIsInitialized(true); 
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isInitialized]);

  const handleAddTask = () => {
    if (newTaskText) {
      setTasks([...tasks, { id: Date.now(), text: newTaskText, completed: false }]);
      setNewTaskText('');
    }
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleFilterChange = (newFilter) => setFilter(newFilter);

  const handleClearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">TODO</h1>
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          className="bg-gray-800 text-white border-none rounded p-4 flex-grow"
          placeholder="What to do?"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white p-4 rounded ml-4"
        >
          Add Task
        </button>
      </div>
      <div className="bg-gray-800 rounded p-4">
        {isInitialized ? (
          <TaskList
            tasks={filteredTasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <p>Loading tasks...</p> 
        )}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
          <span>{tasks.filter(task => !task.completed).length} items left</span>
          <div>
            <button
              onClick={() => handleFilterChange('all')}
              className={`mr-2 ${filter === 'all' ? 'text-white' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('active')}
              className={`mr-2 ${filter === 'active' ? 'text-white' : ''}`}
            >
              Active
            </button>
            <button
              onClick={() => handleFilterChange('completed')}
              className={`${filter === 'completed' ? 'text-white' : ''}`}
            >
              Completed
            </button>
          </div>
          <button
            onClick={handleClearCompleted}
            className="text-gray-400 hover:text-white"
          >
            Clear Completed
          </button>
        </div>
      </div>
    </div>
  );
}
