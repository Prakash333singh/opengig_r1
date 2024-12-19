import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/tasks';

function task() {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');

    // Fetch tasks from the server
    const fetchTasks = async () => {
        try {
            const response = await axios.get(API_URL);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Add a new task
    const addTask = async () => {
        try {
            const response = await axios.post(API_URL, {
                name: taskName,
                estimatedTime: Number(estimatedTime),
            });
            setTasks([...tasks, response.data]);
            setTaskName('');
            setEstimatedTime('');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    // Update task status
    const updateTask = async (id, action) => {
        try {
            await axios.put(`${API_URL}/${id}`, { action });
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Task Manager</h1>
            <div>
                <input
                    type="text"
                    placeholder="Task Name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Estimated Time (in seconds)"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                />
                <button onClick={addTask}>Add Task</button>
            </div>
            <h2>Tasks</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <strong>{task.name}</strong> - {task.estimatedTime}s
                        <br />
                        Timer: {task.status} | Elapsed: {task.elapsedTime}s
                        <br />
                        <button onClick={() => updateTask(task.id, 'start')}>Start</button>
                        <button onClick={() => updateTask(task.id, 'pause')}>Pause</button>
                        <button onClick={() => updateTask(task.id, 'complete')}>
                            Complete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default task;
