import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();

  }, []);

  // Add a new task
  const addTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/tasks', {
        name: taskName,
        estimatedTime,
      });
      setTasks([...tasks, response.data]);
      setTaskName('');
      setEstimatedTime('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Update task status
  const updateTaskStatus = async (id, action) => {
    try {
      const response = await axios.put(`http://localhost:5000/tasks/${id}`, { action });
      if (action === 'complete') {
        setTasks(tasks.filter((task) => task._id !== id));
      } else {
        setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Task Manager</h1>
      <form
        onSubmit={addTask}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6 w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taskName">
            Task Name
          </label>
          <input
            id="taskName"
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter task name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estimatedTime">
            Estimated Time (in seconds)
          </label>
          <input
            id="estimatedTime"
            type="number"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter estimated time"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Task
        </button>
      </form>

      <div className="w-full max-w-2xl">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white shadow-md rounded px-6 py-4 mb-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-bold">{task.name}</h3>
              <p className="text-sm text-gray-600">Estimated Time: {task.estimatedTime} seconds</p>
              <p className="text-sm text-gray-600">Elapsed Time: {task.elapsedTime} seconds</p>
              <p className={`text-sm font-semibold ${task.status === 'Running' ? 'text-green-600' : 'text-gray-600'}`}>
                Status: {task.status}
              </p>
            </div>
            <div className="flex gap-2">
              {task.status === 'Running' ? (
                <button
                  onClick={() => updateTaskStatus(task._id, 'pause')}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={() => updateTaskStatus(task._id, 'start')}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Start
                </button>
              )}
              <button
                onClick={() => updateTaskStatus(task._id, 'complete')}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
